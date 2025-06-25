export type MarkdownElementType = "bold" | "italic" | "link" | "text";

export interface MarkdownElement {
    type: MarkdownElementType;
    content: string;
    url?: string;
}

export interface MessageTextProps {
    isSendByUser: boolean;
    messageText: string;
}
