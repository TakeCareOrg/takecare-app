import React from "react";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";

import {
    COLORS,
    SELECTION_ZONE_BORDER_RADIUS,
    SELECTION_ZONE_WIDTH,
} from "./constants";

interface SelectionZoneProps {
    selectionZoneLeft: SharedValue<number>;
    visible: boolean;
    height: number;
    paddingTop: number;
    paddingBottom: number;
}

/**
 * Fixed-position selection zone overlay.
 * Animated on the UI thread via SharedValue — no React re-renders.
 * withTiming auto-interrupts to redirect mid-animation on rapid presses.
 */
export function SelectionZone({
    selectionZoneLeft,
    visible,
    height,
    paddingTop,
    paddingBottom,
}: SelectionZoneProps) {
    const animatedStyle = useAnimatedStyle(() => ({
        left: selectionZoneLeft.value,
    }));

    if (!visible) {
        return null;
    }

    return (
        <Animated.View
            style={[
                styles.selectionZone,
                {
                    height: height - paddingTop - paddingBottom,
                    width: SELECTION_ZONE_WIDTH,
                },
                animatedStyle,
            ]}
        />
    );
}

const styles = StyleSheet.create({
    selectionZone: {
        position: "absolute",
        backgroundColor: COLORS.SELECTION_ZONE_BG,
        top: 0,
        borderTopLeftRadius: SELECTION_ZONE_BORDER_RADIUS,
        borderTopRightRadius: SELECTION_ZONE_BORDER_RADIUS,
        pointerEvents: "none",
    },
});
