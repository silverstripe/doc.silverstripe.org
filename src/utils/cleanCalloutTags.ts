const getCalloutClass = (type: string): string => {
    switch (type) {
        case 'hint':
            return 'success';
        case 'notice':
            return 'warning';
        case 'alert':
            return 'danger';
        case 'note':
            return 'info'
        default:
            return type;
    }
};
const cleanCalloutTags = (html: string): string => {
    return html.replace(
        /(?:<p>\s*)(\[(hint|warning|info|alert|notice|note)\])(.*?)(\[\/(hint|warning|info|alert|notice|note)\])(?:\s*<\/p>)/gs,
        (_, tag, type, content) => `
            <div class="callout-block callout-block-${getCalloutClass(type)}">
                <div class="content">
                    ${content}
                </div>
            </div>
        `
    );
};

export default cleanCalloutTags;