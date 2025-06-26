export type MarkdownElementType = "bold" | "italic" | "link" | "text";

export interface MarkdownElement {
    type: MarkdownElementType;
    content: string;
    url?: string;
}

export interface ChatResponse {
    chat: {
        role: string;
        content: string;
    };
}

export interface MessageTextProps {
    isSendByUser: boolean;
    messageText: string;
}


export interface Message {
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: Date;
}

export interface ChatState {
    messages: Message[];
    isLoading: boolean;
    isRefreshingTokens: boolean;
    error: string | null;
}

export interface ChatActions {
    sendMessage: (message: string, messagesToSend: Message[]) => Promise<void>;
    clearMessages: () => void;
    clearError: () => void;
    addMessage: (message: Message) => void;
}
