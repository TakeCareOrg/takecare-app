import { format, parseISO } from "date-fns";
import React from "react";
import {
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

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
    YEAR_DIVIDER_WIDTH,
    Z_INDEX,
} from "./constants";

export interface BarDataItem {
    day: string;
    value: number;
    color?: string;
    startDate?: string;
}

// Type pour les événements de défilement
type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>;

interface ProgressBarsProps {
    data: BarDataItem[];
    selectedBarIndex: number;
    dynamicMaxValue: number;
    chartHeight: number;
    contentWidth: number;
    onBarPress: (index: number) => void;
    onScrollBeginDrag?: (event: ScrollEvent) => void;
}

export function ProgressBars({
    data,
    selectedBarIndex,
    dynamicMaxValue,
    chartHeight,
    contentWidth,
    onBarPress,
    onScrollBeginDrag,
}: ProgressBarsProps) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ width: contentWidth }}
            onScrollBeginDrag={onScrollBeginDrag}
            scrollEventThrottle={8}
            decelerationRate="normal"
            snapToInterval={undefined}
            bounces={true}
            bouncesZoom={false}
            maximumZoomScale={1}
            minimumZoomScale={1}
            showsVerticalScrollIndicator={false}
            overScrollMode="auto"
            nestedScrollEnabled={true}
        >
            {data.map((item, index) => {
                const isSelected = selectedBarIndex === index;
                const prevItem = index > 0 ? data[index - 1] : null;

                const showYearDivider =
                    prevItem &&
                    item.startDate &&
                    prevItem.startDate &&
                    new Date(item.startDate).getFullYear() !==
                        new Date(prevItem.startDate).getFullYear();

                const selectedDateFormat = item.startDate
                    ? format(parseISO(item.startDate), "dd/MM")
                    : item.day;

                return (
                    <React.Fragment key={index}>
                        {showYearDivider && (
                            <View style={styles.yearDivider}>
                                <View style={styles.yearDividerLine} />
                                <Text style={styles.yearDividerText}>
                                    {new Date(item.startDate!).getFullYear()}
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={styles.barTouchable}
                            onPress={() => onBarPress(index)}
                        >
                            <View
                                style={[
                                    styles.barContainer,
                                    { paddingBottom: PADDING_BOTTOM },
                                ]}
                            >
                                {/* Bar */}
                                <View
                                    style={[
                                        styles.bar,
                                        {
                                            height: Math.min(
                                                (item.value / dynamicMaxValue) *
                                                    chartHeight,
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
                                        isSelected &&
                                            styles.selectedLabelContainer,
                                    ]}
                                >
                                    {isSelected && (
                                        <View
                                            style={
                                                styles.selectedLabelBackground
                                            }
                                        />
                                    )}

                                    <Text
                                        style={[
                                            styles.dayLabel,
                                            isSelected
                                                ? styles.selectedDayLabel
                                                : null,
                                        ]}
                                        numberOfLines={1}
                                        adjustsFontSizeToFit={isSelected}
                                        minimumFontScale={0.8}
                                    >
                                        {isSelected
                                            ? selectedDateFormat
                                            : item.day}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </React.Fragment>
                );
            })}
        </ScrollView>
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
    yearDivider: {
        width: YEAR_DIVIDER_WIDTH,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    yearDividerLine: {
        width: 2,
        height: "60%",
        backgroundColor: COLORS.LABEL_TEXT,
        opacity: 0.5,
        position: "absolute",
        top: "20%",
    },
    yearDividerText: {
        color: COLORS.LABEL_TEXT,
        fontSize: 10,
        fontWeight: "600",
        position: "absolute",
        bottom: LABEL_BOTTOM_POSITION,
        backgroundColor: "transparent",
        paddingHorizontal: 2,
        transform: [{ rotate: "-90deg" }],
    },
});
