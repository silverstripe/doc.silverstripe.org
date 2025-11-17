import { ReactElement, createElement } from 'react';
import ChildrenOf from '../components/ChildrenOf';
import { getCurrentNode } from './nodes';

/**
 * Turn [CHILDREN ... ] into a proper React component.
 * @param data
 */
const parseChildrenOf = (data: any): ReactElement|false => {
    const currentNode = getCurrentNode();
    let matches;

    matches = data.match(/\[CHILDREN Folder="?([A-Za-z0-9_<>\/]+)"?.*?\]/);
    if (matches) {
        const folderName = matches[1].replace(/<\/?em>/g, '_');
        const asList = matches[0].match(' asList');
        const includeFolders = matches[0].match(' includeFolders');
        const reverse = matches[0].match(' reverse');
        return createElement(ChildrenOf, { folderName, currentNode, asList, includeFolders, reverse })
    }
    matches = data.match(/\[CHILDREN Exclude="?([A-Za-z0-9_,]+)"?.*?\]/);
    if (matches) {
        const asList = matches[0].match(' asList');
        const includeFolders = matches[0].match(' includeFolders');
        const reverse = matches[0].match(' reverse');
        const exclude = matches[1].replace(/<\/?em>/g, '_');
        return createElement(ChildrenOf, { exclude, currentNode, asList, includeFolders, reverse })
    }
    matches = data.match(/\[CHILDREN Only="?([A-Za-z0-9_,]+)"?.*?\]/);
    if (matches) {
        const asList = matches[0].match(' asList');
        const includeFolders = matches[0].match(' includeFolders');
        const reverse = matches[0].match(' reverse');
        const only = matches[1].replace(/<\/?em>/g, '_');
        return createElement(ChildrenOf, { only, currentNode, asList, includeFolders, reverse })
    }
    matches = data.match(/\[CHILDREN(\sasList)?.*?\]/);
    if (matches) {
        const asList = !!matches[1];
        const includeFolders = matches[0].match(' includeFolders');
        const reverse = matches[0].match(' reverse');

        return createElement(ChildrenOf, { currentNode, asList, includeFolders, reverse })
    }

    return false;
};

export default parseChildrenOf;