import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Alert,
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import { Text } from "@components/ui/text";
import { Message } from "@dtypes/chatbot/chatbot-types";
import useHealthData from "@hooks/health/use-health-data";
import { useColorTheme } from "@hooks/use-color-theme";
import useToast from "@hooks/use-toast";
import { PageContainer } from "@layouts/page-container";
import ChatInput from "@screens/chatbot/components/chat-input";
import { TypingIndicator } from "@screens/chatbot/components/typing-indicator";
import { useChatStore } from "@stores/chat";
import { useUserStore } from "@stores/users";

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
    const scrollViewRef = useRef<FlatList<Message>>(null);
    const themeColors = useColorTheme();

    const user = useUserStore((state) => state.user);

    const messages = useChatStore((state) => state.messages);
    const isLoading = useChatStore((state) => state.isLoading);
    const error = useChatStore((state) => state.error);
    const sendMessage = useChatStore((state) => state.sendMessage);
    const clearMessages = useChatStore((state) => state.clearMessages);
    const clearError = useChatStore((state) => state.clearError);
    const addMessage = useChatStore((state) => state.addMessage);

    const [messageText, setMessageText] = useState<string>("");
    const [keyboardOpen, setKeyboardOpen] = useState<boolean>(false);
    const [shouldAutoScroll, setShouldAutoScroll] = useState<boolean>(true);

    const { steps, flights, distance } = useHealthData({
        startDate: new Date(),
        endDate: new Date(),
    });

    useEffect(() => {
        if (!messages.length) {
            setDefaultMessages();
        }
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
            () => setKeyboardOpen(true),
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
    const visibleMessages = useMemo(() => {
        return messages.filter((msg) => !msg.content.includes("DO NOT PRINT"));
    }, [messages]);

    const scrollToBottom = () => {
        if (scrollViewRef.current && shouldAutoScroll) {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    };

    return (
        <PageContainer showNavBar={false} scrollEnabled={false}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.headerContainer}>
                    <View style={{ width: 30 }} />
                    <Text style={styles.titleText}>AI Doc</Text>
                    <TouchableOpacity
                        style={[
                            styles.clearButton,
                            { backgroundColor: themeColors.grey },
                        ]}
                        onPress={handleClearMessages}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name="trash-outline"
                            size={20}
                            color={themeColors.reverse}
                        />
                    </TouchableOpacity>
                </View>

                <FlatList
                    ref={scrollViewRef}
                    data={visibleMessages}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <>
                            <AnimatedMessage
                                message={item}
                                isSendByUser={isSendByUser(item)}
                            />
                            {isLoading &&
                                index === visibleMessages.length - 1 && (
                                    <TypingIndicator />
                                )}
                        </>
                    )}
                    onContentSizeChange={() => {
                        if (shouldAutoScroll) {
                            scrollToBottom();
                        }
                    }}
                />

                <View style={{ marginBottom: keyboardOpen ? 40 : 0 }}>
                    <ChatInput
                        value={messageText}
                        onChangeText={setMessageText}
                        onSend={onSend}
                        placeholder={t("CHAT.TYPE_PLACEHOLDER")}
                        loading={isLoading}
                    />
                </View>
            </KeyboardAvoidingView>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
        marginBottom: 64,
    },

    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
    },
    titleText: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },
    clearButton: {
        padding: 8,
        borderRadius: 20,
    },
});
