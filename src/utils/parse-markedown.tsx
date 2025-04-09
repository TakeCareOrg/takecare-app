interface MarkdownElement {
    type: "text" | "bold" | "italic" | "link";
    content: string;
    url?: string;
}

export const parseMarkdown = (text: string): MarkdownElement[] => {
    const regexPatterns = {
        bold: /\*\*(.*?)\*\*/g,
        italic: /\*(.*?)\*/g,
        link: /\[(.*?)\]\((.*?)\)/g,
    };

    let elements: MarkdownElement[] = [];

    // Parse links
    text.split(regexPatterns.link).forEach((part, index) => {
        if (index % 3 === 0) {
            // Parse bold text
            part.split(regexPatterns.bold).forEach((part, index) => {
                if (index % 2 === 0) {
                    // Parse italic text
                    part.split(regexPatterns.italic).forEach((part, index) => {
                        if (index % 2 === 0) {
                            elements.push({ type: "text", content: part });
                        } else {
                            elements.push({ type: "italic", content: part });
                        }
                    });
                } else {
                    elements.push({ type: "bold", content: part });
                }
            });
        } else if (index % 3 === 1) {
            const linkText = part;
            const linkUrl = text.split(regexPatterns.link)[index + 1];
            elements.push({ type: "link", content: linkText, url: linkUrl });
        }
    });

    return elements;
};
