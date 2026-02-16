import { useNavigation } from "@react-navigation/native";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { useColorTheme } from "@app/hooks/use-color-theme";
import { Box } from "@components/ui/box";
import { SleepAnalysis } from "@dtypes/health-data-types";

import { OneValueBarChart } from "./one-value-bar-charts";
import { SleepBar } from "./sleep-bar";

export function AboutYou({
    sleepValue,
    steps,
}: {
    sleepValue: SleepAnalysis | null;
    steps: number | null;
}) {
    const { t } = useTranslation("full_trads");
    const navigation = useNavigation();
    const colors = useColorTheme();

    const sleepTarget = {
        min: { hours: 7, minutes: 0 },
        max: { hours: 10, minutes: 0 },
    };

    const todaySleepTime = useMemo(() => {
        if (!sleepValue?.duration) {
            return { hours: 0, minutes: 0 };
        }
        const hours = Math.floor(sleepValue?.duration / 3600) || 0;
        const minutes = Math.floor((sleepValue?.duration % 3600) / 60) || 0;

        return { hours, minutes };
    }, [sleepValue]);

    const stepsValue = useMemo(() => {
        if (!steps) {
            return 0;
        }
        return steps;
    }, [steps]);

    return (
        <Box title={t("HOME_PAGE.ABOUT_YOU")}>
            <View style={{ rowGap: 12 }}>
                <SleepBar
                    sleepedTime={todaySleepTime}
                    sleepTarget={sleepTarget}
                    onPress={() => {
                        navigation.navigate("Sleep");
                    }}
                />
                <OneValueBarChart
                    maxValue={6000}
                    value={stepsValue}
                    label={t("HOME_PAGE.STEPS")}
                    lineColor={
                        colors.isDark ? colors.green[650] : colors.green[600]
                    }
                    onPress={() => {
                        navigation.navigate("Steps");
                    }}
                />
            </View>
        </Box>
    );
}
