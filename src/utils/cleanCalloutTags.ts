/**
 * Removes the paragraph tags from around callout blocks so they end up being valid HTML
 *
 * @param html
 * @returns
 */
const cleanCalloutTags = (html: string): string => {
    return html.replace(
        /(?:<p>\s*)((?:\[(hint|warning|info|alert|notice|note)\]).*?(?:\[\/(hint|warning|info|alert|notice|note)\]))(?:\s*<\/p>)/gs,
        (_, callout) => callout
    );
};

export default cleanCalloutTags;