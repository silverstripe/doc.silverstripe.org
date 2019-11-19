const cleanApiTags = (html: string): string => {
    return html.replace(
        /\[api:(.*?)\]([^(])/g,
        (_, query, next) => `<a target="_blank" href="${query}">${query}</a>${next}`
    )
};

export default cleanApiTags;