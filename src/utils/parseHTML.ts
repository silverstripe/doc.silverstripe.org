import parse, { DomElement, domToReact } from 'html-react-parser';
import cleanChildrenTags from './cleanChildrenTags';
import cleanWhitespace from './cleanWhitespace';
import cleanApiTags from './cleanApiTags';
import rewriteLink from './rewriteLink';
import parseChildrenOf from './parseChildrenOf';
import { ReactElement } from 'react';
import rewriteTable from './rewriteTable';
import rewriteHeader from './rewriteHeader';
import cleanHeaders from './cleanHeaders';
import parseCalloutTags from './parseCalloutTags';

/**
 * Replace all the [CHILDREN] and callout tags with proper React components.
 * @param html 
 * @return ReactElement | ReactElement[] | string
 */
const parseHTML = (html: string): ReactElement | ReactElement[] | string => {
    let cleanHTML = html;
    cleanHTML = cleanChildrenTags(cleanHTML);
    cleanHTML = cleanWhitespace(cleanHTML);
    cleanHTML = cleanApiTags(cleanHTML);
    cleanHTML = cleanHeaders(cleanHTML);
    
    const parseOptions = {
        replace(domNode: DomElement): ReactElement | object | undefined | false {
            const { name, attribs, children } = domNode;
            const domChildren = children || [];
            if (name && attribs) {
                if (name === 'a') {
                    return rewriteLink(attribs, domChildren, parseOptions, domNode);
                }
                if (name === 'table') {
                    return rewriteTable(domChildren, parseOptions);
                }
                if (name.match(/^h[0-9]$/)) {
                    return rewriteHeader(domNode);
                }
                if (name === 'blockquote') {
                    for (const child of children) {
                        // For some reason blockquotes start with an empty new line with this parser.
                        if (child.type === 'text' && child.data === "\n") {
                            continue;
                        }
                        // If the first relevant child isn't a paragraph or is empty, it's not a callout block.
                        if (child.type !== 'tag' || child.name !== 'p' || !child.children?.length || child.children[0].type !== 'text') {
                            break;
                        }
                        // Check if the first text node marks this as a callout block
                        const firstTextNode = child.children[0];
                        const calloutTypeRegex = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\n/;
                        const matches = firstTextNode.data.match(calloutTypeRegex);
                        if (!matches) {
                            break;
                        }
                        // Remove the type marker and render the component
                        firstTextNode.data = firstTextNode.data.replace(calloutTypeRegex, '');
                        return parseCalloutTags(matches[1], children, parseOptions);
                    }
                }
            }
            if (domNode.data && domNode.parent?.name !== 'code') {
                const { data } = domNode;
                if (data.match(/\[CHILDREN.*?\]/)) {
                    return parseChildrenOf(data);
                }
            }

            return false;
        }
    };
    const component = parse(cleanHTML, parseOptions);

    return component;
};

export default parseHTML;