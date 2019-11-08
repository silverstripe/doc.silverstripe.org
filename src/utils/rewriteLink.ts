import { createElement, ReactElement } from 'react';
import { domToReact, DomElement, HTMLReactParserOptions } from 'html-react-parser';
import { Link } from 'gatsby';
import rewriteAPILink from './rewriteAPILink';
import { getCurrentNode } from '../utils/nodes';
import path from 'path';

interface LinkAttributes {
    href?: string;
};


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
    
    // api links
    if (href.match(/^api\:/)) {
        const newHref = rewriteAPILink(href);
        return createElement(
            'a',
            { href: newHref, target: '_blank' },
            domToReact(children, parseOptions)
        );
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
    if (href.substring(0, 1) === '/') {
        return createElement(
            Link,
            { to: href, className: 'gatsby-link' },
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

    