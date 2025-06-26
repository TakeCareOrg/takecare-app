import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

import { MessageAvatar } from "@screens/chatbot/components/message-avatar";

export const TypingIndicator = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animate = () => {
            Animated.sequence([
                Animated.timing(dot1, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(dot2, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(dot3, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(dot1, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(dot2, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(dot3, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start(() => animate());
        };
        animate();
    }, []);

    return (
        <View style={[styles.messageContainer, { flexDirection: "row" }]}>
            <MessageAvatar isSendByUser={false} />
            <View
                style={[
                    styles.typingBubble,
                    { backgroundColor: isDarkMode ? "#2C2C2E" : "#F0F0F0" },
                ]}
            >
                <View style={styles.typingDotsContainer}>
                    <Animated.View
                        style={[
                            styles.typingDot,
                            {
                                opacity: dot1,
                                backgroundColor: isDarkMode
                                    ? "#8E8E93"
                                    : "#8E8E93",
                            },
                        ]}
                    />
                    <Animated.View
                        style={[
                            styles.typingDot,
                            {
                                opacity: dot2,
                                backgroundColor: isDarkMode
                                    ? "#8E8E93"
                                    : "#8E8E93",
                            },
                        ]}
                    />
                    <Animated.View
                        style={[
                            styles.typingDot,
                            {
                                opacity: dot3,
                                backgroundColor: isDarkMode
                                    ? "#8E8E93"
                                    : "#8E8E93",
                            },
                        ]}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    typingBubble: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 18,
        marginHorizontal: 8,
        marginBottom: 16,
        borderBottomLeftRadius: 4,
    },
    typingDotsContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    typingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 2,
    },
    messageContainer: {
        marginVertical: 4,
        alignItems: "flex-end",
    },
    sendButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 8,
    },
});
