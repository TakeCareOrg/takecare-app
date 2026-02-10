import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useHealthDataStore } from "@app/stores/health-data";
import { useUserStore } from "@app/stores/users";
import { Text } from "@components/ui/text";
import { Message } from "@dtypes/chatbot/chatbot-types";
import { useImageAnalyzer } from "@hooks/chat/use-image-analyzer";
import { useColorTheme } from "@hooks/use-color-theme";
import { useSpeechRecognition } from "@hooks/use-speech-recognition";
import useToast from "@hooks/use-toast";
import { PageContainer } from "@layouts/page-container";
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
    const insets = useSafeAreaInsets();
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
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [headerHeight, setHeaderHeight] = useState(0);

    const { isAnalyzing, pickImage, takePhoto, analyzeImage } =
        useImageAnalyzer();

    // Use today's cached health data from store
    const healthData = useHealthDataStore((state) => state.todayCache?.data);
    const steps = healthData?.steps || null;
    const flights = healthData?.flights || null;
    const distance = healthData?.distance || null;

    // Speech recognition hook
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
        onError: (error) => {
            toast({
                type: "error",
                title: "Error",
                message: error,
            });
        },
    });

    // Keyboard listeners
    useEffect(() => {
        const showEvent =
            Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
        const hideEvent =
            Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

        const showListener = Keyboard.addListener(showEvent, (e) =>
            setKeyboardHeight(e.endCoordinates.height),
        );
        const hideListener = Keyboard.addListener(hideEvent, () =>
            setKeyboardHeight(0),
        );

        return () => {
            showListener.remove();
            hideListener.remove();
        };
    }, []);

    // Initialize with welcome message
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

    // Voice recording handlers
    const handleVocalStart = startRecording;
    const handleVocalEnd = stopRecording;
    const handleVocalCancel = cancelRecording;

    // Image upload
    const handleImagePress = () => {
        Alert.alert(
            t("CHAT.IMAGE_UPLOAD_TITLE"),
            t("CHAT.IMAGE_UPLOAD_MESSAGE"),
            [
                {
                    text: t("CHAT.TAKE_PHOTO"),
                    onPress: () => takePhoto().then(processImage),
                },
                {
                    text: t("CHAT.SELECT_FROM_GALLERY"),
                    onPress: () => pickImage().then(processImage),
                },
                { text: t("COMMON.CANCEL"), style: "cancel" },
            ],
        );
    };

    const processImage = async (imageUri: string | null) => {
        if (!imageUri) return;

        const contextText = messageText.trim();

        addMessage({
            id: Date.now().toString(),
            content: contextText || t("CHAT.IMAGE_MESSAGE"),
            role: "user",
            timestamp: new Date(),
            imageUri,
        });

        const tempId = `${Date.now()}-temp`;
        addMessage({
            id: tempId,
            content: t("CHAT.ANALYZING_IMAGE"),
            role: "assistant",
            timestamp: new Date(),
        });
        setMessageText("");

        try {
            const context = contextText
                ? `User language: ${locale}. Context: ${contextText}`
                : `User language: ${locale}. Analyze this medical image in ${locale}.`;
            const result = await analyzeImage(imageUri, context);

            removeMessage(tempId);
            addMessage({
                id: `${Date.now()}-analysis`,
                content: `${t("CHAT.IMAGE_ANALYSIS_PREFIX")}\n\n${result.diagnosis}\n\n${t("CHAT.IMAGE_ANALYSIS_SUFFIX")}`,
                role: "assistant",
                timestamp: new Date(),
            });
        } catch {
            removeMessage(tempId);
            addMessage({
                id: `${Date.now()}-error`,
                content: t("CHAT.IMAGE_ANALYSIS_ERROR"),
                role: "assistant",
                timestamp: new Date(),
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
                    onPress: () => clearMessages(),
                },
            ],
        );
    };

    const visibleMessages = messages.filter(
        (msg) => !msg.content.includes("DO NOT PRINT"),
    );

    return (
        <PageContainer scrollEnabled={false} title={t("CHAT.TITLE")}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={
                    Platform.OS === "ios" ? insets.top + headerHeight : 0
                }
            >
                <View
                    style={[
                        styles.container,
                        {
                            paddingBottom:
                                Platform.OS === "android"
                                    ? keyboardHeight - insets.bottom - 8
                                    : 0,
                        },
                    ]}
                >
                    <View
                        style={styles.headerContainer}
                        onLayout={(e) =>
                            setHeaderHeight(e.nativeEvent.layout.height)
                        }
                    >
                        <View style={styles.headerSpacer} />
                        <Text style={styles.titleText}>AI Doc</Text>
                        <TouchableOpacity
                            style={styles.clearButton}
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
                                    index === visibleMessages.length - 1 && (
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
                        onVocalStart={handleVocalStart}
                        onVocalEnd={handleVocalEnd}
                        onVocalCancel={handleVocalCancel}
                        onImagePress={handleImagePress}
                        isRecording={isRecording}
                        recordingDuration={recordingDuration}
                        volumeLevels={[]}
                        placeholder={t("CHAT.TYPE_PLACEHOLDER")}
                        loading={isLoading || isAnalyzing}
                        imageUploadTitle={t("CHAT.IMAGE_UPLOAD_TITLE")}
                    />
                </View>
            </KeyboardAvoidingView>
        </PageContainer>
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
