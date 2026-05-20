import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

import { Box } from "@app/components/ui/box";
import { DailyBarChart } from "@app/components/ui/chart/daily-bar-chart/index";
import { BarDataItem } from "@app/components/ui/chart/daily-bar-chart/progress-bars";
import { Chip } from "@app/components/ui/chip";
import { Text } from "@app/components/ui/text";
import { useColorTheme } from "@app/hooks/use-color-theme";
import { PageContainer } from "@app/layouts/page-container";
import { useHealthDataStore } from "@app/stores/health-data";
import { BasesHealthValue } from "@app/types/health-data-types";
import { safeFormatDate } from "@app/utils/date";

/**
 * Body composition detail screen — populated by both Health Connect
 * and Withings (see `merge.ts`). Layout, top to bottom:
 *
 *   1. Weight trend chart (DailyBarChart, one bar per day) — lets the
 *      user scrub through the history; selected bar drives the cards.
 *   2. Latest weight card with 7-day delta and a color cue
 *      (loss = green, gain = soft red).
 *   3. BMI card with WHO category badge (under / normal / over / obese)
 *      colored to match the medical convention.
 *   4. Body composition split (fat mass + muscle mass).
 *
 * Renders an empty state when no source has produced any body-comp
 * sample yet.
 */

/** WHO BMI categories. Same ranges WHO publishes for adults. */
function bmiCategory(bmi: number | null): {
    label: string;
    color: "blue" | "green" | "orange" | "red";
} | null {
    if (bmi === null || Number.isNaN(bmi)) return null;
    if (bmi < 18.5)
        return { label: "BODY_COMPOSITION.BMI_UNDER", color: "blue" };
    if (bmi < 25)
        return { label: "BODY_COMPOSITION.BMI_NORMAL", color: "green" };
    if (bmi < 30)
        return { label: "BODY_COMPOSITION.BMI_OVER", color: "orange" };
    return { label: "BODY_COMPOSITION.BMI_OBESE", color: "red" };
}

