import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
    DimensionValue,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";

import {
    ActivityRings,
    type RingDatum,
} from "@app/components/ui/chart/activity-rings";
import { Text } from "@app/components/ui/text";
import { HEALTH_TARGETS } from "@app/constants/health-targets";
import { useColorTheme } from "@app/hooks/use-color-theme";
import { BasesHealthValue } from "@app/types/health-data-types";
import { Box } from "@components/ui/box";

function sumValues(values: BasesHealthValue[] | null | undefined): number {
    if (!values) return 0;
    return values.reduce((sum, item) => sum + (item.value || 0), 0);
}

function formatNumber(value: number): string {
    return Math.round(value).toLocaleString();
}

export function ActivityRingsBox({
    steps,
    calories,
    activeMinutes,
    width,
    height,
    style,
}: {
    steps: BasesHealthValue[] | null;
    calories: BasesHealthValue[] | null;
    activeMinutes: BasesHealthValue[] | null;
    width?: DimensionValue;
    height?: DimensionValue;
    style?: StyleProp<ViewStyle>;
}) {
    const { t } = useTranslation("full_trads");
    const colors = useColorTheme();

    const stepColor = colors.isDark ? colors.green[400] : colors.green[500];
    const caloriesColor = colors.isDark
        ? colors.orange[400]
        : colors.orange[500];
    const minutesColor = colors.raw.primary[500];

    const stepsValue = useMemo(() => sumValues(steps), [steps]);
    const caloriesValue = useMemo(() => sumValues(calories), [calories]);
    const activeMinutesValue = useMemo(
        () => sumValues(activeMinutes),
        [activeMinutes],
    );

    const ringData: [RingDatum, RingDatum, RingDatum] = useMemo(
        () => [
            {
                value: stepsValue,
                target: HEALTH_TARGETS.STEPS,
                color: stepColor,
                label: t("HOME_PAGE.STEPS"),
            },
            {
                value: caloriesValue,
                target: HEALTH_TARGETS.CALORIES,
                color: caloriesColor,
                label: t("HOME_PAGE.CALORIES"),
                unit: "kcal",
            },
            {
                value: activeMinutesValue,
                target: HEALTH_TARGETS.ACTIVE_MINUTES,
                color: minutesColor,
                label: t("HOME_PAGE.ACTIVE_MINUTES"),
                unit: "min",
            },
        ],
        [
            stepsValue,
            caloriesValue,
            activeMinutesValue,
            stepColor,
            caloriesColor,
            minutesColor,
            t,
        ],
    );

    return (
        <Box
            title={t("HOME_PAGE.ACTIVITY")}
            width={width}
            height={typeof height === "number" ? height : undefined}
            style={style}
        >
            <View style={styles.content}>
                <View style={styles.ringsWrapper}>
                    <ActivityRings
                        data={ringData}
                        size={130}
                        strokeWidth={12}
                    />
                </View>
                <View style={styles.legend}>
                    {ringData.map((datum) => (
                        <View key={datum.label} style={styles.legendRow}>
                            <View
                                style={[
                                    styles.legendDot,
                                    { backgroundColor: datum.color },
                                ]}
                            />
                            <Text
                                fontSize={12}
                                weight="600"
                                color={colors.secondary}
                                style={styles.legendLabel}
                                numberOfLines={1}
                            >
                                {datum.label}
                            </Text>
                            <Text
                                fontSize={12}
                                weight="700"
                                color={colors.text}
                                numberOfLines={1}
                            >
                                {formatNumber(datum.value)} /{" "}
                                {formatNumber(datum.target)}
                                {datum.unit ? ` ${datum.unit}` : ""}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </Box>
    );
}

const styles = StyleSheet.create({
    content: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 16,
    },
    ringsWrapper: {
        alignItems: "center",
        justifyContent: "center",
    },
    legend: {
        flex: 1,
        rowGap: 10,
    },
    legendRow: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 8,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendLabel: {
        flexShrink: 1,
    },
});
