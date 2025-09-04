import { useContext, ReactElement } from 'react';
import NodeContext from '../contexts/NodeContext';
import { SilverstripeDocument } from '../types';

interface NodeFunctions {
    initialise(nodes: SilverstripeDocument[]): undefined;
    getChildren(node: SilverstripeDocument, includeFolders: boolean): SilverstripeDocument[];
    getSiblings(node: SilverstripeDocument): SilverstripeDocument[];
    getNodes(): SilverstripeDocument[];
    getParent(node: SilverstripeDocument): SilverstripeDocument|null;
    getCurrentNode(): SilverstripeDocument|null;
    getHomePage(): SilverstripeDocument|null;
    getNavChildren(node: SilverstripeDocument): SilverstripeDocument[];
    getCurrentVersion(): string;
    getVersionPath(currentNode: SilverstripeDocument, version: number|string): string;
    setCurrentPath(slug: string): undefined;
    getDefaultVersion(): string;
    getVersionMessage():  ReactElement | ReactElement[] | string | null;
    getVersionStatus(version: string): string;
};

const useHierarchy = (): NodeFunctions => {
    const hierarchy = useContext(NodeContext);

    return hierarchy;
};

export default useHierarchy;