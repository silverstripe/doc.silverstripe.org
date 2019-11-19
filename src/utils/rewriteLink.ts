import { createElement, ReactElement } from 'react';
import { domToReact, DomElement, HTMLReactParserOptions } from 'html-react-parser';
import { Link } from 'gatsby';
import rewriteAPILink from './rewriteAPILink';
import { getCurrentNode, getCurrentVersion } from '../utils/nodes';
import path from 'path';

interface LinkAttributes {
    href?: string;
};


/**
 * Ensure links use the Gatsby <Link /> component. Client-side routing FTW
 * 
 * @param attribs
 * @param children 
 * @param parseOptions 
 */
const rewriteLink = (
    attribs: LinkAttributes,
    children: DomElement[],
    parseOptions: HTMLReactParserOptions
): ReactElement|false => {
    const { href } = attribs;
    if (!href) {
        return false;
    }

    const currentNode = getCurrentNode();
    const version = getCurrentVersion();

    // shorthand api links
    if (href.match(/^api\:/)) {
        const newHref = rewriteAPILink(href);
        return createElement(
            'a',
            { 
                className: 'api-link',
                href: newHref,
                target: '_blank' 
            },
            domToReact(children, parseOptions)
        );
    }

    // explicit API links
    if (href.match(/api\.silverstripe\.org/)) {
        return createElement(
            'a',
            {
                className: 'api-link',
                href,
                target: '_blank',
            },
            domToReact(children, parseOptions)
        )
    }

    // absolute links
    if (href.match(/^https?/)) {
        return createElement(
            'a',
            { href, target: '_blank' },
            domToReact(children, parseOptions)
        );
    }

    // Relative to root
    if (href.startsWith('/')) {
        return createElement(
            Link,
            {
                to: path.join('/', 'en', version, href),
                className: 'gatsby-link'
            },
            domToReact(children, parseOptions)
        )
    }

    // Relative to page
    if (currentNode && currentNode.parentSlug) {
        return createElement(
            Link,
            { 
                to: path.join(currentNode.parentSlug, href),
                className: 'gatsby-link'
            },
            domToReact(children, parseOptions)
        )    
    }

    // All else fails, just return the link as is.
    return createElement(
        Link,
        {
            to: path.join('/', href),
            className: 'gatsby-link',
        },
        domToReact(children, parseOptions)
    );

}

export default rewriteLink;

    