import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";

import { Text } from "@components/ui/text";

import ChatInput from "@screens/chatbot/components/chat-input";
import { TypingIndicator } from "@screens/chatbot/components/typing-indicator";

import { useChatStore } from "@stores/chat";
import { useUserStore } from "@stores/users";

import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import useHealthData from "../../hooks/health/use-health-data";
import useToast from "../../hooks/use-toast";
import { Message } from "../../types/chatbot/chatbot-types";
import { AnimatedMessage } from "./components/animated-message";

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
    const [shouldAutoScroll, setShouldAutoScroll] = useState<boolean>(true);
    const previousMessagesLength = useRef<number>(0);

    const { steps, flights, distance } = useHealthData({
        startDate: new Date(),
        endDate: new Date(),
    });
    const isDarkMode = useColorScheme() === "dark";

    const scrollToBottom = (animated: boolean = true) => {
        if (scrollViewRef.current && shouldAutoScroll) {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated });
            }, 100);
        }
    };

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
                setTimeout(() => scrollToBottom(), 300);
            },
        );
        const hideSubscription = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
            () => setKeyboardOpen(false),
        );

        return () => {
            showSubscription?.remove();
            hideSubscription?.remove();
        };
    }, []);

    useEffect(() => {
        const currentMessagesLength = messages.length;

        if (currentMessagesLength > previousMessagesLength.current) {
            scrollToBottom();
        }

        previousMessagesLength.current = currentMessagesLength;
    }, [messages]);

    useEffect(() => {
        if (isLoading) {
            scrollToBottom();
        }
    }, [isLoading]);

    const handleScroll = (event: any) => {
        const { layoutMeasurement, contentOffset, contentSize } =
            event.nativeEvent;
        const paddingToBottom = 50;

        const isAtBottom =
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;

        setShouldAutoScroll(isAtBottom);
    };

    const onSend = async () => {
        if (messageText.trim() === "") return;

        setShouldAutoScroll(true);

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

    const handleClearMessages = () => {
        Alert.alert(
            t("CHAT.ERASE_CONVERSATION"),
            t("CHAT.ERASE_CONVERSATION_CONFIRM"),
            [
                { text: t("COMMON.CANCEL"), style: "cancel" },
                {
                    text: t("CHAT.ERASE"),
                    style: "destructive",
                    onPress: () => {
                        clearMessages();
                        setDefaultMessages();
                        setShouldAutoScroll(true);
                    },
                },
            ],
        );
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

    // Filter "DO NOT PRINT" messages
    const visibleMessages = messages.filter(
        (msg) => !msg.content.includes("DO NOT PRINT"),
    );

    return (
        <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View
                style={[
                    styles.container,
                    { backgroundColor: isDarkMode ? "#000000" : "#F5F5F5" },
                ]}
            >
                <View style={styles.headerContainer}>
                    <Text
                        style={[
                            styles.titleText,
                            { color: isDarkMode ? "#FFFFFF" : "#000000" },
                        ]}
                    >
                        💬 AI Doc
                    </Text>
                    <TouchableOpacity
                        style={[
                            styles.clearButton,
                            {
                                backgroundColor: isDarkMode
                                    ? "rgba(255,255,255,0.1)"
                                    : "rgba(0,0,0,0.1)",
                            },
                        ]}
                        onPress={handleClearMessages}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name="trash-outline"
                            size={24}
                            color={isDarkMode ? "#FFFFFF" : "#000000"}
                        />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    ref={scrollViewRef}
                    style={styles.scrollView}
                    contentContainerStyle={[
                        styles.scrollViewContent,
                        { paddingBottom: keyboardOpen ? 20 : 100 },
                    ]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    {visibleMessages.map((message) => (
                        <AnimatedMessage
                            key={message.id}
                            message={message}
                            isSendByUser={isSendByUser(message)}
                            isDarkMode={isDarkMode}
                        />
                    ))}
                    {isLoading && <TypingIndicator isDarkMode={isDarkMode} />}
                </ScrollView>

                <ChatInput
                    value={messageText}
                    onChangeText={setMessageText}
                    onSend={onSend}
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
        marginBottom: 64,
    },
    container: {
        flex: 1,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingVertical: 16,
        paddingTop: 60,
        position: "relative",
    },
    titleText: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },
    clearButton: {
        position: "absolute",
        right: 20,
        top: 54,
        padding: 8,
        borderRadius: 20,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
    },
    scrollViewContent: {
        paddingTop: 16,
    },
});
