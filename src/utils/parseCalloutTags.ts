import { ReactElement, createElement } from 'react';
import CalloutBlock from '../components/CalloutBlock';

/**
 * Turn [hint] and other callouts into a proper React component.
 * @param data
 */
const parseCalloutTags = (type: string, content: any): ReactElement|false => {
    return createElement(CalloutBlock, { type, content });
};

export default parseCalloutTags;