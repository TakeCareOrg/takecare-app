import React from "react";
import { StyleSheet, View } from "react-native";

import { BAR_WIDTH, COLORS, SELECTION_ZONE_BORDER_RADIUS } from "./constants";

interface SelectionZoneProps {
    selectionZoneLeft: number | null;
    height: number;
    paddingTop: number;
    paddingBottom: number;
}

export const SelectionZone: React.FC<SelectionZoneProps> = ({
    selectionZoneLeft,
    height,
    paddingTop,
    paddingBottom,
}) => {
    if (selectionZoneLeft === null) {
        return null;
    }

    const SELECTION_ZONE_WIDTH = BAR_WIDTH + 3;

    return (
        <View
            style={[
                styles.selectionZone,
                {
                    left: selectionZoneLeft,
                    height: height - paddingTop - paddingBottom,
                    width: SELECTION_ZONE_WIDTH,
                },
            ]}
        />
    );
};

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
