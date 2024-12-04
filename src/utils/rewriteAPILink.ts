import { getCurrentVersion } from './nodes';

/**
 * If an href is preceded with api:, rewrite it to the api.silverstripe.org site
 * @param link 
 */
const rewriteAPILink = (link: string): string => {
    const version = getCurrentVersion();
    const match = link.match(/api\:(.*)/);
    if (!match) {
        console.error(`Unable to resolve api link ${link}!`);
        return link;
    }

    return `https://api.silverstripe.org/search.html?q=${match[1]}&version=${version}`;
};

export default rewriteAPILink;