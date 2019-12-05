export interface SingleFileQuery {
    data: {
        silverstripeDocument: SinglePage
    }
};

export interface SinglePage {
    title: string;
    slug: string;
    watchFile: {
        html: string;
    }
    parent: {
        html: string;
        parent: {
            relativePath: string;
            gitRemote: {
                ref: string;
                webLink: string;
            }
        }
    }
};

enum DocCategory {
    'docs' = 'docs',
    'user' = 'user',
}

export interface SilverstripeDocument {
    title: string;
    slug: string;
    isIndex: boolean;
    filePath: string;
    introduction?: string;
    icon?: string;
    iconBrand?: string;
    hideChildren?: boolean;
    hideSelf?: boolean;
    unhideSelf?: boolean;
    parentSlug: string;
    summary: string;
    fileTitle: string;
    fileAbsolutePath: string;
    category: DocCategory;
}

export interface HierarchyQuery {
    allSilverstripeDocument: {
        nodes: SilverstripeDocument[]
    }
};

export interface ChildrenOfProps {
    folderName?: string;
    exclude?: string;
    only?: string;
    currentNode: SilverstripeDocument | null;
    asList?: boolean;
    includeFolders?: boolean;
    reverse?: boolean;
};
