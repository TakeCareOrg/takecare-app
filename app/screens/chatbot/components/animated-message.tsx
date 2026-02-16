import { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

import { Text } from "@components/ui/text";
import { Message } from "@dtypes/chatbot/chatbot-types";
import { useColorTheme } from "@hooks/use-color-theme";
import { formatHour } from "@utils/date";
import { parseMarkdown } from "@utils/parse-markdown";

import { AnimatedMessageWrapper } from "./animated-message-wrapper";
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

    const textColor = themeColors.text;

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
                    alignItems: isSendByUser ? "flex-end" : "flex-start",
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            {!isSendByUser && (
                <View style={styles.botHeader}>
                    <MessageAvatar isSendByUser={false} />
                    <Text style={styles.botNameText}>AI Doc</Text>
                </View>
            )}

            <View
                style={[
                    styles.bubbleContainer,
                    !isSendByUser && { marginLeft: 4 },
                ]}
            >
                <AnimatedMessageWrapper
                    message={message}
                    isSendByUser={isSendByUser}
                >
                    <View
                        style={[
                            styles.messageBubble,
                            isSendByUser ? styles.userBubble : styles.botBubble,
                            {
                                backgroundColor: isSendByUser
                                    ? themeColors.isDark
                                        ? themeColors.raw.blue[400]
                                        : themeColors.raw.blue[50]
                                    : themeColors.isDark
                                      ? themeColors.grey
                                      : themeColors.box,
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
                </AnimatedMessageWrapper>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    messageContainer: {
        marginVertical: 4,
    },
    botHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    botNameText: {
        fontSize: 14,
        fontWeight: "600",
    },
    bubbleContainer: {
        maxWidth: width * 0.85,
    },
    messageBubble: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 18,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 16,
    },
    botBubble: {
        borderTopLeftRadius: 4,
        marginRight: 40,
    },
    userBubble: {
        borderBottomRightRadius: 4,
        marginLeft: 40,
    },
    headerTimeText: {
        fontSize: 12,
        fontWeight: "semibold",
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
});
