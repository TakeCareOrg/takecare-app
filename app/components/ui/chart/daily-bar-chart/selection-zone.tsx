import React from "react";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";

import { BAR_WIDTH, COLORS, SELECTION_ZONE_BORDER_RADIUS } from "./constants";

interface SelectionZoneProps {
    selectionZoneLeft: number | null;
    scrollOffset: SharedValue<number>;
    height: number;
    paddingTop: number;
    paddingBottom: number;
}

export function SelectionZone({
    selectionZoneLeft,
    scrollOffset,
    height,
    paddingTop,
    paddingBottom,
}: SelectionZoneProps) {
    const SELECTION_ZONE_WIDTH = BAR_WIDTH + 3;

    const animatedStyle = useAnimatedStyle(() => {
        if (selectionZoneLeft === null) {
            return {
                opacity: 0,
            };
        }
        return {
            opacity: 1,
            transform: [
                {
                    translateX: selectionZoneLeft - scrollOffset.value,
                },
            ],
        };
    });

    if (selectionZoneLeft === null) {
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
