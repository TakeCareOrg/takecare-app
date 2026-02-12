import { AxiosError } from "axios";
import { create } from "zustand";

import { ChatActions, ChatState, Message } from "@dtypes/chatbot/chatbot-types";
import { ChatService } from "@services/chat";

import { useUserStore } from "./users";

const initialState: ChatState = {
    messages: [],
    isLoading: false,
    error: null,
};

type ChatStore = ChatState & ChatActions;

export const useChatStore = create<ChatStore>()((set, get) => ({
    ...initialState,

    sendMessage: async (content: string, messagesToSend?: Message[]) => {
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
            const currentMessages = messagesToSend || get().messages;
            const response = await ChatService.sendMessages(currentMessages);

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

                const currentUser = useUserStore.getState().user;
                if (currentUser?.chat_tokens !== undefined) {
                    useUserStore.setState((state) => ({
                        user: state.user
                            ? {
                                  ...state.user,
                                  chat_tokens: state.user.chat_tokens - 1,
                              }
                            : null,
                    }));
                }
            }
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message: string }>;
            set(() => ({
                isLoading: false,
                error:
                    axiosError.response?.data?.message ||
                    axiosError.message ||
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

    removeMessage: (messageId: string) => {
        set((state) => ({
            messages: state.messages.filter((m) => m.id !== messageId),
        }));
    },

    clearMessages: () => {
        set({ messages: [] });
    },
}));
