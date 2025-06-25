import React, { useEffect, useRef, useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    useColorScheme,
    View,
} from "react-native";

import { Text } from "@components/ui/text";

import { Message, useChatStore } from "@stores/chat";
import { useUserStore } from "@stores/users";

import { useTranslation } from "react-i18next";

import useHealthData from "../../hooks/health/use-health-data";
import useToast from "../../hooks/use-toast";
import ChatInput from "./components/chat-input";
import ClearButton from "./components/clear-button";
import { LoadingMessage } from "./components/loading-message";
import { MessageAvatar } from "./components/message-avatar";
import { MessageBubble } from "./components/message-bubble";

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === "string") {
        return error;
    }
    if (error && typeof error === "object" && "message" in error) {
        return String((error as any).message);
    }
    return "An unknown error occurred";
};

export const ChatbotScreen = () => {
    const { t } = useTranslation("full_trads");
    const toast = useToast();
    const scrollViewRef = useRef<ScrollView>(null);

    const user = useUserStore((state) => state.user);
    const {
        messages,
        isLoading,
        error,
        sendMessage,
        clearMessages,
        clearError,
        addMessage,
    } = useChatStore();

    const [messageText, setMessageText] = useState<string>("");
    const [keyboardOpen, setKeyboardOpen] = useState<boolean>(false);

    const { steps, flights, distance } = useHealthData({
        startDate: new Date(),
        endDate: new Date(),
    });
    const isDarkMode = useColorScheme() === "dark";

    useEffect(() => {
        setDefaultMessages();
    }, []);

    useEffect(() => {
        if (error) {
            toast({
                type: "error",
                title: "Error",
                message: getErrorMessage(error),
            });
            clearError();
        }
    }, [error]);

    useEffect(() => {
        const showSubscription = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
            () => {
                setKeyboardOpen(true);
            },
        );
        const hideSubscription = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
            () => {
                setKeyboardOpen(false);
            },
        );

        return () => {
            showSubscription?.remove();
            hideSubscription?.remove();
        };
    }, []);

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    const onSend = async () => {
        if (messageText.trim() === "") {
            return;
        }

        Keyboard.dismiss();

        const userMessage: Message = {
            id: (messages.length + 1).toString(),
            content: messageText,
            role: "user",
            timestamp: new Date(),
        };

        const dataToSend = {
            range: "3 days ago from now",
            steps,
            flights,
            distance,
            age: `${user?.health?.age || "unknown"} years`,
            gender: user?.health?.gender || "unknown",
        };

        const additionalInfoMessage = Object.entries(dataToSend)
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => {
                const number =
                    typeof value === "string" && value.includes(" ")
                        ? parseInt(value.split(" ")[0])
                        : value;
                const valueToWrite = number === 0 ? "unknown" : value;
                return `${key}: ${valueToWrite}`;
            })
            .join(", ");

        let messagesToSend = [...messages, userMessage];

        if (messages.length === 1) {
            const healthInfoMessage: Message = {
                id: (messages.length + 2).toString(),
                content: `DO NOT PRINT Additional information DO NOT PRINT: ${additionalInfoMessage} DO NOT PRINT`,
                role: "assistant",
                timestamp: new Date(),
            };
            messagesToSend = [...messagesToSend, healthInfoMessage];
        }

        try {
            setMessageText("");
            await sendMessage(messageText, messagesToSend);
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            toast({
                type: "error",
                title: "Error",
                message:
                    errorMessage === "INSUFFICIENT_CHAT_TOKENS"
                        ? "You have insufficient chat tokens. Please try again later."
                        : "An error occurred. Please try again.",
            });
        }
    };

    const isSendByUser = (message: Message) => {
        return message.role === "user";
    };

    const handleFileReceived = (message: any) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            content: message.chatbotResponse.text,
            role: "assistant",
            timestamp: new Date(),
        };
        addMessage(newMessage);
    };

    const handlePhotoReceived = (message: any) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            content: message.chatbotResponse.text,
            role: "assistant",
            timestamp: new Date(),
        };
        addMessage(newMessage);
    };

    const handleBlockInputs = () => {
        if (isLoading) {
            toast({
                type: "info",
                title: "Info",
                message: t("CHAT.BLOCK_INPUTS"),
            });
            return;
        }
        Keyboard.dismiss();
    };

    const handleClearMessages = () => {
        clearMessages();
        setDefaultMessages();
    };

    const setDefaultMessages = () => {
        clearMessages();
        const welcomeMessage: Message = {
            id: "1",
            content: t("CHAT.HELLO"),
            role: "assistant",
            timestamp: new Date(),
        };
        addMessage(welcomeMessage);
    };

    return (
        <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: isDarkMode ? "#0B0B0B" : "#EDEDED",
                        paddingBottom: keyboardOpen ? 50 : 130,
                    },
                ]}
            >
                <View style={styles.headerContainer}>
                    <View>
                        <Text style={styles.titleText}>Andrew</Text>
                    </View>
                </View>

                <ClearButton onPress={handleClearMessages} />

                <ScrollView
                    ref={scrollViewRef}
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollViewContent}
                    onContentSizeChange={() =>
                        scrollViewRef.current?.scrollToEnd({ animated: true })
                    }
                    showsVerticalScrollIndicator={false}
                >
                    {messages.map((message) => (
                        <View
                            key={message.id}
                            style={[
                                styles.messageContainer,
                                {
                                    flexDirection: isSendByUser(message)
                                        ? "row-reverse"
                                        : "row",
                                },
                            ]}
                        >
                            <MessageAvatar
                                isSendByUser={isSendByUser(message)}
                            />
                            <MessageBubble
                                isSendByUser={isSendByUser(message)}
                                messageText={message.content}
                            />
                        </View>
                    ))}
                    {isLoading && <LoadingMessage />}
                </ScrollView>

                <ChatInput
                    value={messageText}
                    onChangeText={setMessageText}
                    onSend={() =>
                        onSend().catch(() => {
                            toast({
                                type: "error",
                                title: "Error",
                                message: "An error occurred. Please try again.",
                            });
                        })
                    }
                    onMessageFileReceived={handleFileReceived}
                    onMessagePhotoReceived={handlePhotoReceived}
                    onInputPressed={handleBlockInputs}
                    placeholder={t("CHAT.TYPE_PLACEHOLDER")}
                    loading={isLoading}
                />
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: "space-between",
        padding: 16,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 16,
        marginTop: 32,
    },
    titleText: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: "flex-start",
    },
    messageContainer: {
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "flex-start",
    },
    chatBubble: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginVertical: 8,
        maxWidth: "90%",
    },
    userBubble: {
        alignSelf: "flex-end",
        borderBottomRightRadius: 0,
    },
    botBubble: {
        alignSelf: "flex-start",
        borderBottomLeftRadius: 0,
        maxWidth: "80%",
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
    },
});
