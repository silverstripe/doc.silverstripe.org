require("prismjs/themes/prism-okaidia.css");
require("./src/theme/assets/scss/theme.scss");
require('./src/theme/assets/fontawesome/css/all.css');
require('./src/theme/assets/search/algolia.css');
const Layout = require('./src/components/Layout').default;
const React = require('react');

exports.wrapPageElement = ({ element, props }) => {
    return <Layout {...props}>{element}</Layout>
};

exports.onRouteUpdate = ({location}) => {
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