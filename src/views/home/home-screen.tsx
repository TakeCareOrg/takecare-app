import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useAuth } from "../../contexts/auth-context.tsx";
import { ResponsiveContext } from "../../contexts/responsive-context.tsx";
import { Container } from "../../ui/container/index.tsx";
import { PageContainer } from "../../ui/container/page-container.tsx";
import { TextComponent } from "../../ui/text-component/index.tsx";
import { AboutYou } from "./components/about-you.tsx";
import { HealthScore } from "./components/health-check.tsx";
import { LastHearthRate } from "./components/last-hearth-rate.tsx";
import { MentalDiary } from "./components/mental-diary.tsx";

export const HomeScreen: React.FC = () => {
    const weight_data = [
        { value: 60 },
        { value: 65 },
        { value: 69 },
        { value: 67 },
    ];
    const { screenWidth } = useContext(ResponsiveContext);
    const { user } = useAuth();
    const { t } = useTranslation();

    return (
        <>
            <PageContainer
                title={t("HOME.HELLO") + ", " + user?.first_name}
                showProfile={true}
                isHome={true}
            >
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "nowrap",
                        justifyContent: "space-between",
                    }}
                >
                    <HealthScore score={1} />
                    <MentalDiary />
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "nowrap",
                        justifyContent: "space-between",
                    }}
                />
                <AboutYou />
                {/**/}
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Container
                        title={t("HOME.WEIGHT")}
                        preset={"little"}
                        height={"auto"}
                        width={screenWidth / 2 - 25}
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
                            height={65}
                            xAxisLabelsHeight={0}
                            yAxisIndicesHeight={0}
                            yAxisLabelContainerStyle={{ height: 0 }}
                            showXAxisIndices={false}
                        />
                        <View style={styles.weight}>
                            <TextComponent fontSize={24}>
                                {user?.health?.weight || "69"}
                            </TextComponent>
                            <TextComponent
                                fontSize={12}
                                style={{ marginBottom: 3, marginLeft: 3 }}
                            >
                                {user?.health?.weight_unit || "kg"}
                            </TextComponent>
                        </View>
                        <TextComponent fontSize={8}>
                            {t("HOME.WEIGHT_LOSS")} 5.4{" "}
                            {user?.health?.weight_unit} {t("HOME.SINCE")}
                            10.05.2024 !
                        </TextComponent>
                    </Container>
                    <LastHearthRate />
                </View>
            </PageContainer>
        </>
    );
};

const styles = StyleSheet.create({
    weight: {
        flexDirection: "row",
        alignItems: "flex-end",
    },
});
