import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

import { Box } from "@app/components/ui/box";
import { Chip } from "@app/components/ui/chip";
import { Text } from "@app/components/ui/text";
import { useColorTheme } from "@app/hooks/use-color-theme";
import { PageContainer } from "@app/layouts/page-container";
import { useHealthDataStore } from "@app/stores/health-data";

/**
 * Cardio-vascular vitals (SpO2, HRV, BP) — populated by either Health
 * Connect (Galaxy Watch / Pixel Watch / BP cuff) or Withings (BPM Core,
 * ScanWatch). Layout, top to bottom:
 *
 *   1. Header explainer card — colour-coded summary of what each metric
 *      means, framed in clinical terms (without being alarming).
 *   2. Blood Pressure card with the WHO/ESC category badge (optimal /
 *      normal / high-normal / hypertension stages).
 *   3. SpO2 + HRV side-by-side cards, each with a status chip.
 *
 * Empty state shown when no source has produced any vitals yet.
 */

type ChipColor = "blue" | "green" | "orange" | "red";

/**
 * European Society of Cardiology / WHO blood-pressure categories.
 * Uses the *worst* of (systolic, diastolic) to pick the badge — the
 * standard convention for adult BP classification.
 */
function bpCategory(
    systolic: number | null,
    diastolic: number | null,
): { label: string; color: ChipColor } | null {
    if (systolic === null || diastolic === null) return null;
    const sys = systolic;
    const dia = diastolic;
    if (sys < 120 && dia < 80)
        return { label: "VITALS.BP_OPTIMAL", color: "green" };
    if (sys < 130 && dia < 85)
        return { label: "VITALS.BP_NORMAL", color: "green" };
    if (sys < 140 && dia < 90)
        return { label: "VITALS.BP_HIGH_NORMAL", color: "orange" };
    if (sys < 160 && dia < 100)
        return { label: "VITALS.BP_HYPERTENSION_1", color: "orange" };
    return { label: "VITALS.BP_HYPERTENSION_2", color: "red" };
}

/**
 * Resting SpO2 category. <90 is clinically meaningful (hypoxemia),
 * 90-94 is mildly low (could be sensor noise or altitude), ≥95 is
 * considered normal. We don't surface anything below 80 as a special
 * tier because at that point the user needs a doctor, not a chip.
 */
function spo2Category(value: number | null): {
    label: string;
    color: ChipColor;
} | null {
    if (value === null) return null;
    if (value >= 95) return { label: "VITALS.SPO2_NORMAL", color: "green" };
    if (value >= 90) return { label: "VITALS.SPO2_LOW", color: "orange" };
    return { label: "VITALS.SPO2_CRITICAL", color: "red" };
}

/**
 * HRV (RMSSD ms) interpretation — adult ranges are wide and
 * age-dependent. Common literature buckets:
 *   ≥ 60 ms = good autonomic balance
 *   30–59 ms = average
 *   < 30 ms = low (possible stress / fatigue marker)
 */
function hrvCategory(value: number | null): {
    label: string;
    color: ChipColor;
} | null {
    if (value === null) return null;
    if (value >= 60) return { label: "VITALS.HRV_GOOD", color: "green" };
    if (value >= 30) return { label: "VITALS.HRV_AVERAGE", color: "orange" };
    return { label: "VITALS.HRV_LOW", color: "red" };
}

