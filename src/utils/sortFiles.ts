import { SilverstripeDocument } from "../types";

const sortFiles = (a: SilverstripeDocument, b: SilverstripeDocument): number => {
    if (a.isIndex !== b.isIndex) {
        //return a.isIndex ? -1 : 1;
    }
    return a.fileAbsolutePath > b.fileAbsolutePath ? 1 : -1;
};

export default sortFiles;