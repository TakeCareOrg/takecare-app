import { useTranslation } from "react-i18next";
import {
    Dimensions,
    DimensionValue,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";

import { Box } from "@components/ui/box";
import { Text } from "@components/ui/text";
import { useUserStore } from "@stores/users";

const screenWidth = Dimensions.get("window").width;

const WEIGHT_DATA = [
    { value: 60 },
    { value: 65 },
    { value: 69 },
    { value: 67 },
];

export function WeightBox({
    width,
    style,
}: {
    width?: DimensionValue;
    style?: StyleProp<ViewStyle>;
}) {
    const { t } = useTranslation("full_trads");
    const user = useUserStore((state) => state.user);

    return (
        <Box
            title={t("HOME_PAGE.WEIGHT")}
            width={width ?? screenWidth / 2 - 25}
            style={[{ flex: 0 }, style]}
            aspectRatio={width === undefined}
        >
            <LineChart
                areaChart
                data={WEIGHT_DATA}
                startFillColor="#27AE8E"
                startOpacity={0.8}
                endOpacity={0.1}
                endFillColor="#141436"
                showVerticalLines={false}
                showReferenceLine1={false}
                spacing={30}
                initialSpacing={0}
                hideDataPoints
                hideYAxisText
                hideRules
                hideAxesAndRules
                height={75}
                xAxisLabelsHeight={0}
                yAxisIndicesHeight={0}
                yAxisLabelContainerStyle={{ height: 0 }}
                showXAxisIndices={false}
            />
            <View style={styles.weight}>
                <Text fontSize={34} weight="600">
                    {user?.health.weight || "No Data"}
                </Text>
                <Text
                    weight="600"
                    fontSize={18}
                    style={{ marginBottom: 3, marginLeft: 3 }}
                >
                    {user?.health.weight_unit || ""}
                </Text>
            </View>
        </Box>
    );
}

const styles = StyleSheet.create({
    weight: {
        flexDirection: "row",
        alignItems: "flex-end",
    },
});
