import { useTranslation } from "react-i18next";

import { TargetProgressBar } from "@app/components/ui/target-progress-bar";
import { useColorTheme } from "@app/hooks/use-color-theme";
import { ProgressColors } from "@app/types/global";

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
    onPress?: () => void;
}

export function SleepBar({ sleepedTime, sleepTarget, onPress }: SleepBarProps) {
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
        under: colors.blue[100],
        target: colors.blue[500],
        over: colors.blue[700],
        background: colors.isDark ? colors.black[100] : colors.border,
    };

    return (
        <TargetProgressBar
            currentValue={sleepedMinutes}
            targetRange={{ min: minSleepMinutes, max: maxSleepMinutes }}
            title={t("HOME_PAGE.SLEEP")}
            valueText={valueText}
            colors={progressColors}
            formatLabel={formatSleepTime}
            onPress={onPress}
        />
    );
}
