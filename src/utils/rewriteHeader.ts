import { createElement, ReactElement } from "react";
import { DomElement } from 'html-react-parser';

const rewriteHeaders = (domNode: DomElement): ReactElement | false => {
    if (!domNode.name) {
        return false;
    }
    const firstChild = domNode.children ? domNode.children[0] : null;
    if (firstChild && firstChild.type === 'text') {
        const { data } = firstChild;
        const matches = data.match(/^(.*?){#([A-Za-z0-9_-]+)\}$/);
        if (matches) {
            const header = matches[1]
            const id = matches[2];
            return createElement(
                domNode.name,
                { id },
                header
            );
        }
    }

    return false;
}

export default rewriteHeaders;