export const VitalsScreen = () => {
    const { t } = useTranslation("full_trads");
    const colors = useColorTheme();

    const vitals = useHealthDataStore(
        (state) =>
            state.todayCache?.data?.vitals ??
            state.historicalCache?.data?.vitals,
    );

    const latest = useMemo(() => {
        const lastOf = (arr?: { value: number; endDate: string }[]) =>
            arr && arr.length > 0 ? arr[arr.length - 1] : null;
        return {
            spo2: lastOf(vitals?.spo2),
            hrv: lastOf(vitals?.hrv),
            systolic: lastOf(vitals?.bloodPressure?.systolic),
            diastolic: lastOf(vitals?.bloodPressure?.diastolic),
        };
    }, [vitals]);

    const bpTag = bpCategory(
        latest.systolic?.value ?? null,
        latest.diastolic?.value ?? null,
    );
    const spo2Tag = spo2Category(latest.spo2?.value ?? null);
    const hrvTag = hrvCategory(latest.hrv?.value ?? null);

    const hasData =
        !!latest.spo2 ||
        !!latest.hrv ||
        !!latest.systolic ||
        !!latest.diastolic;

    if (!hasData) {
        return (
            <PageContainer
                variant="details"
                title={t("VITALS.TITLE")}
                settings={[]}
            >
                <View style={styles.emptyState}>
                    <Text fontSize={14} weight="600">
                        {t("VITALS.NO_DATA")}
                    </Text>
                    <Text
                        fontSize={12}
                        color={colors.secondary}
                        style={styles.emptySub}
                    >
                        {t("VITALS.NO_DATA_MESSAGE")}
                    </Text>
                </View>
            </PageContainer>
        );
    }

    return (
        <PageContainer
            variant="details"
            title={t("VITALS.TITLE")}
            settings={[]}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Top explainer — colour cues match the chips below */}
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
                        fontSize={14}
                        weight="700"
                        style={styles.explainerTitle}
                    >
                        {t("VITALS.EXPLAINER_TITLE")}
                    </Text>
                    <Text
                        fontSize={12}
                        color={colors.secondary}
                        style={styles.explainerBody}
                    >
                        {t("VITALS.EXPLAINER_BODY")}
                    </Text>
                    <View style={styles.legendRow}>
                        <LegendDot color={colors.green[500]} />
                        <Text fontSize={11} color={colors.secondary}>
                            {t("VITALS.LEGEND_OK")}
                        </Text>
                        <View style={styles.legendSpacer} />
                        <LegendDot color={colors.orange[500]} />
                        <Text fontSize={11} color={colors.secondary}>
                            {t("VITALS.LEGEND_WATCH")}
                        </Text>
                        <View style={styles.legendSpacer} />
                        <LegendDot color={colors.red[500]} />
                        <Text fontSize={11} color={colors.secondary}>
                            {t("VITALS.LEGEND_ALERT")}
                        </Text>
                    </View>
                </View>

                {/* Blood Pressure */}
                {(latest.systolic || latest.diastolic) && (
                    <Box
                        title={t("VITALS.BLOOD_PRESSURE")}
                        headerContent={
                            bpTag ? (
                                <Chip
                                    text={t(bpTag.label)}
                                    color={bpTag.color}
                                    numberOfLines={1}
                                />
                            ) : undefined
                        }
                    >
                        <View style={styles.bpRow}>
                            <View style={styles.bpCell}>
                                <Text
                                    fontSize={42}
                                    weight="800"
                                    color={
                                        bpTag
                                            ? colorForChip(bpTag.color, colors)
                                            : colors.text
                                    }
                                >
                                    {latest.systolic
                                        ? Math.round(latest.systolic.value)
                                        : "—"}
                                </Text>
                                <Text
                                    fontSize={11}
                                    weight="600"
                                    color={colors.secondary}
                                >
                                    {t("VITALS.SYSTOLIC")}
                                </Text>
                            </View>
                            <Text
                                fontSize={32}
                                weight="800"
                                color={colors.secondary}
                                style={styles.bpSlash}
                            >
                                /
                            </Text>
                            <View style={styles.bpCell}>
                                <Text
                                    fontSize={42}
                                    weight="800"
                                    color={
                                        bpTag
                                            ? colorForChip(bpTag.color, colors)
                                            : colors.text
                                    }
                                >
                                    {latest.diastolic
                                        ? Math.round(latest.diastolic.value)
                                        : "—"}
                                </Text>
                                <Text
                                    fontSize={11}
                                    weight="600"
                                    color={colors.secondary}
                                >
                                    {t("VITALS.DIASTOLIC")}
                                </Text>
                            </View>
                            <Text
                                fontSize={14}
                                weight="700"
                                color={colors.secondary}
                                style={styles.bpUnit}
                            >
                                mmHg
                            </Text>
                        </View>
                    </Box>
                )}

                {/* SpO2 + HRV side by side */}
                <View style={styles.row}>
                    <Box
                        title={t("VITALS.SPO2")}
                        style={styles.statBox}
                        headerContent={
                            spo2Tag ? (
                                <Chip
                                    text={t(spo2Tag.label)}
                                    color={spo2Tag.color}
                                    numberOfLines={1}
                                />
                            ) : undefined
                        }
                    >
                        <Text
                            fontSize={36}
                            weight="800"
                            color={
                                spo2Tag
                                    ? colorForChip(spo2Tag.color, colors)
                                    : colors.text
                            }
                        >
                            {latest.spo2 ? Math.round(latest.spo2.value) : "—"}
                        </Text>
                        <Text
                            fontSize={12}
                            weight="600"
                            color={colors.secondary}
                        >
                            % SpO₂
                        </Text>
                    </Box>

                    <Box
                        title={t("VITALS.HRV")}
                        style={styles.statBox}
                        headerContent={
                            hrvTag ? (
                                <Chip
                                    text={t(hrvTag.label)}
                                    color={hrvTag.color}
                                    numberOfLines={1}
                                />
                            ) : undefined
                        }
                    >
                        <Text
                            fontSize={36}
                            weight="800"
                            color={
                                hrvTag
                                    ? colorForChip(hrvTag.color, colors)
                                    : colors.text
                            }
                        >
                            {latest.hrv ? Math.round(latest.hrv.value) : "—"}
                        </Text>
                        <Text
                            fontSize={12}
                            weight="600"
                            color={colors.secondary}
                        >
                            ms
                        </Text>
                    </Box>
                </View>

                {/* Footer disclaimer */}
                <Text
                    fontSize={11}
                    color={colors.secondary}
                    style={styles.disclaimer}
                >
                    {t("VITALS.DISCLAIMER")}
                </Text>
            </ScrollView>
        </PageContainer>
    );
};

function LegendDot({ color }: { color: string }) {
    return <View style={[styles.legendDot, { backgroundColor: color }]} />;
}

type ThemeColors = ReturnType<typeof useColorTheme>;

function colorForChip(chipColor: ChipColor, colors: ThemeColors): string {
    switch (chipColor) {
        case "green":
            return colors.green[500];
        case "orange":
            return colors.orange[500];
        case "red":
            return colors.red[500];
        case "blue":
            return colors.blue[500];
    }
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 40,
        gap: 14,
    },
    explainer: {
        padding: 14,
        borderRadius: 14,
        borderWidth: StyleSheet.hairlineWidth,
    },
    explainerTitle: {
        marginBottom: 4,
    },
    explainerBody: {
        lineHeight: 17,
        marginBottom: 10,
    },
    legendRow: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 5,
    },
    legendSpacer: {
        width: 14,
    },
    row: {
        flexDirection: "row",
        gap: 12,
    },
    statBox: {
        flex: 1,
        aspectRatio: 1,
    },
    bpRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 8,
    },
    bpCell: {
        alignItems: "center",
    },
    bpSlash: {
        marginHorizontal: 4,
    },
    bpUnit: {
        marginLeft: 12,
        alignSelf: "flex-end",
        marginBottom: 8,
    },
    disclaimer: {
        textAlign: "center",
        paddingHorizontal: 16,
        marginTop: 6,
        lineHeight: 15,
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
