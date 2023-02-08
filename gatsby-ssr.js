const React = require('react');
const Layout = require('./src/components/Layout').default;
const NodeProvider = require('./src/components/NodeProvider').default;
const { setCurrentPath } = require('./src/utils/nodes');

/**
 * Applies the node provider (static query of all documents)
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

exports.onRenderBody = ({ setPostBodyComponents, setHeadComponents, pathname }) => {
    // Rules that cannot be touched by purgecss because they come in from client side rendering
    setHeadComponents([ 
        <style key='prism-css' type="text/css" dangerouslySetInnerHTML={{
            __html: `
                :not(pre) > code[class*="language-"] {
                    background: #f5f6f8;
                    color: #5d6778;
                    text-shadow: none;
                }                
                .algolia-autocomplete {
                    width: 100%;
                }
                .gatsby-highlight {
                    margin: 2rem 0;
                }                
                `
          }} />,
          // this is being done as a quick work around as there's issues when building css
          <style type="text/css" dangerouslySetInnerHTML={{
            __html: `
                .api-link code {
                    text-decoration: underline;
                    color: #5d6778;
                }
                .api-link code:hover,
                .api-link code:active {
                    text-decoration: none;
                }
            `
          }} />
    ]);
    setPostBodyComponents([
    <script key='docsearch' type="text/javascript" src="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js" />,
    process.env.NODE_ENV === 'production' && 
    <script key='ga' dangerouslySetInnerHTML={{
        __html: `
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    
            ga('create', 'UA-84547-17', 'auto', {'allowLinker': true});
            ga('require', 'linker');
            ga('linker:autoLink', [
                'www.silverstripe.com',
                'www.silverstripe.org',
                'addons.silverstripe.org',
                'api.silverstripe.org',
                'docs.silverstripe.org',
                'userhelp.silverstripe.org',
                'demo.silverstripe.org'
            ]);
            ga('send', 'pageview')            
        `
    }} />
    ])
};