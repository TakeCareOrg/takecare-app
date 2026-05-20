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
import Svg, { Path } from "react-native-svg";

import { GradientBox } from "@app/components/ui/gradient-box";
import { Text } from "@app/components/ui/text";
import { colors as rawColors } from "@app/constants/colors";
import type { MainStackParamList } from "@app/navigation/app-navigation-types";
import type { BasesHealthValue } from "@app/types/health-data-types";

/**
 * Home-screen widget for Withings body composition. Shows the most
 * recent weight + 7-day delta. Tapping the widget navigates to the
 * BodyComposition detail screen.
 *
 * Visual: pastel mint→lavender gradient (always — independent of dark
 * mode, treated as an accent card). Watermarked scale icon in the
 * bottom-right + small deco bubble in the top-right.
 */
const screenWidth = Dimensions.get("window").width;

// Dark slate text reads cleanly against the pastel gradient in both
// themes; we deliberately bypass the theme's `colors.text` because the
// gradient stays light regardless of dark mode.
const FOREGROUND = "#1F2440";
const FOREGROUND_MUTED = "rgba(31, 36, 64, 0.65)";

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

    // Pastel mint → periwinkle. Stays the same in both themes so the
    // card reads consistently regardless of the surrounding theme.
    const gradient: [string, string] = [
        rawColors.green[200],
        rawColors.blue[100],
    ];

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
        <GradientBox
            id="BODY_COMPOSITION_BOX"
            title={t("HOME_PAGE.BODY_COMPOSITION.TITLE")}
            width={width || screenWidth / 2 - 25}
            style={style}
            aspectRatio={true}
            gradient={gradient}
            titleColor={FOREGROUND}
            onPress={() => navigation.navigate("BodyComposition")}
        >
            {/* Background deco: a faint bubble in the top-right and a
                watermarked scale icon hugging the bottom-right corner.
                Pointer events off so they never intercept the press. */}
            <View pointerEvents="none" style={styles.decoBubble} />
            <View pointerEvents="none" style={styles.iconWatermark}>
                <ScaleIcon size={88} color="rgba(31, 36, 64, 0.22)" />
            </View>

            {latest !== null ? (
                <View style={styles.row}>
                    <Text fontSize={42} weight="800" color={FOREGROUND}>
                        {latest.toFixed(1)}
                    </Text>
                    <Text
                        fontSize={16}
                        weight="700"
                        color={FOREGROUND}
                        style={styles.unit}
                    >
                        kg
                    </Text>
                </View>
            ) : (
                <Text fontSize={14} weight="600" color={FOREGROUND_MUTED}>
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
                            color: weekDelta < 0 ? "#0F7A50" : "#9C3A1B",
                        },
                    ]}
                >
                    {weekDelta > 0 ? "+" : ""}
                    {weekDelta.toFixed(1)} kg / 7j
                </Text>
            )}
        </GradientBox>
    );
}

/**
 * Generic weighing-scale icon (inline SVG — no extra dep). 24x24
 * viewBox, single-color, scales via the `size` prop.
 */
function ScaleIcon({ size, color }: { size: number; color: string }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
                stroke={color}
                strokeWidth={1.6}
            />
            <Path
                d="M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"
                stroke={color}
                strokeWidth={1.6}
            />
            <Path
                d="M12 12 13.5 9"
                stroke={color}
                strokeWidth={1.6}
                strokeLinecap="round"
            />
            <Path
                d="M7 6V4.5A1.5 1.5 0 0 1 8.5 3h7A1.5 1.5 0 0 1 17 4.5V6"
                stroke={color}
                strokeWidth={1.6}
                strokeLinecap="round"
            />
        </Svg>
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
    decoBubble: {
        position: "absolute",
        top: -14,
        right: -14,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "rgba(255, 255, 255, 0.30)",
    },
    iconWatermark: {
        position: "absolute",
        right: -10,
        bottom: -10,
    },
});
