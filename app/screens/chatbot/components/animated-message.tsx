import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

import { Text } from "@components/ui/text";
import { Message } from "@dtypes/chatbot/chatbot-types";
import { useColorTheme } from "@hooks/use-color-theme";
import { formatHour } from "@utils/date";
import { parseMarkdown } from "@utils/parse-markdown";

import { MessageAvatar } from "./message-avatar";

interface AnimatedMessageProps {
    message: Message;
    isSendByUser: boolean;
}

const width = Dimensions.get("window").width;

export function AnimatedMessage({
    message,
    isSendByUser,
}: AnimatedMessageProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const themeColors = useColorTheme();

    const textColor = themeColors.isDark
        ? themeColors.raw.white[500]
        : themeColors.raw.white[600];

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
    }, [fadeAnim, slideAnim]);

    return (
        <Animated.View
            style={[
                styles.messageContainer,
                {
                    flexDirection: isSendByUser ? "row-reverse" : "row",
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <MessageAvatar isSendByUser={isSendByUser} />

            <View style={styles.messageContentContainer}>
                <View style={styles.messageHeader}>
                    {!isSendByUser && (
                        <Text style={[styles.botNameText]}>AI Doc</Text>
                    )}
                </View>

                <View
                    style={[
                        styles.botMessageBubble,
                        {
                            backgroundColor: isSendByUser
                                ? themeColors.isDark
                                    ? themeColors.raw.blue[400]
                                    : themeColors.raw.blue[50]
                                : themeColors.grey,
                        },
                    ]}
                >
                    <Text style={styles.messageText}>
                        {parseMarkdown(message.content).map(
                            (element, index) => (
                                <Text
                                    key={index}
                                    style={{
                                        color: textColor,
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
                            styles.headerTimeText,
                            {
                                color: textColor,
                                opacity: 0.5,
                                alignSelf: "flex-end",
                            },
                        ]}
                    >
                        {formatHour(message.timestamp)}
                    </Text>
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    messageContainer: {
        marginVertical: 4,
        alignItems: "flex-start",
    },
    messageContentContainer: {
        flex: 1,
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
        fontWeight: "semibold",
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
