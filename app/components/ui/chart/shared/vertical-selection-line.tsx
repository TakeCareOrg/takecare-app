import React from "react";
import { StyleSheet, View } from "react-native";

interface VerticalSelectionLineProps {
    /** X position of the selection line center */
    centerX: number | null;
    /** Height of the line */
    height: number;
    /** Top offset from the container */
    topOffset?: number;
    /** Line width in pixels */
    lineWidth?: number;
    /** Line color */
    color?: string;
    /** Chart viewport width for visibility check */
    viewportWidth?: number;
    /** Right padding to exclude from visibility area */
    rightPadding?: number;
    /** Additional height to extend the line upward (for bubble connection) */
    extendUpward?: number;
}

export function VerticalSelectionLine({
    centerX,
    height,
    topOffset = 0,
    lineWidth = 2,
    color = "#5B7BFB",
    viewportWidth,
    rightPadding = 0,
    extendUpward = 50,
}: VerticalSelectionLineProps) {
    // Don't render if no centerX position is provided
    if (centerX === null) {
        return null;
    }

    // Auto-hide if the selected bar is outside the visible area
    // This ensures the line disappears when scrolling away from the selected bar
    if (viewportWidth && rightPadding) {
        const isVisible =
            centerX >= 0 && centerX <= viewportWidth - rightPadding;
        if (!isVisible) {
            return null;
        }
    }

    // Total height including extension upward, but cap it to not overflow
    const totalHeight = height + extendUpward;

    // Create dotted pattern manually for vertical line
    const dotSize = 3;
    const gapSize = 2;
    const dotCount = Math.floor(totalHeight / (dotSize + gapSize));

    return (
        <View
            style={[
                styles.lineContainer,
                {
                    left: centerX - lineWidth / 2,
                    bottom: topOffset, // Use bottom positioning to start from the bottom
                    height: totalHeight,
                    width: lineWidth,
                },
            ]}
        >
            {Array.from({ length: dotCount }).map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.dot,
                        {
                            width: lineWidth,
                            height: dotSize,
                            backgroundColor: color,
                            marginBottom: gapSize,
                        },
                    ]}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    lineContainer: {
        position: "absolute",
        pointerEvents: "none",
        flexDirection: "column-reverse", // Start from bottom and go up
        alignItems: "center",
        justifyContent: "flex-start",
    },
    dot: {
        borderRadius: 1,
    },
});
