require("prismjs/themes/prism-okaidia.css");
require("./src/theme/assets/scss/theme.scss");
require('./src/theme/assets/fontawesome/css/all.css');
require('./src/theme/assets/search/algolia.css');
const smoothScroll = require('smooth-scroll');
const Layout = require('./src/components/Layout').default;
const React = require('react');

if (typeof window !== "undefined") {
    smoothScroll('a[href*="#"]')
  }  

exports.wrapPageElement = ({ element, props }) => {
    return <Layout {...props}>{element}</Layout>
};