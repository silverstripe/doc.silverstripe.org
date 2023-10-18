/**
 * Removes the paragraph tags from around callout blocks so they end up being valid HTML
 *
 * @param html
 * @returns
 */
const cleanCalloutTags = (html: string): string => {
    // Replace callout <p> tags with a <callout> tag so we can swap it out with the right react component
    html = html.replace(
        /<p>\s*\[(hint|warning|info|alert|notice|note)\](.*?)\[\/\1\]\s*<\/p>/gs,
        (_, type, content) => `<callout type="${type}">${content}</callout>`
    );
    // Replace any <p> and </p> tags inside callout tags with <br>, since the above operation may have
    // inadvertantly broken some <p> tags.
    return html.replace(
        /<callout type="[a-z]*">.*?<\/callout>/gs,
        (callout) => callout.replace(/(<p>|<\/p>)/g, '<br>')
    );
};

export default cleanCalloutTags;