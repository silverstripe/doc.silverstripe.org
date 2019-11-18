const path = require('path');
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

exports.onCreateNode = async ({ node, getNode, actions, createContentDigest }) => {  
  if (node.internal.type !== 'MarkdownRemark') {
    return;
  }
  const { createNode } = actions;
  const fileNode = getNode(node.parent);
  const version = fileNode.sourceInstanceName;
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
  
  const docData = {
    isIndex,
    filePath,
    fileTitle,
    slug,
    parentSlug,
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
    id: `ss-doc-${node.id}`,
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
