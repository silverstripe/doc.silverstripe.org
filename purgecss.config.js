const path = require('path');

// Standard keyword match for React components
class DefaultExtractor {
    static extract(content) {
        return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
    }
}

// Scan frontmatter in Markdown docs for icons that they use, e.g. "icon: database"
class IconExtractor {
    static extract(content) {
        const selectors = [`fa-file-alt`]
        const matches = content.match(/icon(Brand)?: ([a-zA-Z0-9_-]+)/);
        if (matches) {
          const isBrand = typeof matches[1] !== 'undefined';
          selectors.push(isBrand ? 'fab' : 'fas');
          selectors.push(`fa-${matches[2]}`);
        }
        return selectors;
    }
}

// Classes that are added at build time need to be explicitly ignored
const whitelist = [
    // Algolia
    'algolia-autocomplete',

    // Syntax highlighting
    'pre',
    'code',

    // Icon classes used in nodes.ts
    'far',
    'fa-calendar',
    'fa-check-circle',
    'fa-times-circle',
];

const whitelistPatterns = [
    /^callout-/,
];

const whitelistPatternsChildren = [
    /^table/,
];

module.exports = {
    printRejected: false,
    whitelist,
    whitelistPatterns,
    whitelistPatternsChildren,
    // Don't try to purge any CSS in the thirdparty libraries that do their own rendering
    // (syntax highlight, Algolia)
    ignore: [
        'prismjs/',
        'docsearch.js/',
        'src/theme/assets/search/algolia.css',
    ],
    content: [
      // All the markdown in the git repos
      path.join(process.cwd(), '.cache/gatsby-source-git/**/*.md'),
      // Components
      path.join(process.cwd(), 'src/components/!(*.d).{ts,js,jsx,tsx}'),
      // Static pages (e.g. 404)
      path.join(process.cwd(), 'src/pages/!(*.d).{ts,js,jsx,tsx}'),
      // Page templates
      path.join(process.cwd(), 'src/templates/!(*.d).{ts,js,jsx,tsx}'),
    ],
    extractors : [
        {
            extractor: DefaultExtractor,
            extensions: ['js', 'ts', 'jsx', 'tsx'],
        },
        {
            extractor: IconExtractor,
            extensions: ['md']
        }
    ],
};