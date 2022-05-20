import { createElement, ReactElement } from 'react';
import { domToReact, DomElement, HTMLReactParserOptions } from 'html-react-parser';
import { Link } from 'gatsby';
import rewriteAPILink from './rewriteAPILink';
import { getCurrentNode, getCurrentVersion } from '../utils/nodes';
import path from 'path';
import { SilverstripeDocument } from '../types';

interface LinkAttributes {
    href?: string;
    class?: string;
};


const relativeLink = (currentNode: SilverstripeDocument, href: string): string => {
    const slug = path.join(currentNode.isIndex ? currentNode.slug : currentNode.parentSlug, href);
    if (!slug.endsWith('/')) {
        return `${slug}/`
    }

    return slug;
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
    parseOptions: HTMLReactParserOptions,
    domNode: DomElement
): ReactElement|false => {
    const { href } = attribs;
    if (!href) {
        return false;
    }

    const currentNode = getCurrentNode();
    const version = getCurrentVersion();

    // mailto links
    if (href.startsWith('mailto:')) {
        return createElement(
            'a',
            { href },
            domToReact(children, parseOptions)
        );
    }

    // hash links
    if (href.startsWith('#')) {
        // Just let normal parsing occur for heading links
        if (attribs.class === 'anchor') {
            return domToReact(domNode);
        }
        // rewrite all other hashlinks
        return createElement(
            Link,
            { 
                to: path.join(currentNode?.slug, href),
                className: 'gatsby-link'
            },
            domToReact(children, parseOptions)
        );   
    }

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
        // Relative links to markdown files should be resolved to their pretty urls.
        if (href.endsWith('.md')) {
            return createElement(
                Link,
                {
                    to: relativeLink(currentNode, href.replace(/\.md$/, '')),
                    className: 'gatsby-link',
                },
                domToReact(children, parseOptions)
            )
        }
        const hashMatches = href.match(/(\.md#([A-Za-z0-9_-]+))$/);
        if (hashMatches) {
            const newHashLink = href.replace(
                new RegExp(`${hashMatches[1]}$`),
                `#${hashMatches[2]}`
            );

            return createElement(
                Link,
                {
                    to: relativeLink(currentNode, newHashLink).replace(/\/$/, ''),
                    className: 'gatsby-link',
                },
                domToReact(children, parseOptions)
            )
        }
    
        return createElement(
            Link,
            { 
                to: relativeLink(currentNode, href),
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

    