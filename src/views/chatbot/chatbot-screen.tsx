import { track } from "@amplitude/analytics-react-native";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { useColors } from "../../styles/Colors";
import { useAuth } from "../../contexts/auth-context";
import { useIosHealthData } from "../../hooks/use-ios-health-data";
import useToast from "../../hooks/use-toast";
import { useVocalRecording } from "../../hooks/use-vocal-recording";
import ClearButton from "../../ui/buttons/clear-button";
import ChatInput from "../../ui/inputs/chat-input";
import { TextComponent } from "../../ui/text-component";
import DoctorIcon from "../../../assets/images/doctor-icon.jpeg";
import { LoadingMessage } from "./components/loading-message";
import { MessageAvatar } from "./components/message-avatar";
import { MessageBubble } from "./components/message-bubble";

interface Message {
    _id: number;
    text: string;
    createdAt: Date;
    user: {
        _id: number | string;
        name: string;
        avatar: any;
    };
}

export const ChatbotScreen = () => {
    const { main } = useColors();
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageText, setMessageText] = useState<string>("");
    const { user, makeAPICall } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [tokens, setTokens] = useState<string>("");
    const toast = useToast();
    const { steps, distance, sleep, weight, height, hydration } =
        useIosHealthData();
    const [keyboardOpen, setKeyboardOpen] = useState<boolean>(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const { t } = useTranslation();

    // Vocal recording: pre-warms audio session on mount
    // This eliminates cold-start delay on first vocal press
    const handleTranscriptionComplete = useCallback(
        (text: string) => {
            setMessageText(text);
        },
        [],
    );

    const handleTranscriptionError = useCallback(
        (error: string) => {
            toast({
                type: "error",
                title: t("GLOBAL.ERROR"),
                message: error,
            });
        },
        [toast, t],
    );

    const {
        isRecording,
        isTranscribing,
        isReady: isVocalReady,
        startRecording,
        stopRecordingAndTranscribe,
    } = useVocalRecording({
        onTranscriptionComplete: handleTranscriptionComplete,
        onTranscriptionError: handleTranscriptionError,
    });

    useEffect(() => {
        setDefaultMessages();
    }, []);

    useEffect(() => {
        refreshTokens();
        tryToRefreshTokens();
    }, [user?.chat_tokens]);

    const refreshTokens = async () => {
        await makeAPICall("GET", "/auth/user")
            .then((res) => {
                setTokens(res.data.chat_tokens);
                if (res.data.chat_tokens === 0) {
                    tryToRefreshTokens();
                }
            })
            .catch(() => {
                toast({
                    type: "error",
                    title: "Error",
                    message: "An error occurred. Please try again.",
                });
            });
    };

    const tryToRefreshTokens = async () => {
        await makeAPICall("POST", "/chat/refresh-chat-tokens")
            .then((res) => {
                setTokens(res.data.chat_tokens);

                if (res.data.time_left) {
                    toast({
                        type: "info",
                        title: "Renewal Approaching",
                        message: res.data.time_left,
                    });
                }
            })
            .catch((err) => {
                toast({
                    type: "error",
                    title: "Error",
                    message: err.message,
                });
            });
    };

    useEffect(() => {
        const showSubscription = Keyboard.addListener(
            "keyboardWillShow",
            () => {
                setKeyboardOpen(true);
            },
        );
        const hideSubscription = Keyboard.addListener(
            "keyboardWillHide",
            () => {
                setKeyboardOpen(false);
            },
        );

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    const onSend = async () => {
        if (messageText === "") {
            return;
        }

        if (parseInt(tokens) === 0) {
            toast({
                type: "error",
                title: "Error",
                message:
                    "You have insufficient chat tokens. Please try again later.",
            });
            return;
        }

        setLoading(true);
        Keyboard.dismiss();

        const newMessage: Message = {
            _id: messages.length + 1,
            text: messageText,
            createdAt: new Date(),
            user: {
                _id: user?.user_id ? user.user_id : "1",
                name: "user",
                avatar: null,
            },
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        track("Chatbase message sent");
        setMessageText("");

        const dataToSend = {
            range: "3 days ago from now",
            steps,
            distance,
            sleep: `${sleep} minutes`,
            age: `${user?.health?.age || "unknown"} years`,
            gender: user?.health?.gender || "unknown",
            weight: `${user?.health?.weight || weight || 0} kg`,
            height: `${user?.health?.height || height || 0} cm`,
            hydration: `${hydration} L`,
        };

        const additionalInfoMessage = Object.entries(dataToSend)
            .filter(([value]) => value !== undefined)
            .map(([key, value]) => {
                const number =
                    typeof value === "string" && value.includes(" ")
                        ? parseInt(value.split(" ")[0])
                        : value;
                const valueToWrite = number === 0 ? "unknown" : value;
                return `${key}: ${valueToWrite}`;
            })
            .join(", ");

        let _messages = [...messages, newMessage];

        if (messages.length === 1) {
            _messages = [
                ..._messages,
                {
                    _id: messages.length + 2,
                    text: `DO NOT PRINT Additional information DO NOT PRINT: ${additionalInfoMessage} DO NOT PRINT`,
                    createdAt: new Date(),
                    user: {
                        _id: "2",
                        name: "assistant",
                        avatar: DoctorIcon,
                    },
                },
            ];
        }

        // (Artificial change)
        setTokens((prevTokens) => (parseInt(prevTokens) - 1).toString());

        await makeAPICall("POST", "/chat/send-message", { messages: _messages })
            .then((res) => {
                refreshTokens();
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        _id: prevMessages.length + 1,
                        text: res.data.message,
                        createdAt: new Date(),
                        user: {
                            _id: "2",
                            name: "assistant",
                            avatar: DoctorIcon,
                        },
                    },
                ]);
            })
            .catch((err) => {
                toast({
                    type: "error",
                    title: "Error",
                    message:
                        err.message === "INSUFFICIENT_CHAT_TOKENS"
                            ? "You have insufficient chat tokens. Please try again later."
                            : "An error occurred. Please try again.",
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const isSendByUser = (message: Message) => {
        return message.user._id === user?.user_id;
    };

    const handleFileReceived = (message: string) => {
        const newMessage: Message = {
            _id: messages.length + 1,
            text: message.chatbotResponse.text,
            createdAt: new Date(),
            user: {
                _id: 2,
                name: "assistant",
                avatar: DoctorIcon,
            },
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setLoading(false);
    };

    const handlePhotoReceived = (message: string) => {
        const newMessage: Message = {
            _id: messages.length + 1,
            text: message.chatbotResponse.text,
            createdAt: new Date(),
            user: {
                _id: 2,
                name: "assistant",
                avatar: DoctorIcon,
            },
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setLoading(false);
    };

    const handleBlockInputs = () => {
        setLoading(true);
    };

    const handleClearMessages = () => {
        setDefaultMessages();
    };

    const setDefaultMessages = () => {
        setMessages([
            {
                _id: 1,
                text: t("CHAT.HELLO"),
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: "assistant",
                    avatar: DoctorIcon,
                },
            },
        ]);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View
                style={{
                    ...styles.container,
                    backgroundColor: main.background,
                    paddingBottom: keyboardOpen ? 50 : 130,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        marginVertical: 16,
                        marginTop: 32,
                    }}
                >
                    <View>
                        <TextComponent fontSize={24}>Andrew</TextComponent>
                        <TextComponent fontSize={16}>
                            ({tokens} {t("CHAT.TOKEN")})
                        </TextComponent>
                    </View>
                </View>
                <ClearButton onPress={handleClearMessages} />
                <ScrollView
                    ref={scrollViewRef}
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: "flex-start",
                    }}
                    onContentSizeChange={() =>
                        scrollViewRef.current?.scrollToEnd({ animated: true })
                    }
                    showsVerticalScrollIndicator={false}
                >
                    {messages.map((message) => (
                        <View
                            key={message._id}
                            style={{
                                ...styles.messageContainer,
                                flexDirection: isSendByUser(message)
                                    ? "row-reverse"
                                    : "row",
                            }}
                        >
                            <MessageAvatar
                                isSendByUser={isSendByUser(message)}
                            />
                            <MessageBubble
                                isSendByUser={isSendByUser(message)}
                                messageText={message.text}
                            />
                        </View>
                    ))}
                    {loading && <LoadingMessage />}
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
                    placeholder={isRecording ? t("CHAT.RECORDING") : isTranscribing ? t("CHAT.TRANSCRIBING") : t("CHAT.TYPE_PLACEHOLDER")}
                    loading={loading || isTranscribing}
                    isRecording={isRecording}
                    isTranscribing={isTranscribing}
                    isVocalReady={isVocalReady}
                    onVocalPressIn={startRecording}
                    onVocalPressOut={stopRecordingAndTranscribe}
                />
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        padding: 16,
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
    messageContainer: {
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "flex-start",
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
    },
});
