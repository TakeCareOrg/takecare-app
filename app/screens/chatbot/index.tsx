import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";

import { BubbleBlurView } from "@app/components/ui/bubble-blur-view";
import { useHealthDataStore } from "@app/stores/health-data";
import { useUserStore } from "@app/stores/users";
import { Text } from "@components/ui/text";
import { Message } from "@dtypes/chatbot/chatbot-types";
import { useChatImageFlow } from "@hooks/chat/use-chat-image-flow";
import { useColorTheme } from "@hooks/use-color-theme";
import { useSpeechRecognition } from "@hooks/use-speech-recognition";
import useToast from "@hooks/use-toast";
import { ChatInput } from "@screens/chatbot/components/chat-input";
import { TemporaryRecordingMessage } from "@screens/chatbot/components/temporary-recording-message";
import { TypingIndicator } from "@screens/chatbot/components/typing-indicator";
import { useChatStore } from "@stores/chat";

import { AnimatedMessage } from "./components/animated-message";

export const ChatbotScreen = () => {
    const { t, i18n } = useTranslation("full_trads");
    const toast = useToast();
    const scrollViewRef = useRef<FlatList<Message>>(null);
    const themeColors = useColorTheme();
    const navigation = useNavigation();
    const user = useUserStore((state) => state.user);

    const {
        messages,
        isLoading,
        error,
        sendMessage,
        clearMessages,
        addMessage,
        removeMessage,
    } = useChatStore();

    const [messageText, setMessageText] = useState("");

    // Health data
    const healthData = useHealthDataStore((state) => state.todayCache?.data);
    const steps = healthData?.steps || null;
    const flights = healthData?.flights || null;
    const distance = healthData?.distance || null;

    // Speech recognition
    const locale = i18n.language;
    const {
        isRecording,
        recordingDuration,
        startRecording,
        stopRecording,
        cancelRecording,
    } = useSpeechRecognition({
        locale,
        onTranscript: (text) => setMessageText(text),
        onError: (err) =>
            toast({ type: "error", title: "Error", message: err }),
    });

    // Image upload flow
    const { isAnalyzing, handleImagePress } = useChatImageFlow({
        locale,
        messageText,
        setMessageText,
        addMessage,
        removeMessage,
        t,
    });

    // Welcome message
    useEffect(() => {
        if (messages.length === 0) {
            clearMessages();
            addMessage({
                id: "welcome",
                content: t("CHAT.HELLO"),
                role: "assistant",
                timestamp: new Date(),
            });
        }
    }, [addMessage, clearMessages, messages.length, t]);

    // Show errors
    useEffect(() => {
        if (error) {
            toast({ type: "error", title: "Error", message: String(error) });
        }
    }, [error, toast]);

    // Send message
    const onSend = async () => {
        if (!messageText.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: messageText,
            role: "user",
            timestamp: new Date(),
        };

        const healthInfo =
            messages.length <= 1
                ? {
                      id: `${Date.now()}-info`,
                      content: `DO NOT PRINT Additional information DO NOT PRINT: range: 3 days ago from now, steps: ${steps}, flights: ${flights}, distance: ${distance}, birth_date: ${user?.health?.birth_date || "unknown"}, gender: ${user?.health?.gender || "unknown"} DO NOT PRINT`,
                      role: "assistant" as const,
                      timestamp: new Date(),
                  }
                : null;

        const messagesToSend = healthInfo
            ? [...messages, userMessage, healthInfo]
            : [...messages, userMessage];

        setMessageText("");
        await sendMessage(messageText, messagesToSend);
        scrollViewRef.current?.scrollToEnd({ animated: true });
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
                    onPress: () => clearMessages(),
                },
            ],
        );
    };

    const visibleMessages = messages.filter(
        (msg) => !msg.content.includes("DO NOT PRINT"),
    );

    return (
        <BubbleBlurView
            intensity={100}
            tint={
                themeColors.isDark
                    ? "systemChromeMaterialDark"
                    : "systemUltraThinMaterialLight"
            }
            style={{ flex: 1 }}
        >
            <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
                <KeyboardAvoidingView
                    style={styles.keyboardAvoidingView}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <View style={styles.container}>
                        <View style={styles.headerContainer}>
                            <TouchableOpacity
                                style={styles.headerButton}
                                onPress={() => navigation.goBack()}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name="chevron-back"
                                    size={20}
                                    color={
                                        themeColors.isDark
                                            ? themeColors.raw.white[500]
                                            : themeColors.raw.black[500]
                                    }
                                />
                            </TouchableOpacity>
                            <View style={{ marginRight: 16 }}>
                                <Text style={styles.titleText}>AI Doc</Text>
                                <View style={styles.tokensRow}>
                                    <Ionicons
                                        name="chatbubble-ellipses-outline"
                                        size={14}
                                        color={themeColors.warning}
                                    />
                                    <Text
                                        fontSize={14}
                                        style={{ color: themeColors.secondary }}
                                    >
                                        {user?.chat_tokens || 0}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.headerButton}
                                onPress={handleClearMessages}
                            >
                                <Ionicons
                                    name="trash-outline"
                                    size={20}
                                    color={
                                        themeColors.isDark
                                            ? themeColors.raw.white[500]
                                            : themeColors.raw.black[500]
                                    }
                                />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            ref={scrollViewRef}
                            data={visibleMessages}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.messagesContainer}
                            renderItem={({ item, index }) => (
                                <>
                                    <AnimatedMessage
                                        message={item}
                                        isSendByUser={item.role === "user"}
                                    />
                                    {isLoading &&
                                        index ===
                                            visibleMessages.length - 1 && (
                                            <TypingIndicator />
                                        )}
                                </>
                            )}
                            onContentSizeChange={() =>
                                scrollViewRef.current?.scrollToEnd({
                                    animated: true,
                                })
                            }
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
                            onVocalStart={startRecording}
                            onVocalEnd={stopRecording}
                            onVocalCancel={cancelRecording}
                            onImagePress={handleImagePress}
                            isRecording={isRecording}
                            recordingDuration={recordingDuration}
                            placeholder={t("CHAT.TYPE_PLACEHOLDER")}
                            loading={isLoading || isAnalyzing}
                            imageUploadTitle={t("CHAT.IMAGE_UPLOAD_TITLE")}
                        />
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </BubbleBlurView>
    );
};

const styles = StyleSheet.create({
    keyboardAvoidingView: { flex: 1 },
    container: { flex: 1, paddingHorizontal: 12 },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingHorizontal: 4,
    },
    titleText: { fontSize: 22, fontWeight: "700", textAlign: "center" },
    tokensRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
    },
    headerButton: {
        padding: 10,
        borderRadius: 20,
        minWidth: 40,
        minHeight: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    messagesContainer: { paddingBottom: 16, paddingTop: 8, flexGrow: 1 },
});
