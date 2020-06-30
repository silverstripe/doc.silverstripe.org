import { useContext } from 'react';
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
    getVersionPath(currentNode: SilverstripeDocument, version: number): string;
    setCurrentPath(slug: string): undefined;
};

const useHierarchy = (): NodeFunctions => {
    const hierarchy = useContext(NodeContext);

    return hierarchy;
};

export default useHierarchy;