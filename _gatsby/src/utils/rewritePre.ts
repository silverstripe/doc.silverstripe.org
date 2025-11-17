import { DomElement, domToReact } from "html-react-parser";
import { ReactElement } from "react";

/**
 * Add a copy to clipboard button to pre tags that are used for code snippets
 */
const rewritePre = (domNode: DomElement): ReactElement | false => {
    const copyText = 'Copy';
    const copiedText = 'Copied';
    const copyButton: DomElement = {
        type: 'tag',
        name: 'button',
        attribs: {
            className: 'btn btn-sm copy-button',
            title: 'Copy to clipboard',
            onClick: (evt: Event) => {
                const buttonEl = evt.target;
                const codeEl = buttonEl.parentNode.querySelector('code');
                const text = codeEl.innerText;
                navigator.clipboard.writeText(text);
                buttonEl.innerHTML = copiedText;
                setTimeout(() => buttonEl.innerHTML = copyText, 3000);
            }
        },
        children: [{
            data: copyText,
            type: 'text',
        }],
    };
    domNode.children.unshift(copyButton);
    return domToReact(domNode);
};

export default rewritePre;
