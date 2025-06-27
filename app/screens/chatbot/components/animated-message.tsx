import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

import { Text } from "@components/ui/text";

import { parseMarkdown } from "@utils/parse-markdown";

import { Message } from "../../../types/chatbot/chatbot-types";
import { MessageAvatar } from "./message-avatar";

interface AnimatedMessageProps {
    message: Message;
    isSendByUser: boolean;
    isDarkMode: boolean;
}

const width = Dimensions.get("window").width;

export const AnimatedMessage: React.FC<AnimatedMessageProps> = ({
    message,
    isSendByUser,
    isDarkMode,
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (isSendByUser) {
        return (
            <Animated.View
                style={[
                    styles.messageContainer,
                    {
                        flexDirection: "row-reverse",
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            >
                <View
                    style={[
                        styles.messageBubble,
                        {
                            backgroundColor: isDarkMode ? "#007AFF" : "#BBDEFB",
                            alignSelf: "flex-end",
                            borderBottomRightRadius: 4,
                            borderBottomLeftRadius: 18,
                            maxWidth: width * 0.75,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.messageText,
                            {
                                color: isDarkMode ? "#FFFFFF" : "#000000",
                            },
                        ]}
                    >
                        {parseMarkdown(message.content).map(
                            (element, index) => (
                                <Text
                                    key={index}
                                    style={{
                                        fontWeight:
                                            element.type === "bold"
                                                ? "bold"
                                                : "normal",
                                        fontStyle:
                                            element.type === "italic"
                                                ? "italic"
                                                : "normal",
                                    }}
                                >
                                    {element.content}
                                </Text>
                            ),
                        )}
                    </Text>
                    <Text
                        style={[
                            styles.timeText,
                            {
                                color: isDarkMode
                                    ? "rgba(255,255,255,0.5)"
                                    : "rgba(0,0,0,0.5)",
                            },
                        ]}
                    >
                        {formatTime(message.timestamp)}
                    </Text>
                </View>
            </Animated.View>
        );
    }

    return (
        <Animated.View
            style={[
                styles.messageContainer,
                {
                    flexDirection: "row",
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <MessageAvatar isSendByUser={false} />

            <View style={styles.messageContentContainer}>
                <View style={styles.messageHeader}>
                    <Text
                        style={[
                            styles.botNameText,
                            { color: isDarkMode ? "#FFFFFF" : "#000000" },
                        ]}
                    >
                        AI Doc
                    </Text>
                    <Text
                        style={[
                            styles.headerTimeText,
                            {
                                color: isDarkMode
                                    ? "rgba(255,255,255,0.5)"
                                    : "rgba(0,0,0,0.5)",
                            },
                        ]}
                    >
                        {formatTime(message.timestamp)}
                    </Text>
                </View>

                <View
                    style={[
                        styles.botMessageBubble,
                        {
                            backgroundColor: isDarkMode ? "#2C2C2E" : "#F0F0F0",
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.messageText,
                            {
                                color: isDarkMode ? "#FFFFFF" : "#000000",
                            },
                        ]}
                    >
                        {parseMarkdown(message.content).map(
                            (element, index) => (
                                <Text
                                    key={index}
                                    style={{
                                        fontWeight:
                                            element.type === "bold"
                                                ? "bold"
                                                : "normal",
                                        fontStyle:
                                            element.type === "italic"
                                                ? "italic"
                                                : "normal",
                                    }}
                                >
                                    {element.content}
                                </Text>
                            ),
                        )}
                    </Text>
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    messageContainer: {
        marginVertical: 4,
        alignItems: "flex-start",
    },
    messageContentContainer: {
        flex: 1,
        marginLeft: 12,
        maxWidth: width * 0.7,
    },
    messageHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    botNameText: {
        fontSize: 14,
        fontWeight: "600",
    },
    headerTimeText: {
        fontSize: 12,
    },
    botMessageBubble: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 18,
        borderBottomLeftRadius: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 16,
    },
    messageBubble: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 18,
        marginHorizontal: 8,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    timeText: {
        fontSize: 12,
        marginTop: 4,
        textAlign: "right",
    },
});
