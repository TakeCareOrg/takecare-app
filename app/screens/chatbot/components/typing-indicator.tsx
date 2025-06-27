import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

import { Text } from "@components/ui/text";

import { MessageAvatar } from "@screens/chatbot/components/message-avatar";

import { useColorTheme } from "@app/hooks/use-color-theme";

export const TypingIndicator = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;
    const themeColors = useColorTheme();

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

            <View style={styles.messageContentContainer}>
                <View style={styles.messageHeader}>
                    <Text style={styles.botNameText}>AI Doc</Text>
                </View>

                <View
                    style={[
                        styles.typingBubble,
                        { backgroundColor: themeColors.grey },
                    ]}
                >
                    <View style={styles.typingDotsContainer}>
                        <Animated.View
                            style={[
                                styles.typingDot,
                                {
                                    opacity: dot1,
                                    backgroundColor: themeColors.reverse,
                                },
                            ]}
                        />
                        <Animated.View
                            style={[
                                styles.typingDot,
                                {
                                    opacity: dot2,
                                    backgroundColor: themeColors.reverse,
                                },
                            ]}
                        />
                        <Animated.View
                            style={[
                                styles.typingDot,
                                {
                                    opacity: dot3,
                                    backgroundColor: themeColors.reverse,
                                },
                            ]}
                        />
                    </View>
                </View>
            </View>
        </View>
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
        maxWidth: 70,
    },
    messageHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    botNameText: {
        fontSize: 14,
        fontWeight: "600",
    },
    typingBubble: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 18,
        borderBottomLeftRadius: 4,
        marginBottom: 16,
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
});
