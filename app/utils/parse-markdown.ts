import { MarkdownElement } from "../types/chatbot/chatbot.types";

export const parseMarkdown = (text: string): MarkdownElement[] => {
    const regexPatterns = {
        bold: /\*\*(.*?)\*\*/g,
        italic: /\*(.*?)\*/g,
        link: /\[(.*?)\]\((.*?)\)/g,
    };

    const elements: MarkdownElement[] = [];

    text.split(regexPatterns.link).forEach((part, index) => {
        if (index % 3 === 0) {
            part.split(regexPatterns.bold).forEach((part, index) => {
                if (index % 2 === 0) {
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
