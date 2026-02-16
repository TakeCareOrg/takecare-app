import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { FlagIcon } from "@app/assets/icons/flag-icon";
import { Box } from "@app/components/ui/box";
import { DailyBarChart } from "@app/components/ui/chart/daily-bar-chart/index";
import { BarDataItem } from "@app/components/ui/chart/daily-bar-chart/progress-bars";
import { Chip } from "@app/components/ui/chip";
import { EmptyState } from "@app/components/ui/empty-state";
import { Text } from "@app/components/ui/text";
import { useColorTheme } from "@app/hooks/use-color-theme";
import { PageContainer } from "@app/layouts/page-container";
import { DetailedBarChart } from "@app/screens/steps/components/detailed-bar-chart";
import { useHealthDataStore } from "@app/stores/health-data";
import { BasesHealthValue } from "@app/types/health-data-types";
import { safeFormatDate } from "@app/utils/date";

export function StepsScreen() {
    const { t } = useTranslation("full_trads");
    const colors = useColorTheme();

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [, setSelectedBarInfo] = useState<{
        value: number;
        date?: string;
        day: string;
    } | null>(null);

    // Health data from store
    const healthData = useHealthDataStore(
        (state) => state.historicalCache?.data,
    );

    // Aggregate data once per healthData update
    const aggregatedData = useMemo(() => {
        if (!healthData) return null;

        const aggregate = (values?: BasesHealthValue[] | null) => {
            const map = new Map<number, number>();
            if (!values) return map;

            for (const item of values) {
                if (item.startDate && item.value) {
                    const timestamp = new Date(item.startDate).setHours(
                        0,
                        0,
                        0,
                        0,
                    );
                    map.set(timestamp, (map.get(timestamp) || 0) + item.value);
                }
            }
            return map;
        };

        return {
            steps: aggregate(healthData.steps),
            flights: aggregate(healthData.flights),
            distance: aggregate(healthData.distance),
            energy: aggregate(healthData.activeEnergyBurned),
            minutes: aggregate(healthData.activeMinutes),
        };
    }, [healthData]);

    // Selected day data
    const selectedDayData = useMemo(() => {
        if (!aggregatedData) return null;

        const timestamp = selectedDate.setHours(0, 0, 0, 0);

        return {
            steps: aggregatedData.steps.get(timestamp) || 0,
            flights: aggregatedData.flights.get(timestamp) || 0,
            distance: aggregatedData.distance.get(timestamp) || 0,
            activeEnergyBurned: aggregatedData.energy.get(timestamp) || 0,
            activeMinutes: aggregatedData.minutes.get(timestamp) || 0,
            date: safeFormatDate(selectedDate),
        };
    }, [aggregatedData, selectedDate]);

    // Active time data
    const activeTimeData = useMemo(() => {
        if (!selectedDayData) return { activeMinutes: 0, targetMinutes: 90 };
        return {
            activeMinutes: Math.min(selectedDayData.activeMinutes, 300),
            targetMinutes: 90,
        };
    }, [selectedDayData]);

    // Chip color & text
    const stepsGoalColor = useMemo(() => {
        if (!selectedDayData) return "black";
        if (selectedDayData.steps >= 10000) return "green";
        if (selectedDayData.steps >= 5000) return "orange";
        return "red";
    }, [selectedDayData]);

    const stepsGoalText = useMemo(() => {
        if (!selectedDayData) return t("STEPS.NO_DATA");
        if (selectedDayData.steps >= 10000) return t("STEPS.EXCELLENT");
        if (selectedDayData.steps >= 5000) return t("STEPS.VERY_GOOD");
        return t("STEPS.KEEP_GOING");
    }, [selectedDayData, t]);

    // Chart data memoized
    const chartData = useMemo<BarDataItem[]>(() => {
        if (!aggregatedData?.steps) return [];

        return Array.from(aggregatedData.steps.entries())
            .map(([timestamp, value]) => {
                const day = safeFormatDate(new Date(timestamp));
                return { day, value, startDate: day };
            })
            .sort(
                (a, b) =>
                    new Date(a.startDate!).getTime() -
                    new Date(b.startDate!).getTime(),
            );
    }, [aggregatedData?.steps]);

    const handleBarSelect = (selectedData: BarDataItem) => {
        setSelectedBarInfo({
            value: selectedData.value,
            date: selectedData.startDate,
            day: selectedData.day,
        });
        if (selectedData.startDate) {
            setSelectedDate(new Date(selectedData.startDate));
        }
    };

    // Memoized colors and reference lines
    const referenceLines = useMemo(
        () => [
            {
                value: 5000,
                label: "5k",
                lineColor: colors.green[200],
                labelColor: colors.green[200],
            },
            {
                value: 10000,
                label: "10k",
                lineColor: colors.green[500],
                labelColor: colors.green[500],
            },
        ],
        [colors.green],
    );

    const dynamicColors = useMemo(
        () => ({
            belowFirstReference: colors.isDark
                ? colors.raw.black[200]
                : colors.raw.black[50],
            aboveFirstReference: colors.green[500],
        }),
        [colors.green, colors.raw.black, colors.isDark],
    );

    return (
        <PageContainer variant="details" title={t("STEPS.TITLE")} settings={[]}>
            <DailyBarChart
                data={chartData}
                onSelect={handleBarSelect}
                referenceLines={referenceLines}
                height={150}
                dynamicColors={dynamicColors}
                emptyDayColor={colors.isDark ? "#2A2A2A" : "#E0E0E0"}
            />

            <View style={{ flexDirection: "row", marginBottom: 20 }}>
                {/* Steps Goal Box */}
                <View style={{ flex: 1, aspectRatio: 1 }}>
                    <Box
                        title={t("STEPS.GOAL")}
                        style={{ flex: 1 }}
                        headerContent={
                            selectedDayData && (
                                <Chip
                                    text={stepsGoalText}
                                    color={stepsGoalColor}
                                    numberOfLines={1}
                                />
                            )
                        }
                    >
                        {selectedDayData ? (
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "space-between",
                                }}
                            >
                                <View>
                                    <Text fontSize={42} weight="800">
                                        {selectedDayData.steps.toLocaleString()}
                                    </Text>
                                    <Text fontSize={14} weight="700">
                                        {t("STEPS.STEPS")}
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Text
                                        fontSize={10}
                                        weight="700"
                                        color={colors.green[500]}
                                    >
                                        {(
                                            selectedDayData.distance / 1000
                                        ).toFixed(1)}{" "}
                                        {t("STEPS.KM")}
                                    </Text>
                                    <Text
                                        fontSize={10}
                                        weight="700"
                                        color={colors.green[500]}
                                    >
                                        {Math.round(
                                            selectedDayData.activeEnergyBurned,
                                        )}{" "}
                                        {t("STEPS.CAL")}
                                    </Text>
                                    <Text
                                        fontSize={10}
                                        weight="700"
                                        color={colors.green[500]}
                                    >
                                        {selectedDayData.flights}{" "}
                                        {t("STEPS.FLOORS")}
                                    </Text>
                                </View>
                            </View>
                        ) : (
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <EmptyState
                                    inline
                                    icon={
                                        <FlagIcon
                                            width={40}
                                            height={40}
                                            color={colors.green[500]}
                                        />
                                    }
                                    title={t("STEPS.NO_STEPS_DATA")}
                                    message={t("STEPS.WALK_MORE_MESSAGE")}
                                />
                            </View>
                        )}
                    </Box>
                </View>

                {/* Active Time Box */}
                <View style={{ flex: 1, aspectRatio: 1 }}>
                    <View
                        style={{
                            flex: 1,
                            borderWidth: 4,
                            borderColor: colors.green[500],
                            borderRadius: 15,
                            overflow: "hidden",
                        }}
                    >
                        <Box title={t("STEPS.ACTIVE_TIME")} style={{ flex: 1 }}>
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Text fontSize={42} weight="800">
                                    {activeTimeData.activeMinutes}
                                </Text>
                                <Text
                                    fontSize={16}
                                    weight="800"
                                    color={colors.text}
                                >
                                    {t("STEPS.MINS")}
                                </Text>
                                <Text
                                    fontSize={16}
                                    weight="700"
                                    color={colors.secondary}
                                >
                                    /{activeTimeData.targetMinutes}{" "}
                                    {t("STEPS.MINS")}
                                </Text>
                            </View>
                        </Box>
                    </View>
                </View>
            </View>

            <DetailedBarChart
                onDateChange={setSelectedDate}
                initialDate={selectedDate}
            />
        </PageContainer>
    );
}
