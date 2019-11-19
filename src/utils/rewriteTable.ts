import { DomElement, HTMLReactParserOptions, domToReact } from "html-react-parser";
import { ReactElement, createElement } from "react";

/**
 * Ensure tables are responsive-ish
 * 
 * @param domChildren
 * @param parseOptions 
 */
const rewriteTable = (domChildren: DomElement[], parseOptions: HTMLReactParserOptions): ReactElement => {
    return createElement(
        'div',
        { className: 'table-responsive my-4'},
        createElement(
            'table',
            { className: 'table table-striped' },
            domToReact(domChildren, parseOptions)
        )
    );
};

export default rewriteTable;