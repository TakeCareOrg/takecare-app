import { useTranslation } from "react-i18next";
import { Dimensions, StyleSheet, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

import { BasesHealthValue } from "@app/types/health-data-types";
import { Box } from "@components/ui/box";
import { Text } from "@components/ui/text";
import { PageContainer } from "@layouts/page-container";
import { useHealthDataStore } from "@stores/health-data";
import { useUserStore } from "@stores/users";

import { AboutYou } from "./components/about-you";
import { AchievementsBox } from "./components/achievements-box";
import { HeartRateBox } from "./components/heart-rate-box";
import { LevelBox } from "./components/level-box";
import { WeatherBox } from "./components/weather-box";

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

    // Use today's cached health data from store
    const healthData = useHealthDataStore((state) => state.todayCache?.data);
    const heartRate = healthData?.heartRate || {
        lastHeartRateValue: null,
        values: [],
    };
    const sleepAnalysis = healthData?.sleepAnalysis || {
        totalSleepValue: null,
        sleepSteps: [],
    };
    const steps = healthData?.steps || null;

    // Sum all steps for today
    const stepCount =
        steps?.reduce(
            (sum: number, step: BasesHealthValue) => sum + (step.value || 0),
            0,
        ) || null;

    return (
        <PageContainer variant="home" title={t("COMMON.NAVBAR_TITLE")}>
            <View style={{ flexDirection: "column", rowGap: 20 }}>
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "nowrap",
                        justifyContent: "space-between",
                    }}
                >
                    {/* <HealthCheck score={70} /> */}
                    <LevelBox />
                    <AchievementsBox />
                </View>
                <AboutYou
                    sleepValue={sleepAnalysis.totalSleepValue}
                    steps={stepCount ?? null}
                />
                <WeatherBox />
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Box
                        title={t("HOME_PAGE.WEIGHT")}
                        width={screenWidth / 2 - 25}
                        style={{ flex: 0 }}
                        aspectRatio={true}
                    >
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
                    {heartRate.lastHeartRateValue ? (
                        <HeartRateBox
                            value={heartRate.lastHeartRateValue}
                            width={screenWidth / 2 - 25}
                            style={{ flex: 0 }}
                        />
                    ) : null}
                </View>
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
