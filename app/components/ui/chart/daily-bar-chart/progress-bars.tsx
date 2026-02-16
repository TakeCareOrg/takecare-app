import { format, parseISO } from "date-fns";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import {
    BAR_ACTUAL_WIDTH,
    BAR_BORDER_RADIUS,
    BAR_GAP,
    BAR_WIDTH,
    COLORS,
    LABEL_BOTTOM_POSITION,
    LABEL_FONT_SIZE,
    PADDING_BOTTOM,
    SELECTED_LABEL_BACKGROUND_PADDING,
    SELECTED_LABEL_WIDTH,
    Z_INDEX,
} from "./constants";

export interface BarDataItem {
    day: string;
    value: number;
    color?: string;
    startDate?: string;
}

interface ProgressBarsProps {
    data: BarDataItem[];
    selectedBarIndex: number;
    dynamicMaxValue: number;
    chartHeight: number;
    onBarPress: (index: number) => void;
    index: number;
}

export function ProgressBars({
    data,
    selectedBarIndex,
    dynamicMaxValue,
    chartHeight,
    onBarPress,
    index,
}: ProgressBarsProps) {
    const item = data[0]; // Since we're rendering one item at a time
    const isSelected = selectedBarIndex === 0;

    const selectedDateFormat = item.startDate
        ? format(parseISO(item.startDate), "dd/MM")
        : item.day;

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={styles.barTouchable}
            onPress={() => onBarPress(index)}
        >
            <View
                style={[styles.barContainer, { paddingBottom: PADDING_BOTTOM }]}
            >
                {/* Bar */}
                <View
                    style={[
                        styles.bar,
                        {
                            height: Math.min(
                                (item.value / dynamicMaxValue) * chartHeight,
                                chartHeight,
                            ),
                            backgroundColor:
                                item.color ||
                                (isSelected
                                    ? COLORS.SELECTED_BAR
                                    : COLORS.NORMAL_BAR),
                        },
                    ]}
                />

                <View
                    style={[
                        styles.labelContainer,
                        isSelected && styles.selectedLabelContainer,
                    ]}
                >
                    {isSelected && (
                        <View style={styles.selectedLabelBackground} />
                    )}

                    <Text
                        style={[
                            styles.dayLabel,
                            isSelected ? styles.selectedDayLabel : null,
                        ]}
                        numberOfLines={1}
                        adjustsFontSizeToFit={isSelected}
                        minimumFontScale={0.8}
                    >
                        {isSelected ? selectedDateFormat : item.day}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    barContainer: {
        width: BAR_WIDTH,
        marginHorizontal: BAR_GAP / 2,
        alignItems: "center",
        height: "100%",
        justifyContent: "flex-end",
    },
    bar: {
        width: BAR_ACTUAL_WIDTH,
        borderTopLeftRadius: BAR_BORDER_RADIUS,
        borderTopRightRadius: BAR_BORDER_RADIUS,
        zIndex: Z_INDEX.BARS,
    },
    labelContainer: {
        position: "absolute",
        bottom: LABEL_BOTTOM_POSITION,
        alignItems: "center",
        justifyContent: "center",
        minWidth: BAR_WIDTH,
        height: 20,
    },
    selectedLabelContainer: {
        width: SELECTED_LABEL_WIDTH,
        left: -(SELECTED_LABEL_WIDTH - BAR_WIDTH) / 2,
        zIndex: Z_INDEX.SELECTED_LABEL_BG,
    },
    selectedLabelBackground: {
        position: "absolute",
        borderRadius: 6,
        width: "100%",
        height: "100%",
        paddingHorizontal: SELECTED_LABEL_BACKGROUND_PADDING,
    },
    dayLabel: {
        color: COLORS.LABEL_TEXT,
        fontSize: LABEL_FONT_SIZE,
        textAlign: "center",
        zIndex: Z_INDEX.SELECTED_LABEL_BG + 1,
    },
    selectedDayLabel: {
        color: COLORS.SELECTED_LABEL_TEXT,
        fontWeight: "bold",
        fontSize: LABEL_FONT_SIZE,
    },
    barTouchable: {
        height: "100%",
    },
});
