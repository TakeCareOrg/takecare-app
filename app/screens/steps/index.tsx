import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

import { Box } from "@app/components/ui/box";
import { DailyBarChart } from "@app/components/ui/chart/daily-bar-chart";
import { Chip } from "@app/components/ui/chip";
import { Text } from "@app/components/ui/text";
import useHealthData from "@app/hooks/health/use-health-data";
import { PageContainer } from "@app/layouts/page-container";
import { DetailedBarChart } from "@app/screens/steps/components/detailed-bar-chart";
import { format, subYears } from "date-fns";

export function StepsScreen() {
    const [selectedBarInfo, setSelectedBarInfo] = useState<{
        value: number;
        date?: string;
        day: string;
    } | null>(null);

    const [isDataLoaded, setIsDataLoaded] = useState(false);

    // Get all data from the last 10 years
    const { steps, flights, distance } = useHealthData({
        startDate: subYears(new Date(), 10),
        endDate: new Date(),
    });

    // Mark data as loaded when available
    useEffect(() => {
        if (steps && steps.length > 0) {
            setIsDataLoaded(true);
        }
    }, [steps]);

    // Calculate today's data
    const todayData = useMemo(() => {
        if (!steps || steps.length === 0) return null;

        const today = format(new Date(), "yyyy-MM-dd");
        const todaySteps = steps.find(
            (step) =>
                step.startDate &&
                format(new Date(step.startDate), "yyyy-MM-dd") === today,
        );

        const todayFlights = flights?.find(
            (flight) =>
                flight.startDate &&
                format(new Date(flight.startDate), "yyyy-MM-dd") === today,
        );

        const todayDistance = distance?.find(
            (dist) =>
                dist.startDate &&
                format(new Date(dist.startDate), "yyyy-MM-dd") === today,
        );

        return {
            steps: todaySteps?.value || 0,
            flights: todayFlights?.value || 0,
            distance: todayDistance?.value || 0, // in meters
        };
    }, [steps, flights, distance]);

    // Calculate metrics for Active time box (simulated for example)
    const activeTimeData = useMemo(() => {
        // In reality, you should get this data from HealthKit
        return {
            activeMinutes: 208,
            targetMinutes: 90,
        };
    }, []);

    const stepsGoalColor = useMemo(() => {
        if (!todayData) return "grey";
        if (todayData.steps >= 10000) return "green";
        if (todayData.steps >= 5000) return "orange";
        return "red";
    }, [todayData]);

    const stepsGoalText = useMemo(() => {
        if (!todayData) return "No Data";
        if (todayData.steps >= 10000) return "Excellent !";
        if (todayData.steps >= 5000) return "Very Good !";
        return "Keep Going !";
    }, [todayData]);

    const activeTimeColor = useMemo(() => {
        const percentage =
            (activeTimeData.activeMinutes / activeTimeData.targetMinutes) * 100;
        if (percentage >= 100) return "green";
        if (percentage >= 75) return "orange";
        return "red";
    }, [activeTimeData]);

    const chartData = useMemo(() => {
        if (!steps || steps.length === 0) {
            return [];
        }

        // Filter valid data and sort by date (from past to present)
        const sortedData = steps
            .filter((step) => step.startDate && step.value !== undefined)
            .sort(
                (a, b) =>
                    new Date(a.startDate).getTime() -
                    new Date(b.startDate).getTime(),
            )
            .map((step, index) => ({
                id: `step-${step.startDate}-${index}`,
                day: format(new Date(step.startDate), "dd"),
                value: step.value,
                startDate:
                    typeof step.startDate === "string"
                        ? step.startDate
                        : new Date(step.startDate).toISOString(),
            }));

        return sortedData;
    }, [steps]);

    const handleBarSelect = (selectedData: any) => {
        setSelectedBarInfo({
            value: selectedData.value,
            date: selectedData.startDate,
            day: selectedData.day,
        });
    };

    return (
        <PageContainer>
            {isDataLoaded && chartData.length > 0 && (
                <DailyBarChart
                    key={`chart-${chartData.length}-${chartData[chartData.length - 1]?.startDate}`}
                    data={chartData}
                    onSelect={handleBarSelect}
                    disableSnapping={false}
                    referenceLines={[
                        {
                            value: 5000,
                            label: "5k",
                            lineColor: "#60f000",
                            labelColor: "#60f000",
                        },
                        {
                            value: 10000,
                            label: "10k",
                            lineColor: "#60f000",
                            labelColor: "#60f000",
                        },
                    ]}
                    height={150}
                    fillMissingDays={true}
                    dynamicColors={{
                        belowFirstReference: "#8A8A8A",
                        aboveFirstReference: "#16D356",
                    }}
                />
            )}
            {/* Deux Box en haut */}
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
                {/* Goal Box - Steps */}
                <View style={{ flex: 1 }}>
                    <Box
                        title="Goal"
                        headerContent={
                            todayData && (
                                <Chip
                                    text={stepsGoalText}
                                    color={stepsGoalColor}
                                    style={{
                                        fontSize: 12,
                                        fontFamily: "Poppins-Medium",
                                    }}
                                />
                            )
                        }
                        height={200}
                    >
                        {todayData ? (
                            <View style={{ flex: 1 }}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "flex-end",
                                        marginBottom: 8,
                                    }}
                                >
                                    <Text fontSize={48} font="Poppins-SemiBold">
                                        {todayData.steps.toLocaleString()}
                                    </Text>
                                    <Text
                                        fontSize={16}
                                        font="Poppins-Medium"
                                        style={{
                                            marginLeft: 8,
                                            marginBottom: 8,
                                        }}
                                    >
                                        Steps
                                    </Text>
                                </View>

                                <Text
                                    fontSize={14}
                                    font="Poppins-Regular"
                                    style={{ opacity: 0.7, marginBottom: 16 }}
                                >
                                    /6000
                                </Text>

                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text
                                        fontSize={12}
                                        font="Poppins-Medium"
                                        style={{ color: "#4CAF50" }}
                                    >
                                        {(todayData.distance / 1000).toFixed(2)}{" "}
                                        km
                                    </Text>
                                    <Text
                                        fontSize={12}
                                        font="Poppins-Medium"
                                        style={{ color: "#4CAF50" }}
                                    >
                                        701 Cal
                                    </Text>
                                    <Text
                                        fontSize={12}
                                        font="Poppins-Medium"
                                        style={{ color: "#4CAF50" }}
                                    >
                                        {todayData.flights} floors
                                    </Text>
                                </View>
                            </View>
                        ) : (
                            <Text>No data available</Text>
                        )}
                    </Box>
                </View>

                {/* Active Time Box */}
                <View style={{ flex: 1 }}>
                    <Box title="Active time" height={200}>
                        <View style={{ flex: 1 }}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "flex-end",
                                    marginBottom: 8,
                                }}
                            >
                                <Text fontSize={48} font="Poppins-SemiBold">
                                    {activeTimeData.activeMinutes}
                                </Text>
                                <Text
                                    fontSize={16}
                                    font="Poppins-Medium"
                                    style={{ marginLeft: 8, marginBottom: 8 }}
                                >
                                    mins
                                </Text>
                            </View>

                            <Text
                                fontSize={14}
                                font="Poppins-Regular"
                                style={{ opacity: 0.7 }}
                            >
                                /{activeTimeData.targetMinutes} mins
                            </Text>
                        </View>
                    </Box>
                </View>
            </View>

            <DetailedBarChart />
        </PageContainer>
    );
}
