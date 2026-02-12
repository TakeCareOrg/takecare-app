import React from "react";
import { StyleSheet, View } from "react-native";

import { useColorTheme } from "@hooks/use-color-theme";

import { AnimatedDots } from "./animated-dots";

interface TemporaryRecordingMessageProps {
    isRecording: boolean;
}

export const TemporaryRecordingMessage: React.FC<
    TemporaryRecordingMessageProps
> = ({ isRecording }) => {
    const theme = useColorTheme();

    if (!isRecording) return null;

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.bubble,
                    {
                        backgroundColor: theme.isDark
                            ? theme.blue[900] + "40"
                            : theme.blue[100],
                    },
                ]}
            >
                <AnimatedDots
                    color={theme.isDark ? theme.blue[400] : theme.blue[600]}
                />
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
    bubble: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 18,
        maxWidth: "80%",
        minWidth: 60,
    },
});
