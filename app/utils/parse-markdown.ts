import { MarkdownElement, Pattern } from "../types/chatbot/chatbot.types";

export const parseMarkdown = (text: string): MarkdownElement[] => {
    const elements: MarkdownElement[] = [];
    let currentIndex = 0;

    const patterns: Pattern[] = [
        { type: "bold", regex: /\*\*(.*?)\*\*/gs },
        { type: "italic", regex: /\*(.*?)\*/gs },
        { type: "link", regex: /\[(.*?)\]\((.*?)\)/gs },
    ];

    while (currentIndex < text.length) {
        let earliestMatch: RegExpExecArray | null = null;
        let earliestIndex = text.length;
        let matchingPattern: Pattern | null = null;

        patterns.forEach((pattern) => {
            pattern.regex.lastIndex = currentIndex;
            const match = pattern.regex.exec(text);
            if (match && match.index < earliestIndex) {
                earliestMatch = match;
                earliestIndex = match.index;
                matchingPattern = pattern;
            }
        });

        if (earliestMatch && matchingPattern) {
            const match: string = earliestMatch;
            const pattern: Pattern = matchingPattern;

            if (earliestIndex > currentIndex) {
                const textBefore = text.slice(currentIndex, earliestIndex);
                if (textBefore) {
                    elements.push({ type: "text", content: textBefore });
                }
            }

            if (pattern.type === "link" && match.length >= 3) {
                elements.push({
                    type: "link",
                    content: match[1],
                    url: match[2],
                });
            } else if (pattern.type === "bold" && match.length >= 2) {
                elements.push({
                    type: "bold",
                    content: match[1],
                });
            } else if (pattern.type === "italic" && match.length >= 2) {
                elements.push({
                    type: "italic",
                    content: match[1],
                });
            }

            currentIndex = earliestIndex + match[0].length;
            patterns.forEach((p) => (p.regex.lastIndex = 0));
        } else {
            const remainingText = text.slice(currentIndex);
            if (remainingText) {
                elements.push({ type: "text", content: remainingText });
            }
            break;
        }
    }

    return elements;
};
