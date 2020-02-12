/**
 * Completes the shorthand [api:Something] syntax to [api:Something](Something)
 * @param html
 */
const cleanApiTags = (html: string): string => {    
    return html
    .replace(
        /\[api:(.*?)\]([^(])/g,
        (_, query, next) => `<a href="api:${query}">${query}</a>${next}`
    )
};

export default cleanApiTags;