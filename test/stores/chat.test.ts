import type { Message } from "@dtypes/chatbot/chatbot-types";
import { ChatService } from "@services/chat";
import { useChatStore } from "@stores/chat";

import { mockChatResponse, resetFetchMock } from "../mocks/api-mocks";

describe("Chat Store", () => {
    beforeEach(() => {
        useChatStore.setState({
            messages: [],
            isLoading: false,
            error: null,
        });

        resetFetchMock();
        jest.clearAllMocks();
    });

    describe("sendMessage", () => {
        it("should successfully send a message and add response", async () => {
            (ChatService.sendMessages as jest.Mock).mockResolvedValue(
                mockChatResponse.success,
            );

            const { sendMessage } = useChatStore.getState();
            await sendMessage("Hello, AI!");

            const state = useChatStore.getState();

            expect(state.messages).toHaveLength(2);
            expect(state.messages[0].role).toBe("user");
            expect(state.messages[0].content).toBe("Hello, AI!");
            expect(state.messages[1].role).toBe("assistant");
            expect(state.messages[1].content).toBe(
                "This is a test response from the AI",
            );
            expect(state.isLoading).toBe(false);
            expect(state.error).toBeNull();
        });

        it("should throw error when message is empty", async () => {
            const { sendMessage } = useChatStore.getState();

            await expect(sendMessage("")).rejects.toThrow(
                "Message content cannot be empty",
            );
            await expect(sendMessage("   ")).rejects.toThrow(
                "Message content cannot be empty",
            );
        });

        it("should handle insufficient tokens error", async () => {
            const error: any = new Error("Insufficient tokens");
            error.response = { data: { message: "INSUFFICIENT_CHAT_TOKENS" } };
            (ChatService.sendMessages as jest.Mock).mockRejectedValue(error);

            const { sendMessage } = useChatStore.getState();

            await expect(sendMessage("Hello")).rejects.toThrow();

            const state = useChatStore.getState();
            expect(state.error).toBe("INSUFFICIENT_CHAT_TOKENS");
            expect(state.isLoading).toBe(false);
        });

        it("should handle API error", async () => {
            (ChatService.sendMessages as jest.Mock).mockRejectedValue(
                new Error("API Error"),
            );

            const { sendMessage } = useChatStore.getState();

            await expect(sendMessage("Hello")).rejects.toThrow();

            const state = useChatStore.getState();
            expect(state.error).toBeTruthy();
            expect(state.isLoading).toBe(false);
        });

        it("should use custom messagesToSend if provided", async () => {
            (ChatService.sendMessages as jest.Mock).mockResolvedValue(
                mockChatResponse.success,
            );

            const customMessages: Message[] = [
                {
                    id: "1",
                    content: "Previous message",
                    role: "user",
                    timestamp: new Date(),
                },
            ];

            const { sendMessage } = useChatStore.getState();
            await sendMessage("New message", customMessages);

            const state = useChatStore.getState();
            expect(state.messages).toHaveLength(2);
        });

        it("should set loading state during API call", async () => {
            let loadingDuringCall = false;

            (ChatService.sendMessages as jest.Mock).mockImplementation(() => {
                loadingDuringCall = useChatStore.getState().isLoading;
                return Promise.resolve(mockChatResponse.success);
            });

            const { sendMessage } = useChatStore.getState();
            await sendMessage("Hello");

            expect(loadingDuringCall).toBe(true);
            expect(useChatStore.getState().isLoading).toBe(false);
        });
    });

    describe("addMessage", () => {
        it("should add a message to the store", () => {
            const message: Message = {
                id: "123",
                content: "Test message",
                role: "user",
                timestamp: new Date(),
            };

            const { addMessage } = useChatStore.getState();
            addMessage(message);

            const state = useChatStore.getState();
            expect(state.messages).toHaveLength(1);
            expect(state.messages[0]).toEqual(message);
        });

        it("should append messages without replacing existing ones", () => {
            const message1: Message = {
                id: "1",
                content: "First message",
                role: "user",
                timestamp: new Date(),
            };

            const message2: Message = {
                id: "2",
                content: "Second message",
                role: "assistant",
                timestamp: new Date(),
            };

            const { addMessage } = useChatStore.getState();
            addMessage(message1);
            addMessage(message2);

            const state = useChatStore.getState();
            expect(state.messages).toHaveLength(2);
            expect(state.messages[0]).toEqual(message1);
            expect(state.messages[1]).toEqual(message2);
        });
    });

    describe("removeMessage", () => {
        it("should remove a message by id", () => {
            const messages: Message[] = [
                {
                    id: "1",
                    content: "Message 1",
                    role: "user",
                    timestamp: new Date(),
                },
                {
                    id: "2",
                    content: "Message 2",
                    role: "assistant",
                    timestamp: new Date(),
                },
                {
                    id: "3",
                    content: "Message 3",
                    role: "user",
                    timestamp: new Date(),
                },
            ];

            useChatStore.setState({ messages });

            const { removeMessage } = useChatStore.getState();
            removeMessage("2");

            const state = useChatStore.getState();
            expect(state.messages).toHaveLength(2);
            expect(state.messages.find((m) => m.id === "2")).toBeUndefined();
        });

        it("should not throw error if message id does not exist", () => {
            const messages: Message[] = [
                {
                    id: "1",
                    content: "Message 1",
                    role: "user",
                    timestamp: new Date(),
                },
            ];

            useChatStore.setState({ messages });

            const { removeMessage } = useChatStore.getState();

            expect(() => removeMessage("non-existent")).not.toThrow();
            expect(useChatStore.getState().messages).toHaveLength(1);
        });
    });

    describe("clearMessages", () => {
        it("should clear all messages", () => {
            const messages: Message[] = [
                {
                    id: "1",
                    content: "Message 1",
                    role: "user",
                    timestamp: new Date(),
                },
                {
                    id: "2",
                    content: "Message 2",
                    role: "assistant",
                    timestamp: new Date(),
                },
            ];

            useChatStore.setState({ messages });

            const { clearMessages } = useChatStore.getState();
            clearMessages();

            const state = useChatStore.getState();
            expect(state.messages).toHaveLength(0);
        });
    });
});
