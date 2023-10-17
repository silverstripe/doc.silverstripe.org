import parse, { DomElement } from 'html-react-parser';
import cleanChildrenTags from './cleanChildrenTags';
import cleanWhitespace from './cleanWhitespace';
import cleanApiTags from './cleanApiTags';
import rewriteLink from './rewriteLink';
import parseChildrenOf from './parseChildrenOf';
import cleanCalloutTags from './cleanCalloutTags';
import { ReactElement } from 'react';
import rewriteTable from './rewriteTable';
import rewriteHeader from './rewriteHeader';
import cleanHeaders from './cleanHeaders';
import parseCalloutTags from './parseCalloutTags';

/**
 * Replace all the [CHILDREN] with proper React components.
 * @param html 
 * @return ReactElement | ReactElement[] | string
 */
const parseHTML = (html: string): ReactElement | ReactElement[] | string => {
    let cleanHTML = html;
    cleanHTML = cleanChildrenTags(cleanHTML);
    cleanHTML = cleanCalloutTags(cleanHTML);
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
            }
            if (domNode.data && domNode.parent?.name !== 'code') {
                const { data } = domNode;
                if (data.match(/\[CHILDREN.*?\]/)) {
                    return parseChildrenOf(data);
                }
                return parseCalloutTags(data);
            }

            return false;
        }
    };
    const component = parse(cleanHTML, parseOptions);

    return component;
};

export default parseHTML;