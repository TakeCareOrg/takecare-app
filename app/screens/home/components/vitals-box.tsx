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

import { Box } from "@app/components/ui/box";
import { Text } from "@app/components/ui/text";
import type { MainStackParamList } from "@app/navigation/app-navigation-types";
import type { VitalsSlice } from "@app/types/health-data-types";

/**
 * Home-screen widget for Withings cardio-vascular vitals. Shows the
 * most recent BP reading (if available, otherwise falls back to SpO2,
 * then HRV — whichever is freshest). Tapping navigates to the Vitals
 * detail screen.
 */
const screenWidth = Dimensions.get("window").width;

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

    const latestSystolic = lastOf(vitals?.bloodPressure?.systolic);
    const latestDiastolic = lastOf(vitals?.bloodPressure?.diastolic);
    const latestSpo2 = lastOf(vitals?.spo2);
    const latestHrv = lastOf(vitals?.hrv);

    return (
        <Box
            id="VITALS_BOX"
            title={t("HOME_PAGE.VITALS.TITLE")}
            width={width || screenWidth / 2 - 25}
            style={style}
            aspectRatio={true}
            onPress={() => navigation.navigate("Vitals")}
        >
            {latestSystolic && latestDiastolic ? (
                <View style={styles.bpRow}>
                    <Text fontSize={32} weight="800">
                        {Math.round(latestSystolic.value)}
                    </Text>
                    <Text fontSize={20} weight="700">
                        /
                    </Text>
                    <Text fontSize={32} weight="800">
                        {Math.round(latestDiastolic.value)}
                    </Text>
                    <Text fontSize={12} weight="600" style={styles.unit}>
                        mmHg
                    </Text>
                </View>
            ) : latestSpo2 ? (
                <View style={styles.row}>
                    <Text fontSize={42} weight="800">
                        {Math.round(latestSpo2.value)}
                    </Text>
                    <Text fontSize={16} weight="700" style={styles.unit}>
                        % SpO₂
                    </Text>
                </View>
            ) : latestHrv ? (
                <View style={styles.row}>
                    <Text fontSize={42} weight="800">
                        {Math.round(latestHrv.value)}
                    </Text>
                    <Text fontSize={16} weight="700" style={styles.unit}>
                        ms HRV
                    </Text>
                </View>
            ) : (
                <Text fontSize={14} weight="600">
                    {t("COMMON.NO_DATA")}
                </Text>
            )}
        </Box>
    );
}

function lastOf<T extends { endDate: string }>(arr: T[] | undefined): T | null {
    if (!arr || arr.length === 0) return null;
    return [...arr].sort(
        (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
    )[arr.length - 1];
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
});
