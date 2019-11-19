import { ReactElement, createElement } from 'react';
import ChildrenOf from '../components/ChildrenOf';
import { getCurrentNode } from '../utils/nodes';

/**
 * Turn [CHILDREN ... ] into a proper React component.
 * @param data
 */
const parseChildrenOf = (data: any): ReactElement|false => {
    const currentNode = getCurrentNode();
    let matches;
    matches = data.match(/\[CHILDREN(\sasList)?\]/);
    if (matches) {
        const asList = !!matches[1];
        return createElement(ChildrenOf, { currentNode, asList })
    }

    matches = data.match(/\[CHILDREN Folder="?([A-Za-z0-9_<>\/]+)"?.*?\]/);
    if (matches) {
        const folderName = matches[1].replace(/<\/?em>/g, '_');
        const asList = matches[0].match(' asList');
        return createElement(ChildrenOf, { folderName, currentNode, asList })
    }
    matches = data.match(/\[CHILDREN Exclude="?([A-Za-z0-9_,]+)"?.*?\]/);
    if (matches) {
        const asList = matches[0].match(' asList');
        const exclude = matches[1].replace(/<\/?em>/g, '_');
        return createElement(ChildrenOf, { exclude, currentNode, asList })
    }

    return false;
};

export default parseChildrenOf;