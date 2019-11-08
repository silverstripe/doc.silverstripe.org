require("prismjs/themes/prism-okaidia.css");
require("./src/theme/assets/scss/theme.scss");
require('./src/theme/assets/fontawesome/js/all.js');
const Layout = require('./src/components/Layout').default;
const React = require('react');

exports.wrapPageElement = ({ element, props }) => {
    return <Layout {...props}>{element}</Layout>
};