import { ChatService } from "@app/services/chat";
import { create } from "zustand";
import { ChatActions, ChatState, Message } from "../types/chatbot/chatbot.types";

const initialState: ChatState = {
    messages: [],
    isLoading: false,
    isRefreshingTokens: false,
    error: null,
};

type ChatStore = ChatState & ChatActions;

export const useChatStore = create<ChatStore>()((set, get) => ({
    ...initialState,

    sendMessage: async (content: string) => {
        if (!content.trim()) {
            throw new Error("Message content cannot be empty.");
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            content: content.trim(),
            role: "user",
            timestamp: new Date(),
        };

        set((state) => ({
            messages: [...state.messages, userMessage],
            isLoading: true,
            error: null,
        }));

        try {
            const currentMessages = get().messages;
            const response = await ChatService.sendMessages(currentMessages);

            console.log(
                `Response from server: ${JSON.stringify(response.data)}`,
            );

            if (response.status === 200) {
                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    content:
                        response.data.chat.content || "No response received",
                    role: "assistant",
                    timestamp: new Date(),
                };

                set((state) => ({
                    messages: [...state.messages, assistantMessage],
                    isLoading: false,
                }));
            }
        } catch (error: any) {
            set(() => ({
                isLoading: false,
                error:
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to send message",
            }));
            throw error;
        }
    },

    addMessage: (message: Message) => {
        set((state) => ({
            messages: [...state.messages, message],
        }));
    },

    clearMessages: () => {
        set({ messages: [] });
    },

    clearError: () => {
        set({ error: null });
    },
}));
