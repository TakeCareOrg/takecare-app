import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
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
import type { VitalsSlice } from "@app/types/health-data-types";

/**
 * Home-screen widget for Withings cardio-vascular vitals. Shows the
 * most recent BP reading (if available, otherwise falls back to SpO2,
 * then HRV — whichever is freshest). Tapping navigates to the Vitals
 * detail screen.
 *
 * Visual: pastel periwinkle→violet gradient (always — independent of
 * dark mode, treated as an accent card). Heart-pulse SVG watermark in
 * the bottom-right + small deco bubble in the top-right.
 */
const screenWidth = Dimensions.get("window").width;

const FOREGROUND = "#1F2440";
const FOREGROUND_MUTED = "rgba(31, 36, 64, 0.65)";

export function VitalsBox({
    vitals,
    width,
    style,
}: {
    vitals: VitalsSlice | undefined;
    width?: DimensionValue;
    style?: StyleProp<ViewStyle>;
}) {
    const { t } = useTranslation("full_trads");
    const navigation =
        useNavigation<NativeStackNavigationProp<MainStackParamList>>();

    // Pastel periwinkle → violet. The codebase's `blue` palette is in
    // fact indigo, so this reads as a calm bleu→violet transition.
    const gradient: [string, string] = [
        rawColors.blue[100],
        rawColors.primary[500],
    ];

    const latestSystolic = lastOf(vitals?.bloodPressure?.systolic);
    const latestDiastolic = lastOf(vitals?.bloodPressure?.diastolic);
    const latestSpo2 = lastOf(vitals?.spo2);
    const latestHrv = lastOf(vitals?.hrv);

    return (
        <GradientBox
            id="VITALS_BOX"
            title={t("HOME_PAGE.VITALS.TITLE")}
            width={width || screenWidth / 2 - 25}
            style={style}
            aspectRatio={true}
            gradient={gradient}
            titleColor={FOREGROUND}
            onPress={() => navigation.navigate("Vitals")}
        >
            {/* Background deco: a faint bubble top-right and a
                watermarked heart-pulse SVG hugging the bottom-right
                corner. Pointer events off so the press target stays
                the whole card. */}
            <View pointerEvents="none" style={styles.decoBubble} />
            <View pointerEvents="none" style={styles.iconWatermark}>
                <HeartPulseIcon size={92} color="rgba(31, 36, 64, 0.22)" />
            </View>

            {latestSystolic && latestDiastolic ? (
                <View style={styles.bpRow}>
                    <Text fontSize={32} weight="800" color={FOREGROUND}>
                        {Math.round(latestSystolic.value)}
                    </Text>
                    <Text fontSize={20} weight="700" color={FOREGROUND}>
                        /
                    </Text>
                    <Text fontSize={32} weight="800" color={FOREGROUND}>
                        {Math.round(latestDiastolic.value)}
                    </Text>
                    <Text
                        fontSize={12}
                        weight="600"
                        color={FOREGROUND_MUTED}
                        style={styles.unit}
                    >
                        mmHg
                    </Text>
                </View>
            ) : latestSpo2 ? (
                <View style={styles.row}>
                    <Text fontSize={42} weight="800" color={FOREGROUND}>
                        {Math.round(latestSpo2.value)}
                    </Text>
                    <Text
                        fontSize={16}
                        weight="700"
                        color={FOREGROUND_MUTED}
                        style={styles.unit}
                    >
                        % SpO₂
                    </Text>
                </View>
            ) : latestHrv ? (
                <View style={styles.row}>
                    <Text fontSize={42} weight="800" color={FOREGROUND}>
                        {Math.round(latestHrv.value)}
                    </Text>
                    <Text
                        fontSize={16}
                        weight="700"
                        color={FOREGROUND_MUTED}
                        style={styles.unit}
                    >
                        ms HRV
                    </Text>
                </View>
            ) : (
                <Text fontSize={14} weight="600" color={FOREGROUND_MUTED}>
                    {t("COMMON.NO_DATA")}
                </Text>
            )}
        </GradientBox>
    );
}

function lastOf<T extends { endDate: string }>(arr: T[] | undefined): T | null {
    if (!arr || arr.length === 0) return null;
    return [...arr].sort(
        (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
    )[arr.length - 1];
}

/**
 * Heart with an inscribed ECG/pulse line. Single-color, scales via the
 * `size` prop. Inline SVG so we don't introduce a new icon dep.
 */
function HeartPulseIcon({ size, color }: { size: number; color: string }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M12 21s-7-4.5-9.5-9.5C1.2 8.4 3.5 4.5 7.2 4.5c1.9 0 3.4 1 4.8 2.7C13.4 5.5 14.9 4.5 16.8 4.5c3.7 0 6 3.9 4.7 7C19 16.5 12 21 12 21Z"
                stroke={color}
                strokeWidth={1.6}
                strokeLinejoin="round"
            />
            <Path
                d="M4 13h3.5l1.5-3 2 6 1.5-3h4.5"
                stroke={color}
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
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
    bpRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 4,
    },
    unit: {
        marginBottom: 6,
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
