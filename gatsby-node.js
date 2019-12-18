const path = require('path');
const fs = require('fs');
const { createFilePath } = require(`gatsby-source-filesystem`);
const fileToTitle = require('./src/utils/fileToTitle');

const createSlug = ({path, version, thirdparty}) => {
  const rest = path.split('/');
  const parts = [
    'en',
    version,
    // thirdparty modules are explicitly pathed
    thirdparty,
    ...rest,
  ].filter(p => p);

   const slug = parts
    .map(part => part.replace(/^\d+_/, ''))
    .join('/')
    .toLowerCase();

    return `/${slug}/`;
};

const parseName = name => name.split('--');

exports.onCreateNode = async ({ node, getNode, getNodesByType, actions, createNodeId, createContentDigest }) => {  
  if (node.internal.type !== 'MarkdownRemark') {
    return;
  }
  const { createNode } = actions;
  const fileNode = getNode(node.parent);
  const [category, version, thirdparty] = parseName(fileNode.sourceInstanceName);

  // The gatsby-sgatsbource-filesystem plugins are registered to collect from the same path
  // that the git source writes to, so we get the watch task (hot reload on content changes)
  // But we don't want duplicate document pages for each source plugin, so
  // we bail out if we already have the file. However, we need to ensure
  // the file is injected into the template as a dependency, so when the content changes,
  // the pages get refreshed on the fly.
  if (category === 'watcher') {
    const existing = getNodesByType('SilverstripeDocument')
      .find(n => n.fileAbsolutePath === node.fileAbsolutePath);

    if (existing) {
      // Pair the document with its watched file so we can inject it into the template
      // as a dependency.
      existing.watchFile___NODE = node.id;
    }
    return;
  }   
  const basePath = category === 'user' ? `docs/en/userguide` : `docs/en`;
  const filePath = createFilePath({
    node,
    getNode,
    basePath,
  });
  let fileTitle = path.basename(node.fileAbsolutePath, '.md');
  const isIndex = fileTitle === 'index';
  if (isIndex) {
    fileTitle = path.basename(path.dirname(node.fileAbsolutePath));
  }
  const docTitle = fileToTitle(fileTitle);
  const slug = createSlug({
    path: filePath,
    version,
    thirdparty,
  });
  
  const parentSlug = `${path.resolve(slug, '../')}/`;
  const unhideSelf = false;

  // Most of these don't exist in userhelp, so force them into the schema by un-nulling them.
  const frontmatter = {
    introduction: ``,
    icon: `file-alt`,
    iconBrand: ``,
    hideChildren: false,
    ...node.frontmatter,
  };

  const docData = {
    isIndex,
    filePath,
    fileTitle,
    slug,
    parentSlug,
    unhideSelf,
    category,
    ...frontmatter,    
  };

  if (!docData.title || docData.title === '') {
    docData.title = docTitle;
  }

  const docInternal = {
      type: `SilverstripeDocument`,
      contentDigest: createContentDigest({
        ...docData,
        rawMarkdownBody: node.rawMarkdownBody,
      }),
  };
  const nodeData = {
    ...node,
    id: createNodeId(`SilverstripeDocument${node.id}`),
    ...docData,
    parent: node.id,
    internal: docInternal,
  }
  createNode(nodeData);
};


exports.createPages = async ({ actions, graphql, getNodesByType }) => {
  const { createPage, createRedirect } = actions;

  const docTemplate = path.resolve(`src/templates/docs-template.tsx`);
  const result = await graphql(`
  {
    allSilverstripeDocument {
      nodes {
        id
        slug
      }
    }
  }`);


    if (result.errors) {
        throw new Error(result.errors);
    }
    result.data.allSilverstripeDocument.nodes
        .forEach(node => {
            createPage({
                path: node.slug,
                component: docTemplate,
                context: {
                    id: node.id,
                    slug: node.slug,
                }
            });
        })


    console.log(`Creating legacy redirects...`);
    const redirects = new Map();
    const v4docs = getNodesByType('SilverstripeDocument').filter(n => n.slug.match(/^\/en\/4\//));
    const v3docs = getNodesByType('SilverstripeDocument').filter(n => n.slug.match(/^\/en\/3\//));
    
    [...v4docs, ...v3docs].forEach(n => {
      const legacy = n.slug.replace(/^\/en\/[0-9]\//, '/en/');
      if (!redirects.has(legacy)) {
        redirects.set(legacy, n.slug);
      }
    });
    redirects.forEach((toPath, fromPath) => {
      createRedirect({ fromPath, toPath, isPermanent: true });
    });
  
    
      
};