export const BodyCompositionScreen = () => {
    const { t } = useTranslation("full_trads");
    const colors = useColorTheme();

    const bodyComposition = useHealthDataStore(
        (state) =>
            state.todayCache?.data?.bodyComposition ??
            state.historicalCache?.data?.bodyComposition,
    );

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // Aggregate weight to daily buckets (take the most recent reading
    // per day — Withings/Samsung scales sometimes log multiple step-ons
    // when calibrating, and the user thinks of "today's weight" as
    // singular).
    const weightByDay = useMemo(() => {
        const map = new Map<number, { value: number; endDate: string }>();
        for (const item of bodyComposition?.weight ?? []) {
            if (!item.startDate || !item.value) continue;
            const ts = new Date(item.startDate).setHours(0, 0, 0, 0);
            const prev = map.get(ts);
            if (
                !prev ||
                new Date(item.endDate).getTime() >
                    new Date(prev.endDate).getTime()
            ) {
                map.set(ts, { value: item.value, endDate: item.endDate });
            }
        }
        return map;
    }, [bodyComposition]);

    const fatByDay = useMemo(
        () => indexByDay(bodyComposition?.fatMass),
        [bodyComposition],
    );
    const muscleByDay = useMemo(
        () => indexByDay(bodyComposition?.muscleMass),
        [bodyComposition],
    );
    const bmiByDay = useMemo(
        () => indexByDay(bodyComposition?.bmi),
        [bodyComposition],
    );

    // Stats for the currently-selected day
    const selectedTs = useMemo(
        () => new Date(selectedDate).setHours(0, 0, 0, 0),
        [selectedDate],
    );
    const selectedWeight = weightByDay.get(selectedTs) ?? null;
    const selectedFat = fatByDay.get(selectedTs) ?? null;
    const selectedMuscle = muscleByDay.get(selectedTs) ?? null;
    const selectedBmi = bmiByDay.get(selectedTs) ?? null;

    // 7-day delta vs the selected reading (or vs the oldest weight if
    // we don't have a sample 7 days back).
    const weekDelta = useMemo<number | null>(() => {
        if (!selectedWeight) return null;
        const target = selectedTs - 7 * 24 * 60 * 60 * 1000;
        // Pick the entry closest to but not after the target — we want
        // a reference point from before "today" to measure progress.
        let baseline: { ts: number; value: number } | null = null;
        for (const [ts, sample] of weightByDay) {
            if (ts > selectedTs) continue;
            if (
                !baseline ||
                Math.abs(ts - target) < Math.abs(baseline.ts - target)
            ) {
                baseline = { ts, value: sample.value };
            }
        }
        if (!baseline || baseline.ts === selectedTs) return null;
        return selectedWeight.value - baseline.value;
    }, [weightByDay, selectedWeight, selectedTs]);

    const chartData = useMemo<BarDataItem[]>(() => {
        return Array.from(weightByDay.entries())
            .map(([timestamp, entry]) => {
                const date = new Date(timestamp);
                return {
                    day: date.getDate().toString(),
                    value: entry.value,
                    startDate: safeFormatDate(date),
                };
            })
            .sort(
                (a, b) =>
                    new Date(a.startDate!).getTime() -
                    new Date(b.startDate!).getTime(),
            );
    }, [weightByDay]);

    // Reference lines on the chart : Healthy BMI range derived from
    // the user's most recent height. Without a height we just skip.
    const referenceLines = useMemo(() => {
        // The chart axis is weight in kg; we surface the [BMI 18.5, BMI 25]
        // band as visual guides. The conversion needs height (m), so we
        // back-compute from the latest BMI + weight pair.
        if (!selectedBmi || !selectedWeight || selectedBmi.value <= 0) {
            return [];
        }
        // height² = weight / bmi
        const heightSq = selectedWeight.value / selectedBmi.value;
        if (heightSq <= 0) return [];
        return [
            {
                value: 18.5 * heightSq,
                label: "18.5",
                lineColor: colors.blue[200],
                labelColor: colors.blue[200],
            },
            {
                value: 25 * heightSq,
                label: "25",
                lineColor: colors.orange[200],
                labelColor: colors.orange[200],
            },
        ];
    }, [selectedBmi, selectedWeight, colors.blue, colors.orange]);

    const dynamicColors = useMemo(
        () => ({
            belowFirstReference: colors.blue[300],
            aboveFirstReference: colors.green[500],
            aboveSecondReference: colors.orange[500],
        }),
        [colors.blue, colors.green, colors.orange],
    );

    const handleBarSelect = useCallback((selectedData: BarDataItem) => {
        if (!selectedData.startDate) return;
        const parts = selectedData.startDate
            .split("-")
            .map((p) => parseInt(p, 10));
        if (parts.length === 3 && parts.every((n) => !Number.isNaN(n))) {
            const [y, m, d] = parts;
            setSelectedDate(new Date(y, m - 1, d));
        }
    }, []);

    const hasData =
        chartData.length > 0 ||
        !!selectedFat ||
        !!selectedMuscle ||
        !!selectedBmi;

    const bmiTag = bmiCategory(selectedBmi?.value ?? null);

    const dailyChartKey =
        chartData.length > 0
            ? `${chartData.length}-${chartData[chartData.length - 1].startDate}`
            : "empty";

    if (!hasData) {
        return (
            <PageContainer
                variant="details"
                title={t("BODY_COMPOSITION.TITLE")}
                settings={[]}
            >
                <View style={styles.emptyState}>
                    <Text fontSize={14} weight="600">
                        {t("BODY_COMPOSITION.NO_DATA")}
                    </Text>
                    <Text
                        fontSize={12}
                        color={colors.secondary}
                        style={styles.emptySub}
                    >
                        {t("BODY_COMPOSITION.NO_DATA_MESSAGE")}
                    </Text>
                </View>
            </PageContainer>
        );
    }

    return (
        <PageContainer
            variant="details"
            title={t("BODY_COMPOSITION.TITLE")}
            settings={[]}
        >
            {chartData.length > 0 && (
                <DailyBarChart
                    key={dailyChartKey}
                    data={chartData}
                    onSelect={handleBarSelect}
                    referenceLines={referenceLines}
                    height={170}
                    dynamicColors={dynamicColors}
                    emptyDayColor={colors.isDark ? "#2A2A2A" : "#E0E0E0"}
                />
            )}

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Latest weight + delta */}
                <Box
                    title={t("BODY_COMPOSITION.WEIGHT")}
                    style={styles.fullBox}
                    headerContent={
                        weekDelta !== null ? (
                            <Chip
                                text={
                                    (weekDelta > 0 ? "+" : "") +
                                    weekDelta.toFixed(1) +
                                    " kg / 7j"
                                }
                                color={weekDelta < 0 ? "green" : "orange"}
                                numberOfLines={1}
                            />
                        ) : undefined
                    }
                >
                    <View style={styles.weightRow}>
                        <Text fontSize={48} weight="800">
                            {selectedWeight
                                ? selectedWeight.value.toFixed(1)
                                : "—"}
                        </Text>
                        <Text
                            fontSize={20}
                            weight="700"
                            style={styles.weightUnit}
                            color={colors.secondary}
                        >
                            kg
                        </Text>
                    </View>
                </Box>

                {/* BMI with WHO category */}
                <View style={styles.row}>
                    <Box
                        title={t("BODY_COMPOSITION.BMI")}
                        style={styles.statBox}
                        headerContent={
                            bmiTag ? (
                                <Chip
                                    text={t(bmiTag.label)}
                                    color={bmiTag.color}
                                    numberOfLines={1}
                                />
                            ) : undefined
                        }
                    >
                        <Text fontSize={32} weight="800">
                            {selectedBmi ? selectedBmi.value.toFixed(1) : "—"}
                        </Text>
                        <Text
                            fontSize={12}
                            weight="600"
                            color={colors.secondary}
                        >
                            kg/m²
                        </Text>
                    </Box>

                    {/* Fat ratio (or absolute fat mass if % isn't available) */}
                    <Box
                        title={t("BODY_COMPOSITION.FAT_MASS")}
                        style={styles.statBox}
                    >
                        <Text
                            fontSize={32}
                            weight="800"
                            color={colors.orange[500]}
                        >
                            {selectedFat ? selectedFat.value.toFixed(1) : "—"}
                        </Text>
                        <Text
                            fontSize={12}
                            weight="600"
                            color={colors.secondary}
                        >
                            kg
                        </Text>
                    </Box>
                </View>

                {/* Muscle mass */}
                <Box
                    title={t("BODY_COMPOSITION.MUSCLE_MASS")}
                    style={styles.fullBox}
                >
                    <View style={styles.muscleRow}>
                        <Text
                            fontSize={32}
                            weight="800"
                            color={colors.green[500]}
                        >
                            {selectedMuscle
                                ? selectedMuscle.value.toFixed(1)
                                : "—"}
                        </Text>
                        <Text
                            fontSize={14}
                            weight="700"
                            color={colors.secondary}
                            style={{ marginBottom: 4 }}
                        >
                            kg
                        </Text>
                        {selectedMuscle && selectedWeight ? (
                            <Text
                                fontSize={12}
                                weight="600"
                                color={colors.secondary}
                                style={styles.musclePct}
                            >
                                {Math.round(
                                    (selectedMuscle.value /
                                        selectedWeight.value) *
                                        100,
                                )}
                                % {t("BODY_COMPOSITION.OF_WEIGHT")}
                            </Text>
                        ) : null}
                    </View>
                </Box>

                {/* Quick explanation card */}
                <View
                    style={[
                        styles.explainer,
                        {
                            backgroundColor: colors.box,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <Text
                        fontSize={13}
                        weight="700"
                        style={styles.explainerTitle}
                    >
                        {t("BODY_COMPOSITION.EXPLAINER_TITLE")}
                    </Text>
                    <Text
                        fontSize={12}
                        color={colors.secondary}
                        style={styles.explainerBody}
                    >
                        {t("BODY_COMPOSITION.EXPLAINER_BODY")}
                    </Text>
                </View>
            </ScrollView>
        </PageContainer>
    );
};

function indexByDay(
    values?: BasesHealthValue[],
): Map<number, { value: number; endDate: string }> {
    const map = new Map<number, { value: number; endDate: string }>();
    if (!values) return map;
    for (const v of values) {
        if (!v.startDate) continue;
        const ts = new Date(v.startDate).setHours(0, 0, 0, 0);
        const prev = map.get(ts);
        if (
            !prev ||
            new Date(v.endDate).getTime() > new Date(prev.endDate).getTime()
        ) {
            map.set(ts, { value: v.value, endDate: v.endDate });
        }
    }
    return map;
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 40,
        gap: 14,
    },
    fullBox: {
        flex: 0,
    },
    row: {
        flexDirection: "row",
        gap: 12,
    },
    statBox: {
        flex: 1,
        aspectRatio: 1,
    },
    weightRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 6,
    },
    weightUnit: {
        marginBottom: 6,
    },
    muscleRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 6,
    },
    musclePct: {
        marginLeft: "auto",
        marginBottom: 4,
    },
    explainer: {
        padding: 14,
        borderRadius: 12,
        borderWidth: StyleSheet.hairlineWidth,
    },
    explainerTitle: {
        marginBottom: 4,
    },
    explainerBody: {
        lineHeight: 17,
    },
    emptyState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
    },
    emptySub: {
        marginTop: 8,
        textAlign: "center",
    },
});
