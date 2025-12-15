import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { BlurTint, BlurView } from "expo-blur";

import { colors } from "@app/constants/colors";
import { useColorTheme } from "@app/hooks/use-color-theme";

interface BubbleBlurViewProps {
    children?: React.ReactNode;
    intensity?: number;
    tint?: BlurTint;
    style?: StyleProp<ViewStyle>;
    bubbleColors?: string[];
    numberOfBubbles?: number;
    animated?: boolean;
}

const DEFAULT_BUBBLE_COLORS = [colors.blue[200], colors.blue[400]];

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
                            left: -50,
                            top: -50,
                        },
                    ]}
                />
                <View
                    style={[
                        styles.bubble,
                        {
                            width: 275,
                            height: 350,
                            backgroundColor: bubbleColors[1],
                            right: -225,
                            bottom: 250,
                            opacity: 0.5,
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
                            right: -50,
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
        opacity: 0.5,
    },
    bubble: {
        position: "absolute",
        borderRadius: 9999, // Fully circular
    },
    blurView: {
        flex: 1,
    },
});
