import { format } from "date-fns";
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
// import { WorkoutSection } from "@app/screens/steps/components/workout-section";
import { useHealthDataStore } from "@app/stores/health-data";
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

    // Use historical cached health data from store
    const healthData = useHealthDataStore(
        (state) => state.historicalCache?.data,
    );
    const steps = healthData?.steps || null;
    const flights = healthData?.flights || null;
    const distance = healthData?.distance || null;
    const activeEnergyBurned = healthData?.activeEnergyBurned || null;
    const activeMinutes = healthData?.activeMinutes || null;
    //const workouts = healthData?.workouts || null;

    /** Aggregate all health metrics for the currently selected day. */
    const selectedDayData = useMemo(() => {
        if (!steps || steps.length === 0) return null;

        const selectedDateStr = safeFormatDate(selectedDate);

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

        const totalActiveMinutes =
            activeMinutes
                ?.filter(
                    (session: BasesHealthValue) =>
                        session.startDate &&
                        safeFormatDate(new Date(session.startDate)) ===
                            selectedDateStr,
                )
                .reduce(
                    (sum: number, session: BasesHealthValue) =>
                        sum + (session.value || 0),
                    0,
                ) || 0;

        return {
            steps: totalSteps,
            flights: totalFlights,
            distance: totalDistance,
            activeEnergyBurned: totalActiveEnergy,
            activeMinutes: totalActiveMinutes,
            date: selectedDateStr,
        };
    }, [
        steps,
        flights,
        distance,
        activeEnergyBurned,
        activeMinutes,
        selectedDate,
    ]);

    /** Get active minutes for the selected day. */
    const activeTimeData = useMemo(() => {
        const activeMinutesValue = selectedDayData?.activeMinutes || 0;
        const targetMinutes = 90;

        return {
            activeMinutes: Math.min(activeMinutesValue, 300),
            targetMinutes,
        };
    }, [selectedDayData]);

    /** Chip color based on step count thresholds. */
    const stepsGoalColor = useMemo(() => {
        if (!selectedDayData) return "black";
        if (selectedDayData.steps >= 10000) return "green";
        if (selectedDayData.steps >= 5000) return "orange";
        return "red";
    }, [selectedDayData]);

    /** Chip label based on step count thresholds. */
    const stepsGoalText = useMemo(() => {
        if (!selectedDayData) return t("STEPS.NO_DATA");
        if (selectedDayData.steps >= 10000) return t("STEPS.EXCELLENT");
        if (selectedDayData.steps >= 5000) return t("STEPS.VERY_GOOD");
        return t("STEPS.KEEP_GOING");
    }, [selectedDayData, t]);

    /** Group raw step entries by day and sort chronologically for the daily bar chart. */
    const chartData = useMemo(() => {
        if (!steps || steps.length === 0) {
            return [];
        }

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

        // Sum multiple entries per day into a single value
        const dailyStepsMap = new Map<string, number>();

        validSteps.forEach((step: BasesHealthValue) => {
            const dayKey = safeFormatDate(new Date(step.startDate));
            const currentTotal = dailyStepsMap.get(dayKey) || 0;
            dailyStepsMap.set(dayKey, currentTotal + step.value);
        });

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

        if (selectedData.startDate) {
            setSelectedDate(new Date(selectedData.startDate));
        }
    };

    /** Horizontal reference lines at 5k and 10k steps. */
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

    /** Bar colors: grey below 5k threshold, green above. */
    const dynamicColors = useMemo(
        () => ({
            belowFirstReference: colors.isDark
                ? colors.raw.black[200]
                : colors.raw.black[50],
            aboveFirstReference: colors.green[500],
        }),
        [colors.green, colors.raw.black, colors.isDark],
    );

    // Force remount of DailyBarChart when data changes
    const dailyBarChartKey =
        chartData.length > 0
            ? `${chartData.length}-${chartData[chartData.length - 1].startDate}`
            : "empty";

    return (
        <PageContainer variant="details" title={t("STEPS.TITLE")} settings={[]}>
            {/* Weekly overview bar chart with scroll */}
            <DailyBarChart
                key={dailyBarChartKey}
                data={chartData}
                onSelect={handleBarSelect}
                disableSnapping={false}
                referenceLines={referenceLines}
                height={150}
                fillMissingDays={true}
                dynamicColors={dynamicColors}
                emptyDayColor={colors.isDark ? "#2A2A2A" : "#E0E0E0"}
            />

            {/* Steps goal + Active time side-by-side */}
            <View
                style={{
                    flexDirection: "row",
                    gap: 12,
                    marginBottom: 20,
                }}
            >
                {/* Goal Box — shows step count, distance, calories, floors */}
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
                                        flexWrap: "wrap",
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

                                {/* Distance, calories, floors quick stats */}
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
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    paddingHorizontal: 16,
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

                {/* Active Time Box — estimated from calories burned */}
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
                                        flexWrap: "wrap",
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

            {/* Detailed interval chart with toggle (24h / 7d / 31d / 12m) */}
            <DetailedBarChart
                onDateChange={setSelectedDate}
                initialDate={selectedDate}
            />

            {/* Recent workouts list */}
            {/* <WorkoutSection workouts={workouts} /> */}
        </PageContainer>
    );
}
