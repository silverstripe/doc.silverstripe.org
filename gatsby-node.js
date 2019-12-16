const path = require('path');
const fs = require('fs');
const { createFilePath } = require(`gatsby-source-filesystem`);
const fileToTitle = require('./src/utils/fileToTitle');

const createSlug = (filePath, version) => {
  const parts = filePath.split('/');
  const langIndex = parts.indexOf('en');
  parts.splice(langIndex + 1, 0, version);
  return parts
  .map(part => part.replace(/^\d+_/, ''))
  .join('/')
  .toLowerCase()
};

exports.onCreateNode = async ({ node, getNode, getNodesByType, actions, createNodeId, createContentDigest }) => {
  if (node.internal.type !== 'MarkdownRemark') {
    return;
  }
  const { createNode } = actions;
  const fileNode = getNode(node.parent);
  const version = fileNode.sourceInstanceName;

  // The gatsby-source-filesystem plugins are registered to collect from the same path
  // that the git source writes to, so we get the watch task (hot reload on content changes)
  // But we don't want duplicate document pages for each source plugin, so
  // we bail out if we already have the file. However, we need to ensure
  // the file is injected into the template as a dependency, so when the content changes,
  // the pages get refreshed on the fly.
  if (version.match(/^watcher--/)) {
    const existing = getNodesByType('SilverstripeDocument')
      .find(n => n.fileAbsolutePath === node.fileAbsolutePath);

    if (existing) {
      // Pair the document with its watched file so we can inject it into the template
      // as a dependency.
      existing.watchFile___NODE = node.id;
      return;
    }
  }

  const filePath = createFilePath({
    node,
    getNode,
    basePath: `docs`
  });
  let fileTitle = path.basename(node.fileAbsolutePath, '.md');
  const isIndex = fileTitle === 'index';
  if (isIndex) {
    fileTitle = path.basename(path.dirname(node.fileAbsolutePath));
  }
  const docTitle = fileToTitle(fileTitle);
  const slug = createSlug(filePath, version);
  const parentSlug = `${path.resolve(slug, '../')}/`;
  const unhideSelf = false;

  const docData = {
    isIndex,
    filePath,
    fileTitle,
    slug,
    parentSlug,
    unhideSelf,
    ...node.frontmatter,
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


exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

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

};

exports.onPostBuild = async ({ getNodesByType }) => {
  console.log(`Writing legacy redirects...`);
  const redirects = new Map();
  const v4docs = getNodesByType('SilverstripeDocument').filter(n => n.slug.match(/^\/en\/4\//));
  const v3docs = getNodesByType('SilverstripeDocument').filter(n => n.slug.match(/^\/en\/3\//));
  
  [...v4docs, ...v3docs].forEach(n => {
    const legacy = n.slug.replace(/^\/en\/[0-9]\//, '/en/');
    if (!redirects.has(legacy)) {
      redirects.set(legacy, n.slug);
    }
  });
  const lines = [];
  redirects.forEach((slug, legacy) => {
    lines.push(`${legacy}  ${slug}`);
  });

  fs.writeFileSync(path.join(__dirname, 'static', '_redirects'),
  `### This file is auto-generated. Do not modify ###

  ${lines.join("\n")}`
  );

  
  return Promise.resolve();
}
