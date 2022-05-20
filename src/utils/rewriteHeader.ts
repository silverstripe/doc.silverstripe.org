import { createElement, ReactElement } from "react";
import { DomElement, domToReact, htmlToDOM } from 'html-react-parser';

/**
 * Generate the ID for a heading
 */
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
 * Get the full plain text of the heading for checking and generating the ID
 */
const getFullHeading = (element: DomElement): string => {
    let text = '';
    if (element.type === 'text') {
        text += element.data;
    }

    if (element.children) {
        for (const child of element.children) {
            text += getFullHeading(child);
        }
    }

    return text;
}

/**
 * If a header has a {#explicit-id}, add it as an attribute
 */
const rewriteHeaders = (domNode: DomElement): ReactElement | false => {
    if (!domNode.name) {
        return false;
    }

    const plainText = getFullHeading(domNode);

    if (plainText) {
        // const plainText = getFullHeading(firstChild);
        const matches = plainText.match(/^(.*?)\{#([A-Za-z0-9_-]+)\}$/);
        let header;
        let id;
        if (matches) {
            header = matches[1];
            id = matches[2];
        } else {
            header = plainText;
            id = generateID(plainText);
        }

        const anchor = htmlToDOM(`<a id="${id}" class="anchor" aria-hidden="true" href="#${id}">#</a>`)[0];

        const lastChild = domNode.children ? domNode.children[domNode.children.length - 1] : null;
        if (lastChild && lastChild.type === 'text') {
            lastChild.data = lastChild.data.replace(/\s*{#([A-Za-z0-9_-]+)\}$/, '');
        }

        domNode.children?.push(anchor);

        return domToReact([domNode]);

    }

    return false;
}


export default rewriteHeaders;