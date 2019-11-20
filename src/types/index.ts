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
    parentSlug: string;
    summary: string;
    fileTitle: string;
    fileAbsolutePath: string;
}

export interface HierarchyQuery {
    allSilverstripeDocument: {
        nodes: SilverstripeDocument[]
    }
};

export interface ChildrenOfProps {
    folderName?: string;
    exclude?: string;
    currentNode: SilverstripeDocument | null;
    asList?: boolean;
};
