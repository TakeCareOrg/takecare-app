export type MarkdownElementType = "bold" | "italic" | "link" | "text";

export interface MarkdownElement {
    type: MarkdownElementType;
    content: string;
    url?: string;
}

export interface Pattern {
    type: MarkdownElementType;
    regex: RegExp;
}

export interface ChatResponse {
    chat: {
        role: string;
        content: string;
        transcription?: string;
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

export interface Vocal {
    id: string;
    audio: string;
    timestamp: Date;
    duration?: number;
}

export interface ChatState {
    messages: Message[];
    isLoading: boolean;
    isRecording: boolean;
    isRefreshingTokens: boolean;
    error: string | null;
}

export interface ChatActions {
    sendMessage: (content: string, messagesToSend?: Message[]) => Promise<void>;
    addMessage: (message: Message) => void;
    removeMessage: (id: string) => void;
    clearMessages: () => void;
    clearError: () => void;
    setRecording: (isRecording: boolean) => void;
}
