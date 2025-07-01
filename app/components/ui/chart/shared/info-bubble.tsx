import React from "react";
import { StyleSheet, Text, View } from "react-native";

export interface InfoBubbleData {
    label: string;
    value: number;
    color?: string;
    intervalKey?: string;
}

interface InfoBubbleProps {
    /** Data to display in the bubble */
    data: InfoBubbleData | null;
    /** X position where the bubble should be centered */
    centerX: number | null;
    /** Y position (top) of the bubble */
    topY?: number;
    /** Background color of the bubble */
    backgroundColor?: string;
    /** Text color */
    textColor?: string;
    /** Border radius of the bubble */
    borderRadius?: number;
    /** Minimum width of the bubble */
    minWidth?: number;
    /** Maximum width of the bubble */
    maxWidth?: number;
    /** Custom formatter for the value */
    formatValue?: (value: number) => string;
    /** Additional text to show */
    subtitle?: string;
    /** Chart viewport width for visibility check */
    viewportWidth?: number;
    /** Right padding to exclude from visibility area */
    rightPadding?: number;
}

export const InfoBubble: React.FC<InfoBubbleProps> = ({
    data,
    centerX,
    topY = 10,
    backgroundColor = "rgba(224, 19, 19, 0.8)",
    textColor = "#FFFFFF",
    borderRadius = 8,
    minWidth = 80,
    maxWidth = 150,
    formatValue = (value) => value.toString(),
    subtitle,
    viewportWidth,
    rightPadding = 0,
}) => {
    // Don't render if no data or centerX position is provided
    if (!data || centerX === null) {
        return null;
    }

    // Auto-hide if the selected bar is outside the visible area
    // This ensures the bubble disappears when scrolling away from the selected bar
    if (viewportWidth && rightPadding) {
        const isVisible =
            centerX >= 0 && centerX <= viewportWidth - rightPadding;
        if (!isVisible) {
            return null;
        }
    }

    const bubbleContent = (
        <View
            style={[
                styles.bubble,
                {
                    backgroundColor,
                    borderRadius,
                    minWidth,
                    maxWidth,
                },
            ]}
        >
            <Text style={[styles.label, { color: textColor }]}>
                {data.label}
            </Text>
            <Text style={[styles.value, { color: textColor }]}>
                {formatValue(data.value)}
            </Text>
            {subtitle && (
                <Text style={[styles.subtitle, { color: textColor }]}>
                    {subtitle}
                </Text>
            )}
        </View>
    );

    return (
        <View
            style={[
                styles.container,
                {
                    top: topY,
                    left: centerX, // Position at centerX
                    transform: [{ translateX: -40 }], // Center using transform
                },
            ]}
            pointerEvents="none"
        >
            {bubbleContent}
            <View
                style={[
                    styles.arrow,
                    {
                        borderTopColor: backgroundColor,
                        alignSelf: "center", // Center the arrow
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        alignItems: "center",
        zIndex: 1000,
    },
    bubble: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    label: {
        fontSize: 12,
        fontWeight: "600",
        marginBottom: 2,
    },
    value: {
        fontSize: 14,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 10,
        marginTop: 2,
        opacity: 0.8,
    },
    arrow: {
        width: 0,
        height: 0,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 6,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        marginTop: -1, // Slightly overlap with bubble
    },
});
