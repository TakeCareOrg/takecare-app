import { AxiosError } from "axios";
import { create } from "zustand";

import { ChatActions, ChatState, Message } from "@dtypes/chatbot/chatbot-types";
import { ChatService } from "@services/chat";

const initialState: ChatState = {
    messages: [],
    isLoading: false,
    isRecording: false,
    isRefreshingTokens: false,
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

    sendVocal: async (transcription: string, messagesToSend?: Message[]) => {
        if (!transcription.trim()) {
            throw new Error("Transcription cannot be empty.");
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            content: transcription.trim(),
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
            const chatResponse =
                await ChatService.sendMessages(currentMessages);

            if (chatResponse.status === 200) {
                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    content:
                        chatResponse.data.chat.content ||
                        "No response received",
                    role: "assistant",
                    timestamp: new Date(),
                };

                set((state) => ({
                    messages: [...state.messages, assistantMessage],
                    isLoading: false,
                }));
            }
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message: string }>;
            set(() => ({
                isLoading: false,
                error:
                    axiosError.response?.data?.message ||
                    axiosError.message ||
                    "Failed to send vocal message",
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

    setRecording: (isRecording: boolean) => {
        set({ isRecording });
    },
}));
