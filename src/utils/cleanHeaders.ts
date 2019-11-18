const cleanHeaders = (html: string): string => {
    return html.replace(
        /<h([0-9])>(.*?)(\{#.*?<\/?em>.*?})/g,
        (_, level, title, tag) => `<h${level}>${title} ${tag.replace(/<\/?em>/g, '_')}`
    );
};

export default cleanHeaders;