const cleanApiTags = (html: string): string => {  
    return html.replace(
        /\[api:(.*?)\][^(]/,
        (_, query) => `<a href="${query}">${query}</a> `
    )
};

export default cleanApiTags;