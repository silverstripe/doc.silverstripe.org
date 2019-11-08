const Layout = require('./src/components/Layout').default;
const React = require('react');

exports.wrapPageElement = ({ element, props }) => {
    return <Layout {...props}>{element}</Layout>
};