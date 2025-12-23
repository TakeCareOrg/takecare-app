import { useNavigation } from "@react-navigation/native";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

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
                />
                <OneValueBarChart
                    maxValue={10000}
                    value={stepsValue}
                    label={t("HOME_PAGE.STEPS")}
                    lineColor={"#18E85E"}
                    onPress={() => {
                        navigation.navigate("Steps");
                    }}
                />
            </View>
        </Box>
    );
}
