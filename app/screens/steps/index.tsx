import { format } from "date-fns";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Box } from "@app/components/ui/box";
import { DailyBarChart } from "@app/components/ui/chart/daily-bar-chart/index";
import { BarDataItem } from "@app/components/ui/chart/daily-bar-chart/progress-bars";
import { Chip } from "@app/components/ui/chip";
import { Text } from "@app/components/ui/text";
import { useHealthData } from "@app/hooks/health/use-health-data";
import { useColorTheme } from "@app/hooks/use-color-theme";
import { PageContainer } from "@app/layouts/page-container";
import { DetailedBarChart } from "@app/screens/steps/components/detailed-bar-chart";
import { WorkoutSection } from "@app/screens/steps/components/workout-section";
import { BasesHealthValue } from "@app/types/health-data-types";
import { safeFormatDate } from "@app/utils/date";

export function StepsScreen() {
    const { t } = useTranslation("full_trads");
    const colors = useColorTheme();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedBarInfo, setSelectedBarInfo] = useState<{
        value: number;
        date?: string;
        day: string;
    } | null>(null);

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // Memoize dates to prevent infinite loop
    const dateRange = useMemo(
        () => ({
            startDate: new Date(1995, 0, 1),
            endDate: new Date(),
        }),
        [],
    );

    // Get all available health data
    const { steps, flights, distance, activeEnergyBurned, workouts } =
        useHealthData(dateRange);

    // Calculate selected day's data (instead of just today)
    const selectedDayData = useMemo(() => {
        if (!steps || steps.length === 0) return null;

        const selectedDateStr = safeFormatDate(selectedDate);

        // Sum all step entries for the selected day
        const totalSteps = steps
            .filter(
                (step: BasesHealthValue) =>
                    step.startDate &&
                    safeFormatDate(new Date(step.startDate)) ===
                        selectedDateStr,
            )
            .reduce(
                (sum: number, step: BasesHealthValue) =>
                    sum + (step.value || 0),
                0,
            );

        // Sum all flights for the selected day
        const totalFlights =
            flights
                ?.filter(
                    (flight: BasesHealthValue) =>
                        flight.startDate &&
                        safeFormatDate(new Date(flight.startDate)) ===
                            selectedDateStr,
                )
                .reduce(
                    (sum: number, flight: BasesHealthValue) =>
                        sum + (flight.value || 0),
                    0,
                ) || 0;

        // Sum all distance for the selected day
        const totalDistance =
            distance
                ?.filter(
                    (dist: BasesHealthValue) =>
                        dist.startDate &&
                        safeFormatDate(new Date(dist.startDate)) ===
                            selectedDateStr,
                )
                .reduce(
                    (sum: number, dist: BasesHealthValue) =>
                        sum + (dist.value || 0),
                    0,
                ) || 0;

        // Sum all active energy for the selected day
        const totalActiveEnergy =
            activeEnergyBurned
                ?.filter(
                    (energy: BasesHealthValue) =>
                        energy.startDate &&
                        safeFormatDate(new Date(energy.startDate)) ===
                            selectedDateStr,
                )
                .reduce(
                    (sum: number, energy: BasesHealthValue) =>
                        sum + (energy.value || 0),
                    0,
                ) || 0;

        const result = {
            steps: totalSteps,
            flights: totalFlights,
            distance: totalDistance, // in meters
            activeEnergyBurned: totalActiveEnergy, // in calories
            date: selectedDateStr,
        };

        return result;
    }, [steps, flights, distance, activeEnergyBurned, selectedDate]);

    // Calculate metrics for Active time box based on real active energy burned data
    const activeTimeData = useMemo(() => {
        // Convert active energy burned to approximate active minutes
        // Rough estimation: 5-10 calories per minute of active time
        const activeEnergyCalories = selectedDayData?.activeEnergyBurned || 0;
        const activeMinutes = Math.floor(activeEnergyCalories / 7); // ~7 calories per minute average
        const targetMinutes = 90;

        return {
            activeMinutes: Math.min(activeMinutes, 300), // Cap at 5 hours max
            targetMinutes,
        };
    }, [selectedDayData]);

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

    const chartData = useMemo(() => {
        if (!steps || steps.length === 0) {
            return [];
        }

        // Filter valid data and sort by date (from past to present)
        const validSteps = steps
            .filter(
                (step: BasesHealthValue) =>
                    step.startDate && step.value !== undefined,
            )
            .sort(
                (a: BasesHealthValue, b: BasesHealthValue) =>
                    new Date(a.startDate).getTime() -
                    new Date(b.startDate).getTime(),
            );

        // Group by day and sum values
        const dailyStepsMap = new Map<string, number>();

        validSteps.forEach((step: BasesHealthValue) => {
            const dayKey = safeFormatDate(new Date(step.startDate));
            const currentTotal = dailyStepsMap.get(dayKey) || 0;
            dailyStepsMap.set(dayKey, currentTotal + step.value);
        });

        // Convert map to array format for chart
        const aggregatedData = Array.from(dailyStepsMap.entries())
            .map(([dateStr, totalSteps]) => ({
                id: `step-${dateStr}`,
                day: format(new Date(dateStr), "dd"),
                value: totalSteps,
                startDate: new Date(dateStr).toISOString(),
            }))
            .sort(
                (a, b) =>
                    new Date(a.startDate).getTime() -
                    new Date(b.startDate).getTime(),
            );

        return aggregatedData;
    }, [steps]);

    const handleBarSelect = (selectedData: BarDataItem) => {
        setSelectedBarInfo({
            value: selectedData.value,
            date: selectedData.startDate,
            day: selectedData.day,
        });

        // Update selected date to fetch data for the selected day
        if (selectedData.startDate) {
            setSelectedDate(new Date(selectedData.startDate));
        }
    };

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
            belowFirstReference: colors.raw.black[200],
            aboveFirstReference: colors.green[500],
        }),
        [colors.green, colors.raw.black],
    );

    // Compute a key for DailyBarChart to force remount on data changes
    const dailyBarChartKey =
        chartData.length > 0
            ? `${chartData.length}-${chartData[chartData.length - 1].startDate}`
            : "empty";

    return (
        <PageContainer variant="details" title={t("STEPS.TITLE")} settings={[]}>
            <DailyBarChart
                key={dailyBarChartKey}
                data={chartData}
                onSelect={handleBarSelect}
                disableSnapping={false}
                referenceLines={referenceLines}
                height={150}
                fillMissingDays={true}
                dynamicColors={dynamicColors}
            />

            {/* Deux Box en haut */}
            <View
                style={{
                    flexDirection: "row",
                    gap: 12,
                    marginBottom: 20,
                }}
            >
                {/* Goal Box - Steps */}
                <View
                    style={{
                        flex: 1,
                        aspectRatio: 1,
                    }}
                >
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
                            <View style={{ flex: 1 }}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "flex-end",
                                        marginBottom: 8,
                                        flexWrap: "wrap", // Allow wrapping if needed
                                    }}
                                >
                                    <Text
                                        fontSize={42}
                                        numberOfLines={1}
                                        adjustsFontSizeToFit={true}
                                        style={{ flex: 1, minWidth: 0 }}
                                        weight="800"
                                    >
                                        {selectedDayData.steps.toLocaleString()}
                                    </Text>
                                    <Text
                                        fontSize={14}
                                        style={{
                                            marginLeft: 4,
                                            marginBottom: 6,
                                        }}
                                        weight="700"
                                    >
                                        {t("STEPS.STEPS")}
                                    </Text>
                                </View>

                                <Text
                                    fontSize={16}
                                    style={{
                                        opacity: 0.7,
                                        marginBottom: 12,
                                        alignSelf: "flex-end",
                                        marginRight: 24,
                                        letterSpacing: 0.3,
                                    }}
                                    weight="800"
                                    color={colors.secondary}
                                >
                                    /6000
                                </Text>

                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: 4,
                                    }}
                                >
                                    <Text
                                        fontSize={10}
                                        style={{
                                            color: colors.green[500],
                                            flex: 1,
                                            textAlign: "center",
                                        }}
                                        numberOfLines={1}
                                        adjustsFontSizeToFit={true}
                                        weight="700"
                                    >
                                        {(
                                            selectedDayData.distance / 1000
                                        ).toFixed(1)}{" "}
                                        {t("STEPS.KM")}
                                    </Text>
                                    <Text
                                        fontSize={10}
                                        style={{
                                            color: colors.green[500],
                                            flex: 1,
                                            textAlign: "center",
                                        }}
                                        numberOfLines={1}
                                        adjustsFontSizeToFit={true}
                                        weight="700"
                                    >
                                        {Math.round(
                                            selectedDayData.activeEnergyBurned,
                                        )}{" "}
                                        {t("STEPS.CAL")}
                                    </Text>
                                    <Text
                                        fontSize={10}
                                        style={{
                                            color: colors.green[500],
                                            flex: 1,
                                            textAlign: "center",
                                        }}
                                        numberOfLines={1}
                                        adjustsFontSizeToFit={true}
                                        weight="700"
                                    >
                                        {selectedDayData.flights}{" "}
                                        {t("STEPS.FLOORS")}
                                    </Text>
                                </View>
                            </View>
                        ) : (
                            <Text>{t("STEPS.NO_DATA_AVAILABLE")}</Text>
                        )}
                    </Box>
                </View>

                {/* Active Time Box */}
                <View
                    style={{
                        flex: 1,
                        aspectRatio: 1,
                    }}
                >
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
                            <View style={{ flex: 1, alignItems: "center" }}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "flex-end",
                                        marginBottom: 8,
                                        flexWrap: "wrap", // Allow wrapping if needed
                                    }}
                                >
                                    <Text
                                        fontSize={42}
                                        numberOfLines={1}
                                        adjustsFontSizeToFit={true}
                                        weight="800"
                                    >
                                        {activeTimeData.activeMinutes}
                                    </Text>
                                    <Text
                                        fontSize={16}
                                        style={{ marginBottom: 6 }}
                                        weight="800"
                                        color={colors.text}
                                    >
                                        {t("STEPS.MINS")}
                                    </Text>
                                </View>

                                <Text
                                    fontSize={16}
                                    style={{
                                        opacity: 0.7,
                                        alignSelf: "flex-end",
                                        marginRight: 24,
                                    }}
                                    weight="700"
                                    numberOfLines={1}
                                    color={colors.secondary}
                                    adjustsFontSizeToFit={true}
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

            <WorkoutSection workouts={workouts} />
        </PageContainer>
    );
}
