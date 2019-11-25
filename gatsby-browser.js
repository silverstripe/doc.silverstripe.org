require("prismjs/themes/prism-okaidia.css");
require("./src/theme/assets/scss/theme.scss");
require('./src/theme/assets/fontawesome/css/all.css');
require('./src/theme/assets/search/algolia.css');

const React = require('react');
const Layout = require('./src/components/Layout').default;
const NodeProvider = require('./src/components/NodeProvider').default;
const smoothScroll = require('smooth-scroll');


if (typeof window !== "undefined") {
    smoothScroll('a[href*="#"]')
  }  

/**
 * Ensures the chrome doesn't rerender every page load, which makes the sidebar reset its scroll.
 */
exports.wrapPageElement = ({ element, props }) => {
    return (
      <NodeProvider {...props}>
          <Layout {...props}>
            {element}
          </Layout>
      </NodeProvider>
    );
};


exports.onRouteUpdate = ({location}) => {
  if (window.ga && process.env.NODE_ENV === 'production') {
    window.ga('send', 'pageview');
  }
  anchorScroll(location);
  return true;
};

exports.shouldUpdateScroll = ({
  routerProps: { location },
}) => {
  anchorScroll(location);
  return true;
}

const anchorScroll = location => {
  // Check for location so build does not fail
  if (location && location.hash) {
    setTimeout(() => {
      const item = document.querySelector(`${location.hash}`).offsetTop;
      const mainNavHeight = document.querySelector(`header`).offsetHeight;
      window.scrollTo({top: item - mainNavHeight, left: 0, behavior: 'smooth'});
    }, 0);
  }
}