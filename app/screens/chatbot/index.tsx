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
    PermissionsAndroid,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import { useUserStore } from "@app/stores/users";
import { Text } from "@components/ui/text";
import { Message } from "@dtypes/chatbot/chatbot-types";
import { useAudioRecorder } from "@hooks/chat/use-audio-recorder";
import useHealthData from "@hooks/health/use-health-data";
import { useColorTheme } from "@hooks/use-color-theme";
import useToast from "@hooks/use-toast";
import { PageContainer } from "@layouts/page-container";
import { ChatInput } from "@screens/chatbot/components/chat-input";
import { TemporaryRecordingMessage } from "@screens/chatbot/components/temporary-recording-message";
import { TypingIndicator } from "@screens/chatbot/components/typing-indicator";
import { useChatStore } from "@stores/chat";

import { AnimatedMessage } from "./components/animated-message";

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    if (typeof error === "string") return error;
    if (error && typeof error === "object" && "message" in error)
        return String((error as { message: unknown }).message);
    return "An unknown error occurred";
};

const requestMicrophonePermission = async (): Promise<
    boolean | "just_granted"
> => {
    if (Platform.OS === "android") {
        try {
            const hasPermission = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            );

            if (hasPermission) {
                return true;
            }

            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                {
                    title: "Microphone Permission",
                    message:
                        "This app needs access to your microphone to record audio messages.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK",
                },
            );

            const wasGranted = granted === PermissionsAndroid.RESULTS.GRANTED;

            if (wasGranted && !hasPermission) {
                return "just_granted";
            }

            return wasGranted;
        } catch {
            return false;
        }
    }
    return true;
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
        clearMessages,
        clearError,
        addMessage,
    } = useChatStore();

    const [messageText, setMessageText] = useState("");
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

    const {
        isRecording,
        recordingDuration,
        volumeLevels,
        startRecording,
        stopRecording,
        cancelRecording,
        reinitialize,
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
                        ? "You have insufficient chat tokens."
                        : msg,
            });
        }
    };

    const handleVocalStart = async () => {
        try {
            const permissionResult = await requestMicrophonePermission();

            if (!permissionResult) {
                toast({
                    type: "error",
                    title: "Permission Required",
                    message:
                        "Microphone permission is required to record audio messages.",
                });
                return;
            }

            if (permissionResult === "just_granted") {
                await reinitialize();
                toast({
                    type: "success",
                    title: "Permission Granted",
                    message:
                        "Microphone access granted! Please press the button again to start recording.",
                });
                return;
            }

            await startRecording();
            setShouldAutoScroll(true);
            setTimeout(() => scrollToBottom(), 100);
        } catch (err) {
            toast({
                type: "error",
                title: "Error",
                message: `Impossible to access microphone. ${getErrorMessage(err)}`,
            });
        }
    };

    const handleVocalEnd = async () => {
        try {
            const transcription = await stopRecording();

            if (!transcription?.trim()) {
                toast({
                    type: "error",
                    title: "Error",
                    message: "No speech detected",
                });
                return;
            }

            setShouldAutoScroll(true);
            const messagesToSend = getMessagesToSend(transcription);
            await sendMessage(transcription, messagesToSend);
        } catch (err) {
            const errorMsg = getErrorMessage(err);
            if (errorMsg !== "NO_SPEECH_DETECTED") {
                toast({ type: "error", title: "Error", message: errorMsg });
            }
            await cancelRecording();
        }
    };

    const handleVocalCancel = async () => {
        try {
            await cancelRecording();
        } catch (err) {
            toast({
                type: "error",
                title: "Error",
                message: `Failed to cancel recording. ${getErrorMessage(err)}`,
            });
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
                                color={
                                    themeColors.isDark
                                        ? themeColors.white[50]
                                        : themeColors.black[500]
                                }
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
                        ListFooterComponent={
                            <TemporaryRecordingMessage
                                isRecording={isRecording}
                            />
                        }
                    />

                    <ChatInput
                        value={messageText}
                        onChangeText={setMessageText}
                        onSend={onSend}
                        onVocalStart={handleVocalStart}
                        onVocalEnd={handleVocalEnd}
                        onVocalCancel={handleVocalCancel}
                        isRecording={isRecording}
                        recordingDuration={recordingDuration}
                        volumeLevels={volumeLevels}
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
    container: {
        flex: 1,
        paddingHorizontal: 12,
        paddingBottom: Platform.OS === "android" ? 80 : 90,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingHorizontal: 4,
        marginTop: Platform.OS === "android" ? 20 : 10,
    },
    headerSpacer: { width: 40 },
    titleText: { fontSize: 22, fontWeight: "700", textAlign: "center" },
    clearButton: {
        padding: 10,
        borderRadius: 20,
        minWidth: 40,
        minHeight: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    messagesContainer: { paddingBottom: 16, paddingTop: 8, flexGrow: 1 },
});
