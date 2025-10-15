import { Ionicons } from "@expo/vector-icons";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import { Text } from "@components/ui/text";
import { Message } from "@dtypes/chatbot/chatbot-types";
import { useAudioRecorder } from "@hooks/chat/use-audio-recorder";
import useHealthData from "@hooks/health/use-health-data";
import { useColorTheme } from "@hooks/use-color-theme";
import useToast from "@hooks/use-toast";
import { PageContainer } from "@layouts/page-container";
import { ChatInput } from "@screens/chatbot/components/chat-input";
import { TypingIndicator } from "@screens/chatbot/components/typing-indicator";
import { useChatStore } from "@stores/chat";
import { useUserStore } from "@stores/users";

import { AnimatedMessage } from "./components/animated-message";

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    if (typeof error === "string") return error;
    if (error && typeof error === "object" && "message" in error)
        return String((error as { message: unknown }).message);
    return "An unknown error occurred";
};

export const ChatbotScreen = () => {
    const { t } = useTranslation("full_trads");
    const toast = useToast();
    const scrollViewRef = useRef<FlatList<Message>>(null);
    const themeColors = useColorTheme();
    const user = useUserStore((state) => state.user);
    const {
        messages,
        isLoading,
        error,
        sendMessage,
        sendVocal,
        clearMessages,
        clearError,
        addMessage,
    } = useChatStore();

    const [messageText, setMessageText] = useState("");
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

    const {
        isRecording,
        recordingDuration,
        startRecording,
        stopRecording,
        cancelRecording,
    } = useAudioRecorder();
    const { steps, flights, distance } = useHealthData({
        startDate: new Date(),
        endDate: new Date(),
    });

    const setDefaultMessages = useCallback(() => {
        clearMessages();
        addMessage({
            id: "welcome-message",
            content: t("CHAT.HELLO"),
            role: "assistant",
            timestamp: new Date(),
        });
    }, [clearMessages, addMessage, t]);

    useEffect(() => {
        if (!messages.length) setDefaultMessages();
    }, [messages.length, setDefaultMessages]);

    useEffect(() => {
        if (error) {
            toast({
                type: "error",
                title: "Error",
                message: getErrorMessage(error),
            });
            clearError();
        }
    }, [error, clearError, toast]);

    const getMessagesToSend = useCallback(
        (userMessageContent: string) => {
            const userMessage: Message = {
                id: Date.now().toString(),
                content: userMessageContent,
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
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ");

            let messagesToSend = [...messages, userMessage];

            if (messages.length === 0 || messages.length === 1) {
                messagesToSend.push({
                    id: `${Date.now()}-info`,
                    content: `DO NOT PRINT Additional information DO NOT PRINT: ${additionalInfoMessage} DO NOT PRINT`,
                    role: "assistant",
                    timestamp: new Date(),
                });
            }

            return messagesToSend;
        },
        [messages, steps, flights, distance, user],
    );

    const onSend = async () => {
        if (!messageText.trim()) return;
        setShouldAutoScroll(true);

        try {
            const messagesToSend = getMessagesToSend(messageText);
            setMessageText("");
            await sendMessage(messageText, messagesToSend);
        } catch (err) {
            const msg = getErrorMessage(err);
            toast({
                type: "error",
                title: "Error",
                message:
                    msg === "INSUFFICIENT_CHAT_TOKENS"
                        ? "You have insufficient chat tokens. Please try again later."
                        : msg,
            });
        }
    };

    const handleVocalPressIn = async () => {
        try {
            await startRecording();
        } catch {
            toast({
                type: "error",
                title: "Error",
                message:
                    "Impossible to access microphone, check your permissions.",
            });
        }
    };

    const handleVocalPressOut = async () => {
        try {
            const transcription = await stopRecording();

            if (!transcription || !transcription.trim()) {
                toast({
                    type: "error",
                    title: "Error",
                    message: "No speech detected",
                });
                return;
            }

            setShouldAutoScroll(true);
            const messagesToSend = getMessagesToSend(transcription);
            await sendVocal(transcription, messagesToSend);
        } catch (err) {
            const errorMsg = getErrorMessage(err);
            if (errorMsg !== "NO_RECORDING_IN_PROGRESS") {
                toast({
                    type: "error",
                    title: "Error",
                    message:
                        errorMsg === "NO_SPEECH_DETECTED"
                            ? "No speech detected"
                            : "Error during transcription",
                });
            }
            await cancelRecording();
        }
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
                        setDefaultMessages();
                        setShouldAutoScroll(true);
                    },
                },
            ],
        );
    };

    const visibleMessages = useMemo(
        () => messages.filter((msg) => !msg.content.includes("DO NOT PRINT")),
        [messages],
    );

    const scrollToBottom = useCallback(() => {
        if (scrollViewRef.current && shouldAutoScroll) {
            setTimeout(
                () => scrollViewRef.current?.scrollToEnd({ animated: true }),
                100,
            );
        }
    }, [shouldAutoScroll]);

    const renderMessage = useCallback(
        ({ item, index }: { item: Message; index: number }) => (
            <>
                <AnimatedMessage
                    message={item}
                    isSendByUser={item.role === "user"}
                />
                {isLoading && index === visibleMessages.length - 1 && (
                    <TypingIndicator />
                )}
            </>
        ),
        [isLoading, visibleMessages.length],
    );

    return (
        <PageContainer showNavBar={false} scrollEnabled={false}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <View style={styles.headerSpacer} />
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
                        contentContainerStyle={styles.messagesContainer}
                        renderItem={renderMessage}
                        onContentSizeChange={scrollToBottom}
                        onLayout={scrollToBottom}
                    />

                    <ChatInput
                        value={messageText}
                        onChangeText={setMessageText}
                        onSend={onSend}
                        onVocalPressIn={handleVocalPressIn}
                        onVocalPressOut={handleVocalPressOut}
                        isRecording={isRecording}
                        recordingDuration={recordingDuration}
                        placeholder={t("CHAT.TYPE_PLACEHOLDER")}
                        loading={isLoading}
                    />
                </View>
            </KeyboardAvoidingView>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    keyboardAvoidingView: { flex: 1 },
    container: { flex: 1, marginBottom: 64 },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    headerSpacer: { width: 30 },
    titleText: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
    clearButton: { padding: 8, borderRadius: 20 },
    messagesContainer: { paddingBottom: 16, flexGrow: 1 },
});
