import { ReactElement, createElement } from 'react';
import { DomElement, HTMLReactParserOptions, domToReact } from "html-react-parser";
import CalloutBlock from '../components/CalloutBlock';

/**
 * Turn [hint] and other callouts into a proper React component.
 * @param data
 */
const parseCalloutTags = (type: string, domChildren: DomElement[], parseOptions: HTMLReactParserOptions): ReactElement|false => {
    return createElement(CalloutBlock, {
        type,
        content: domToReact(domChildren, parseOptions),
    });
};

export default parseCalloutTags;