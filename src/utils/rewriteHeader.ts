import { createElement, ReactElement } from "react";
import { DomElement } from 'html-react-parser';

const generateID = (title: string): string => {
    return title
        .replace('&amp;', '-and-')
        .replace('&', '-and-')
        .replace(/[^A-Za-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-/g, '')
        .replace(/-$/g, '')
        .toLowerCase();
}
/**
 * If a header has a {#explicit-id}, add it as an attribute
 * @param domNode 
 */
const rewriteHeaders = (domNode: DomElement): ReactElement | false => {
    if (!domNode.name) {
        return false;
    }
    const firstChild = domNode.children ? domNode.children[0] : null;
    if (firstChild && firstChild.type === 'text') {
        const { data } = firstChild;
        const matches = data.match(/^(.*?){#([A-Za-z0-9_-]+)\}$/);
        let header;
        let id;
        if (matches) {
            header = matches[1];
            id = matches[2];
        } else {
            header = data;
            id = generateID(data);
        }

        return createElement(
            domNode.name,
            { id },
            header
        );

    }

    return false;
}


export default rewriteHeaders;