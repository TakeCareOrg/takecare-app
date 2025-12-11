import { useTranslation } from "react-i18next";
import { Dimensions, StyleSheet, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

import useHealthData from "@app/hooks/health/use-health-data";
import { PageContainer } from "@app/layouts/page-container";
import { useUserStore } from "@app/stores/users";
import { safeFormatDate } from "@app/utils/date";
import { Box } from "@components/ui/box";
import { Text } from "@components/ui/text";

import { AboutYou } from "./components/about-you";
import { Diary } from "./components/diary";
import { HealthCheck } from "./components/health-check";
import { HeartRateBox } from "./components/heart-rate-box";

export function HomeScreen() {
    const weight_data = [
        { value: 60 },
        { value: 65 },
        { value: 69 },
        { value: 67 },
    ];

    const { t } = useTranslation("full_trads");
    const user = useUserStore((state) => state.user);
    const screenWidth = Dimensions.get("window").width;

    const { heartRate, sleepAnalysis, stepCount } = useHealthData({
        startDate: safeFormatDate(new Date()),
        endDate: safeFormatDate(new Date()),
    });

    return (
        <PageContainer variant="home" title={t("COMMON.NAVBAR_TITLE")}>
            <View
                style={{
                    flexDirection: "row",
                    flexWrap: "nowrap",
                    justifyContent: "space-between",
                }}
            >
                <HealthCheck score={70} />
                <Diary />
            </View>
            <AboutYou
                sleepValue={sleepAnalysis.totalSleepValue}
                steps={stepCount ?? null}
            />
            <View style={{ height: 10 }} />
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 16,
                    columnGap: 14,
                }}
            >
                <Box title={t("HOME_PAGE.WEIGHT")} width={screenWidth / 2 - 25}>
                    <LineChart
                        areaChart
                        data={weight_data}
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
                        height={65}
                        xAxisLabelsHeight={0}
                        yAxisIndicesHeight={0}
                        yAxisLabelContainerStyle={{ height: 0 }}
                        showXAxisIndices={false}
                    />
                    <View style={styles.weight}>
                        <Text fontSize={24}>
                            {user?.health.weight || "No Data"}
                        </Text>
                        <Text
                            fontSize={8}
                            style={{ marginBottom: 3, marginLeft: 3 }}
                        >
                            {user?.health.weight_unit || ""}
                        </Text>
                    </View>
                </Box>
                <HeartRateBox value={heartRate.lastHeartRateValue} />
            </View>
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    weight: {
        flexDirection: "row",
        alignItems: "flex-end",
    },
});
