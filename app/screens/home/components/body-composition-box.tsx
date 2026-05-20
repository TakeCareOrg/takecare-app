import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
    Dimensions,
    DimensionValue,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";

import { Box } from "@app/components/ui/box";
import { Text } from "@app/components/ui/text";
import type { MainStackParamList } from "@app/navigation/app-navigation-types";
import type { BasesHealthValue } from "@app/types/health-data-types";

/**
 * Home-screen widget for Withings body composition. Shows the most
 * recent weight + 7-day delta. Tapping the widget navigates to the
 * BodyComposition detail screen.
 *
 * Rendered only when Withings has actually pushed body-comp data into
 * the store — see `widget-registry.tsx`, which gates the whole widget
 * on `bodyComposition != null`.
 */
const screenWidth = Dimensions.get("window").width;

export function BodyCompositionBox({
    weightValues,
    width,
    style,
}: {
    weightValues: BasesHealthValue[] | undefined;
    width?: DimensionValue;
    style?: StyleProp<ViewStyle>;
}) {
    const { t } = useTranslation("full_trads");
    const navigation =
        useNavigation<NativeStackNavigationProp<MainStackParamList>>();

    const { latest, weekDelta } = useMemo(() => {
        const arr = weightValues ?? [];
        if (arr.length === 0) {
            return { latest: null as number | null, weekDelta: null };
        }
        const sorted = [...arr].sort(
            (a, b) =>
                new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
        );
        const newest = sorted[sorted.length - 1];
        const newestTs = new Date(newest.endDate).getTime();
        const sevenDaysAgoTs = newestTs - 7 * 24 * 60 * 60 * 1000;
        // Pick the measurement closest to (but no later than) "7 days
        // before newest". Falls back to the oldest sample if the window
        // doesn't contain anything older.
        const baseline =
            sorted.find(
                (s) => new Date(s.endDate).getTime() >= sevenDaysAgoTs,
            ) ?? sorted[0];
        return {
            latest: newest.value,
            weekDelta:
                baseline && baseline !== newest
                    ? newest.value - baseline.value
                    : null,
        };
    }, [weightValues]);

    return (
        <Box
            id="BODY_COMPOSITION_BOX"
            title={t("HOME_PAGE.BODY_COMPOSITION.TITLE")}
            width={width || screenWidth / 2 - 25}
            style={style}
            aspectRatio={true}
            onPress={() => navigation.navigate("BodyComposition")}
        >
            {latest !== null ? (
                <View style={styles.row}>
                    <Text fontSize={42} weight="800">
                        {latest.toFixed(1)}
                    </Text>
                    <Text fontSize={16} weight="700" style={styles.unit}>
                        kg
                    </Text>
                </View>
            ) : (
                <Text fontSize={14} weight="600">
                    {t("COMMON.NO_DATA")}
                </Text>
            )}
            {weekDelta !== null && (
                <Text
                    fontSize={12}
                    weight="700"
                    style={[
                        styles.delta,
                        {
                            color: weekDelta < 0 ? "#27AE8E" : "#E07A5F",
                        },
                    ]}
                >
                    {weekDelta > 0 ? "+" : ""}
                    {weekDelta.toFixed(1)} kg / 7j
                </Text>
            )}
        </Box>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 4,
    },
    unit: {
        marginBottom: 6,
    },
    delta: {
        marginTop: 6,
    },
});
