import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

import { useColorTheme } from "@hooks/use-color-theme";

interface TemporaryRecordingMessageProps {
    isRecording: boolean;
}

export const TemporaryRecordingMessage: React.FC<
    TemporaryRecordingMessageProps
> = ({ isRecording }) => {
    const theme = useColorTheme();

    const dot1Opacity = useRef(new Animated.Value(0.3)).current;
    const dot2Opacity = useRef(new Animated.Value(0.3)).current;
    const dot3Opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        if (!isRecording) {
            dot1Opacity.setValue(0.3);
            dot2Opacity.setValue(0.3);
            dot3Opacity.setValue(0.3);
            return;
        }

        const createDotAnimation = (
            dotOpacity: Animated.Value,
            delay: number,
        ) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(dotOpacity, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dotOpacity, {
                        toValue: 0.3,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ]),
            );
        };

        const animation1 = createDotAnimation(dot1Opacity, 0);
        const animation2 = createDotAnimation(dot2Opacity, 200);
        const animation3 = createDotAnimation(dot3Opacity, 400);

        animation1.start();
        animation2.start();
        animation3.start();

        return () => {
            animation1.stop();
            animation2.stop();
            animation3.stop();
        };
    }, [isRecording, dot1Opacity, dot2Opacity, dot3Opacity]);

    if (!isRecording) return null;

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.messageContainer,
                    {
                        backgroundColor: theme.isDark
                            ? theme.raw.blue[900] + "40"
                            : theme.raw.blue[100],
                    },
                ]}
            >
                <View style={styles.dotsContainer}>
                    <Animated.View
                        style={[
                            styles.dot,
                            {
                                backgroundColor: theme.isDark
                                    ? theme.raw.blue[400]
                                    : theme.raw.blue[600],
                                opacity: dot1Opacity,
                            },
                        ]}
                    />
                    <Animated.View
                        style={[
                            styles.dot,
                            {
                                backgroundColor: theme.isDark
                                    ? theme.raw.blue[400]
                                    : theme.raw.blue[600],
                                opacity: dot2Opacity,
                            },
                        ]}
                    />
                    <Animated.View
                        style={[
                            styles.dot,
                            {
                                backgroundColor: theme.isDark
                                    ? theme.raw.blue[400]
                                    : theme.raw.blue[600],
                                opacity: dot3Opacity,
                            },
                        ]}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignItems: "flex-end",
    },
    messageContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 18,
        maxWidth: "80%",
        minWidth: 60,
    },
    dotsContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});
