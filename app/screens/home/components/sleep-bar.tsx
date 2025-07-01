import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { TargetProgressBar } from "@app/components/ui/target-progress-bar";
import { useColorTheme } from "@app/hooks/use-color-theme";
import { ProgressColors } from "@app/types/global";
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

export function SleepBar({ sleepedTime, sleepTarget }: SleepBarProps) {
    const { t } = useTranslation();
    const colors = useColorTheme();

    const sleepedMinutes = sleepedTime.hours * 60 + sleepedTime.minutes;
    const minSleepMinutes =
        sleepTarget.min.hours * 60 + sleepTarget.min.minutes;
    const maxSleepMinutes =
        sleepTarget.max.hours * 60 + sleepTarget.max.minutes;

    const formatSleepTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        return `${hours}h`;
    };

    const valueText = `${sleepedTime.hours}h${sleepedTime.minutes !== 0 ? `${sleepedTime.minutes}min` : ""}`;

    const progressColors: ProgressColors = {
        under: colors.raw.sleep.less,
        target: colors.raw.sleep.good,
        over: colors.raw.sleep.more,
        background: colors.inputBackground,
        text: colors.primary,
    };

    return (
        <TargetProgressBar
            currentValue={sleepedMinutes}
            targetRange={{ min: minSleepMinutes, max: maxSleepMinutes }}
            title={t("HOME_PAGE.SLEEP")}
            valueText={valueText}
            colors={progressColors}
            formatLabel={formatSleepTime}
        />
    );
}

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
