import { ReactElement, createElement } from 'react';
import CalloutBlock from '../components/CalloutBlock';

/**
 * Turn [hint] and other callouts into a proper React component.
 * @param data
 */
const parseCalloutTags = (data: any): ReactElement|false => {
    let matches;

    matches = data.match(/\[(hint|warning|info|alert|notice|note)\](.*?)\[\/(?:hint|warning|info|alert|notice|note)\]/s);

    if (matches) {
        const type = matches[1];
        const content = matches[2];

        return createElement(CalloutBlock, { type, content });
    }

    return false;
};

export default parseCalloutTags;