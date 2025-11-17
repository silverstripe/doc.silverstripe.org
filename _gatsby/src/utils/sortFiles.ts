import { SilverstripeDocument } from "../types";
import path from 'path';

/**
 * Validates whether a given string looks like a semantic versioning number
 */
function isVersionNumber(value: string): boolean {
    return /^\d+\.\d+\.\d+(-(alpha|beta|rc)\d*)?$/.test(value);
}

const sortFiles = (a: SilverstripeDocument, b: SilverstripeDocument): number => {
    if (a.isIndex !== b.isIndex) {
        //return a.isIndex ? -1 : 1;
    }

    let compA = a.fileAbsolutePath;
    let compB = b.fileAbsolutePath;
    const compareOptions = {
        numeric: false,
        sensitivity: 'case',
    };

    // Only apply special comparison logic for files in the same directory
    if (path.dirname(a.fileAbsolutePath) === path.dirname(b.fileAbsolutePath)) {
        // Compare numbers and version numbers numerically
        if (
            (!isNaN(a.fileTitle) && !isNaN(b.fileTitle))
            || (isVersionNumber(a.fileTitle) && isVersionNumber(a.fileTitle))
        ) {
            // compare numerically
            compA = a.fileTitle;
            compB = b.fileTitle;
            compareOptions.numeric = true;
        }
    }

    return compA.localeCompare(compB, 'en', compareOptions);
};

export default sortFiles;