import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColorTheme } from "@app/hooks/use-color-theme";
import { useTranslation } from "react-i18next";

interface Time {
    hours: number;
    minutes: number;
}

interface SleepTarget {
    min: Time;
    max: Time;
}

interface SleepBarProps {
    sleepedTime: Time;
    sleepTarget: SleepTarget;
}

const SleepBar: React.FC<SleepBarProps> = ({ sleepedTime, sleepTarget }) => {
    const { t } = useTranslation();
    const colors = useColorTheme();

    // Calculate the width of the sleep segment
    const getSleepWidth = () => {
        const sleepedMinutes = sleepedTime.hours * 60 + sleepedTime.minutes;
        const minSleepMinutes =
            sleepTarget.min.hours * 60 + sleepTarget.min.minutes;
        const maxSleepMinutes =
            sleepTarget.max.hours * 60 + sleepTarget.max.minutes;

        if (sleepedMinutes < minSleepMinutes) {
            return 0;
        }

        if (sleepedMinutes > maxSleepMinutes) {
            return 100;
        }

        return (
            ((sleepedMinutes - minSleepMinutes) /
                (maxSleepMinutes - minSleepMinutes)) *
            100
        );
    };

    const getOverSleepWidth = () => {
        const sleepedMinutes =
            (sleepedTime.hours * 60 + sleepedTime.minutes) / 2;
        const maxSleepMinutes =
            (sleepTarget.max.hours * 60 + sleepTarget.max.minutes) / 2;

        if (sleepedMinutes > maxSleepMinutes) {
            return Math.min(
                (((sleepedMinutes - maxSleepMinutes) / 60) * 100) / 2,
                100,
            );
        }

        return 0;
    };

    const getUnderSleepWidth = () => {
        const sleepedMinutes = sleepedTime.hours * 60 + sleepedTime.minutes;
        const minSleepMinutes =
            sleepTarget.min.hours * 60 + sleepTarget.min.minutes;

        return Math.max((sleepedMinutes / minSleepMinutes) * 100);
    };

    return (
        <View>
            <View style={{ marginBottom: 10 }}>
                <Text style={{ color: colors.primary }}>
                    {t("HOME_PAGE.SLEEP")}
                </Text>
                <Text style={{ color: colors.primary }}>
                    {sleepedTime.hours}h
                    {sleepedTime.minutes !== 0
                        ? `${sleepedTime.minutes}min`
                        : ""}
                </Text>
            </View>
            <View
                style={{
                    ...styles.container,
                    ...{
                        backgroundColor: colors.inputBackground,
                    },
                }}
            >
                <View style={[styles.barSegment, { flex: 1 }]}>
                    <View
                        style={[
                            styles.barSegment,
                            {
                                flex: 1,
                                width: getUnderSleepWidth(),
                                backgroundColor: colors.sleep.less,
                            },
                        ]}
                    ></View>
                </View>
                <View style={[styles.middleSegmentContainer, { flex: 1 }]}>
                    <View
                        style={{
                            flex: 1,
                            width: "100%",
                            backgroundColor: colors.inputBackground,
                        }}
                    >
                        <Text
                            style={[
                                styles.text,
                                styles.minText,
                                { color: colors.primary },
                            ]}
                        >
                            {sleepTarget.min.hours}h
                        </Text>
                        <View
                            style={[
                                {
                                    flex: 1,
                                    width: `${getSleepWidth()}%`,
                                    backgroundColor: colors.sleep.good,
                                    borderTopRightRadius:
                                        getOverSleepWidth() > 0 ? 0 : 5,
                                    borderBottomRightRadius:
                                        getOverSleepWidth() > 0 ? 0 : 5,
                                },
                            ]}
                        />
                        <Text
                            style={[
                                styles.text,
                                styles.maxText,
                                { color: colors.primary },
                            ]}
                        >
                            {sleepTarget.max.hours}h
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        width: "100%",
                        flex: 1,
                    }}
                >
                    <View
                        style={[
                            styles.barSegmentRight,
                            {
                                flex: 1,
                                width: getOverSleepWidth(),
                                backgroundColor: colors.sleep.more,
                            },
                        ]}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: 5, // You can adjust the height of the bar
        width: "100%", // Full width of the container
        borderRadius: 5,
    },
    barSegment: {
        height: "100%", // Full height of the container
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
    },
    barSegmentRight: {
        height: "100%", // Full height of the container
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
    },
    middleSegmentContainer: {
        height: "100%",
        justifyContent: "center", // Center the middle segment vertically
        position: "relative",
    },
    text: {
        position: "absolute",
        top: -20, // Adjust this value to position the text above the bar
        fontWeight: "bold", // Make the text bold
    },
    minText: {
        left: -10, // Align text to the left of the middle segment
    },
    maxText: {
        right: -10, // Align text to the right of the middle segment
    },
});

export default SleepBar;
