import { useMemo, useState } from "react";
import { View } from "react-native";

import { MoonIcon } from "@app/assets/icons/MoonIcon";
import { Box } from "@app/components/ui/box";
import { DailyBarChart } from "@app/components/ui/chart/daily-bar-chart";
import { DailyBarDataItem } from "@app/components/ui/chart/shared";
import { Text } from "@app/components/ui/text";
import { useColorTheme } from "@app/hooks/use-color-theme";
import { PageContainer } from "@app/layouts/page-container";
import { useHealthDataStore } from "@app/stores/health-data";
import { SleepAnalysis } from "@app/types/health-data-types";

import { SleepRate } from "./components/sleep-rate";
//import { SleepScores } from "./components/sleep-scores";
import { SleepStagesChart } from "./components/sleep-stages-chart";

export function SleepScreen() {
    const colors = useColorTheme();

    // Use historical cached health data from store
    const healthData = useHealthDataStore(
        (state) => state.historicalCache?.data,
    );
    const sleepAnalysis = healthData?.sleepAnalysis || {
        totalSleepValue: null,
        sleepSteps: [],
    };

    const [selectedSleep, setSelectedSleep] = useState<SleepAnalysis | null>(
        null,
    );
    // Transform sleep data to DailyBarChart format
    const chartData = useMemo<DailyBarDataItem[]>(() => {
        if (
            !sleepAnalysis.sleepSteps ||
            sleepAnalysis.sleepSteps.length === 0
        ) {
            return [];
        }

        return sleepAnalysis.sleepSteps.map((sleep) => {
            // Use endDate as the "day" since that's when you woke up
            const dayDate = new Date(sleep.endDate);
            const dayNumber = String(dayDate.getDate()).padStart(2, "0");

            // Convert duration from seconds to hours for display
            const durationInHours = sleep.duration ? sleep.duration / 3600 : 0;

            return {
                day: dayNumber,
                value: durationInHours,
                startDate: sleep.startDate,
                color: "#6B8CFF", // Blue color for sleep
            };
        });
    }, [sleepAnalysis.sleepSteps]);

    const handleSelectDay = (selectedData: DailyBarDataItem) => {
        // Find the corresponding sleep data by matching the startDate
        const sleep = sleepAnalysis.sleepSteps?.find(
            (s) => s.startDate === selectedData.startDate,
        );

        setSelectedSleep(sleep || null);
    };

    const referenceLines = useMemo(
        () => [
            {
                value: 7,
                label: "7h",
                lineColor: colors.blue[400],
                labelColor: colors.blue[400],
            },
            {
                value: 9,
                label: "9h",
                lineColor: colors.blue[500],
                labelColor: colors.blue[500],
            },
        ],
        [colors.blue],
    );

    const dynamicColors = useMemo(
        () => ({
            belowFirstReference: colors.blue[100],
            aboveFirstReference: colors.blue[400],
            aboveSecondReference: colors.blue[500],
        }),
        [colors.blue],
    );

    return (
        <PageContainer variant="details" title="Sleep">
            <DailyBarChart
                data={chartData}
                onSelect={handleSelectDay}
                referenceLines={referenceLines}
                dynamicColors={dynamicColors}
            />

            {selectedSleep ? (
                <>
                    <SleepRate />
                    <SleepStagesChart sleepData={selectedSleep} />
                    {/* Will be implemented in the future, because we don't have all the data on android */}
                    {/* <SleepScores /> */}
                </>
            ) : (
                <Box
                    style={{
                        marginTop: 20,
                    }}
                >
                    <View
                        style={{
                            padding: 40,
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 16,
                        }}
                    >
                        <Text
                            fontSize={48}
                            style={{
                                opacity: 0.5,
                            }}
                        >
                            <MoonIcon
                                width={48}
                                height={48}
                                color={colors.blue[200]}
                            />
                        </Text>
                        <Text
                            fontSize={18}
                            weight="600"
                            style={{ textAlign: "center" }}
                        >
                            No sleep data available
                        </Text>
                        <Text
                            fontSize={14}
                            color={colors.secondary}
                            style={{
                                textAlign: "center",
                                lineHeight: 20,
                                maxWidth: 280,
                            }}
                        >
                            Make sure to wear your watch while sleeping to track
                            your sleep data.
                        </Text>
                    </View>
                </Box>
            )}
        </PageContainer>
    );
}
