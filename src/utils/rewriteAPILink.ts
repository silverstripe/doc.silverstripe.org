/**
 * If an href is preceded with api:, rewrite it to the api.silverstripe.org site
 * @param link 
 */
const rewriteAPILink = (link: string): string => {
    const version = 4;
    const match = link.match(/api\:(.*)/);
    if (!match) {
        console.error(`Unable to resolve api link ${link}!`);
        return link;
    }

    return `https://api.silverstripe.org/search/lookup?q=${match[1]}&version=${version}`;
};

export default rewriteAPILink;