import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { BlurView } from "expo-blur";

import { useColorTheme } from "@app/hooks/use-color-theme";

interface BubbleBlurViewProps {
    children?: React.ReactNode;
    intensity?: number;
    tint?: "light" | "dark" | "default";
    style?: StyleProp<ViewStyle>;
    bubbleColors?: string[];
    numberOfBubbles?: number;
    animated?: boolean;
}

const DEFAULT_BUBBLE_COLORS = [
    "rgba(138, 99, 210, 0.2)", // Purple
    "rgba(59, 130, 246, 0.2)", // Blue
    "rgba(236, 72, 153, 0.2)", // Pink
    "rgba(34, 197, 94, 0.2)", // Green
    "rgba(251, 146, 60, 0.2)", // Orange
    "rgba(168, 85, 247, 0.2)", // Violet
    "rgba(20, 184, 166, 0.2)", // Teal
    "rgba(249, 115, 22, 0.2)", // Deep Orange
];

export const BubbleBlurView: React.FC<BubbleBlurViewProps> = ({
    children,
    intensity = 80,
    tint = "light",
    style,
    bubbleColors = DEFAULT_BUBBLE_COLORS,
}) => {
    const { background } = useColorTheme();
    return (
        <View
            style={[styles.container, { backgroundColor: background }, style]}
        >
            {/* Bubbles Background */}
            <View style={styles.bubblesContainer}>
                <View
                    style={[
                        styles.bubble,
                        {
                            width: 200,
                            height: 200,
                            backgroundColor: bubbleColors[0],
                            right: -50,
                            top: -50,
                        },
                    ]}
                />
                <View
                    style={[
                        styles.bubble,
                        {
                            width: 300,
                            height: 350,
                            backgroundColor: bubbleColors[1],
                            right: -225,
                            bottom: 200,
                        },
                    ]}
                />
                <View
                    style={[
                        styles.bubble,
                        {
                            width: 175,
                            height: 150,
                            backgroundColor: bubbleColors[0],
                            left: -50,
                            bottom: -25,
                        },
                    ]}
                />
            </View>
            {/* Blur Overlay */}
            <BlurView intensity={intensity} tint={tint} style={styles.blurView}>
                {children}
            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
    },
    bubblesContainer: {
        ...StyleSheet.absoluteFillObject,
        overflow: "hidden",
    },
    bubble: {
        position: "absolute",
        borderRadius: 9999, // Fully circular
    },
    blurView: {
        flex: 1,
    },
});
