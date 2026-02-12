import type { Message } from "@dtypes/chatbot/chatbot-types";
import { ChatService } from "@services/chat";
import { useChatStore } from "@stores/chat";

import { mockChatResponse } from "../mocks/api-mocks";

describe("Chat Integration Flow", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        useChatStore.setState({
            messages: [],
            isLoading: false,
            error: null,
        });
    });

    describe("Complete Message Flow", () => {
        it("should handle full message send flow: validate → API → update state", async () => {
            (ChatService.sendMessages as jest.Mock).mockResolvedValue(
                mockChatResponse.success,
            );

            const { sendMessage } = useChatStore.getState();

            await sendMessage("Hello AI, how are you?");

            expect(ChatService.sendMessages).toHaveBeenCalled();

            const state = useChatStore.getState();

            expect(state.messages).toHaveLength(2);
            expect(state.messages[0].role).toBe("user");
            expect(state.messages[0].content).toBe("Hello AI, how are you?");

            expect(state.messages[1].role).toBe("assistant");
            expect(state.messages[1].content).toBe(
                "This is a test response from the AI",
            );

            expect(state.isLoading).toBe(false);
            expect(state.error).toBeNull();
        });

        it("should handle conversation with multiple messages", async () => {
            (ChatService.sendMessages as jest.Mock).mockResolvedValue(
                mockChatResponse.success,
            );

            const { sendMessage } = useChatStore.getState();

            await sendMessage("First question");
            expect(useChatStore.getState().messages).toHaveLength(2);

            await sendMessage("Second question");
            expect(useChatStore.getState().messages).toHaveLength(4);

            await sendMessage("Third question");
            const state = useChatStore.getState();
            expect(state.messages).toHaveLength(6);

            expect(state.messages[0].content).toBe("First question");
            expect(state.messages[2].content).toBe("Second question");
            expect(state.messages[4].content).toBe("Third question");
        });

        it("should reject empty messages", async () => {
            const { sendMessage } = useChatStore.getState();

            await expect(sendMessage("")).rejects.toThrow(
                "Message content cannot be empty",
            );
            await expect(sendMessage("   ")).rejects.toThrow(
                "Message content cannot be empty",
            );

            expect(ChatService.sendMessages).not.toHaveBeenCalled();

            expect(useChatStore.getState().messages).toHaveLength(0);
        });

        it("should handle API error and update error state", async () => {
            const apiError: any = new Error("Network timeout");
            apiError.response = { data: { message: "Request timeout" } };
            (ChatService.sendMessages as jest.Mock).mockRejectedValue(apiError);

            const { sendMessage } = useChatStore.getState();

            await expect(sendMessage("Hello")).rejects.toThrow();

            const state = useChatStore.getState();

            expect(state.messages).toHaveLength(1);
            expect(state.messages[0].content).toBe("Hello");

            expect(state.error).toBe("Request timeout");
            expect(state.isLoading).toBe(false);
        });

        it("should handle insufficient tokens error", async () => {
            const error: any = new Error("Insufficient tokens");
            error.response = { data: { message: "INSUFFICIENT_CHAT_TOKENS" } };
            (ChatService.sendMessages as jest.Mock).mockRejectedValue(error);

            const { sendMessage } = useChatStore.getState();

            await expect(sendMessage("Hello")).rejects.toThrow();

            const state = useChatStore.getState();
            expect(state.error).toBe("INSUFFICIENT_CHAT_TOKENS");
        });
    });

    describe("Message Management Flow", () => {
        it("should handle complete conversation lifecycle: add → remove → clear", () => {
            const { addMessage, removeMessage, clearMessages } =
                useChatStore.getState();

            const msg1: Message = {
                id: "1",
                content: "First",
                role: "user",
                timestamp: new Date(),
            };
            const msg2: Message = {
                id: "2",
                content: "Second",
                role: "assistant",
                timestamp: new Date(),
            };
            const msg3: Message = {
                id: "3",
                content: "Third",
                role: "user",
                timestamp: new Date(),
            };

            addMessage(msg1);
            addMessage(msg2);
            addMessage(msg3);

            expect(useChatStore.getState().messages).toHaveLength(3);

            removeMessage("2");

            let state = useChatStore.getState();
            expect(state.messages).toHaveLength(2);
            expect(state.messages.find((m) => m.id === "2")).toBeUndefined();

            clearMessages();

            state = useChatStore.getState();
            expect(state.messages).toHaveLength(0);
        });
    });

    describe("Error Recovery Flow", () => {
        it("should recover from error state and allow new messages", async () => {
            const error: any = new Error("API Error");
            error.response = { data: { message: "Server error" } };
            (ChatService.sendMessages as jest.Mock).mockRejectedValueOnce(
                error,
            );

            const { sendMessage } = useChatStore.getState();

            await expect(sendMessage("First message")).rejects.toThrow();

            let state = useChatStore.getState();
            expect(state.error).toBe("Server error");

            (ChatService.sendMessages as jest.Mock).mockResolvedValueOnce(
                mockChatResponse.success,
            );

            await sendMessage("Second message");

            state = useChatStore.getState();
            expect(state.error).toBeNull();
        });
    });

    describe("Custom Messages Flow", () => {
        it("should use custom messagesToSend when provided", async () => {
            (ChatService.sendMessages as jest.Mock).mockResolvedValue(
                mockChatResponse.success,
            );

            const customMessages: Message[] = [
                {
                    id: "1",
                    content: "Context message",
                    role: "user",
                    timestamp: new Date(),
                },
                {
                    id: "2",
                    content: "Previous response",
                    role: "assistant",
                    timestamp: new Date(),
                },
            ];

            const { sendMessage } = useChatStore.getState();

            await sendMessage("New message", customMessages);

            expect(ChatService.sendMessages).toHaveBeenCalled();
            (ChatService.sendMessages as jest.Mock).mock.calls[0][0];

            const state = useChatStore.getState();
            expect(state.messages).toHaveLength(2);
            expect(state.messages[0].content).toBe("New message");
            expect(state.messages[1].role).toBe("assistant");
        });
    });
});
