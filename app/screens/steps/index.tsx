import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

import { Box } from "@app/components/ui/box";
import { DailyBarChart } from "@app/components/ui/chart/daily-bar-chart";
import { Chip } from "@app/components/ui/chip";
import { Text } from "@app/components/ui/text";
import useHealthData from "@app/hooks/health/use-health-data";
import { PageContainer } from "@app/layouts/page-container";
import { DetailedBarChart } from "@app/screens/steps/components/detailed-bar-chart";
import { format } from "date-fns";

export function StepsScreen() {
    const [selectedBarInfo, setSelectedBarInfo] = useState<{
        value: number;
        date?: string;
        day: string;
    } | null>(null);

    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // Get health data from the last 30 days
    const { steps, flights, distance, activeEnergyBurned } = useHealthData({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
    });

    // Mark data as loaded when available
    useEffect(() => {
        if (steps && steps.length > 0) {
            setIsDataLoaded(true);
        }
    }, [steps]);

    // Calculate selected day's data (instead of just today)
    const selectedDayData = useMemo(() => {
        if (!steps || steps.length === 0) return null;

        const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
        const selectedSteps = steps.find(
            (step) =>
                step.startDate &&
                format(new Date(step.startDate), "yyyy-MM-dd") === selectedDateStr,
        );

        const selectedFlights = flights?.find(
            (flight) =>
                flight.startDate &&
                format(new Date(flight.startDate), "yyyy-MM-dd") === selectedDateStr,
        );

        const selectedDistance = distance?.find(
            (dist) =>
                dist.startDate &&
                format(new Date(dist.startDate), "yyyy-MM-dd") === selectedDateStr,
        );

        const selectedActiveEnergy = activeEnergyBurned?.find(
            (energy) =>
                energy.startDate &&
                format(new Date(energy.startDate), "yyyy-MM-dd") === selectedDateStr,
        );

        const result = {
            steps: selectedSteps?.value || 0,
            flights: selectedFlights?.value || 0,
            distance: selectedDistance?.value || 0, // in meters
            activeEnergyBurned: selectedActiveEnergy?.value || 0, // in calories
            date: selectedDateStr,
        };

        return result;
    }, [steps, flights, distance, activeEnergyBurned, selectedDate]);

    // Calculate metrics for Active time box based on real active energy burned data
    const activeTimeData = useMemo(() => {
        // Convert active energy burned to approximate active minutes
        // Rough estimation: 5-10 calories per minute of active time
        const activeEnergyCalories = selectedDayData?.activeEnergyBurned || 0;
        const activeMinutes = Math.floor(activeEnergyCalories / 7); // ~7 calories per minute average
        const targetMinutes = 90;
        
        return {
            activeMinutes: Math.min(activeMinutes, 300), // Cap at 5 hours max
            targetMinutes,
        };
    }, [selectedDayData]);

    const stepsGoalColor = useMemo(() => {
        if (!selectedDayData) return "grey";
        if (selectedDayData.steps >= 10000) return "green";
        if (selectedDayData.steps >= 5000) return "orange";
        return "red";
    }, [selectedDayData]);

    const stepsGoalText = useMemo(() => {
        if (!selectedDayData) return "No Data";
        if (selectedDayData.steps >= 10000) return "Excellent !";
        if (selectedDayData.steps >= 5000) return "Very Good !";
        return "Keep Going !";
    }, [selectedDayData]);

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
        <PageContainer showNavBar={false}>
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
                            lineColor: "#00a8f0",
                            labelColor: "#00a8f0"
                        },
                        { 
                            value: 10000, 
                            label: "10k",
                            lineColor: "#60f000",
                            labelColor: "#60f000"
                        },
                    ]}
                    height={150}
                    fillMissingDays={true}
                    dynamicColors={{
                        belowFirstReference: '#8A8A8A',
                        aboveFirstReference: '#16D356',
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
                            selectedDayData && (
                                <Chip
                                    text={stepsGoalText}
                                    color={stepsGoalColor}
                                    numberOfLines={1}
                                    style={{
                                        fontSize: 11,
                                        fontFamily: "Poppins-Medium",
                                        maxWidth: '100%',
                                    }}
                                />
                            )
                        }
                        height={200}
                    >
                        {selectedDayData ? (
                            <View style={{ flex: 1 }}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "flex-end",
                                        marginBottom: 8,
                                        flexWrap: "wrap", // Allow wrapping if needed
                                    }}
                                >
                                    <Text 
                                        fontSize={42} 
                                        font="Poppins-SemiBold"
                                        numberOfLines={1}
                                        adjustsFontSizeToFit={true}
                                        style={{ flex: 1, minWidth: 0 }}
                                    >
                                        {selectedDayData.steps.toLocaleString()}
                                    </Text>
                                    <Text
                                        fontSize={14}
                                        font="Poppins-Medium"
                                        style={{
                                            marginLeft: 4,
                                            marginBottom: 6,
                                        }}
                                    >
                                        Steps
                                    </Text>
                                </View>

                                <Text
                                    fontSize={12}
                                    font="Poppins-Regular"
                                    style={{ opacity: 0.7, marginBottom: 12 }}
                                >
                                    /6000
                                </Text>

                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: 4,
                                    }}
                                >
                                    <Text
                                        fontSize={10}
                                        font="Poppins-Medium"
                                        style={{ color: "#4CAF50", flex: 1, textAlign: "center" }}
                                        numberOfLines={1}
                                        adjustsFontSizeToFit={true}
                                    >
                                        {(selectedDayData.distance / 1000).toFixed(1)} km
                                    </Text>
                                    <Text
                                        fontSize={10}
                                        font="Poppins-Medium"
                                        style={{ color: "#4CAF50", flex: 1, textAlign: "center" }}
                                        numberOfLines={1}
                                        adjustsFontSizeToFit={true}
                                    >
                                        {Math.round(selectedDayData.activeEnergyBurned)} Cal
                                    </Text>
                                    <Text
                                        fontSize={10}
                                        font="Poppins-Medium"
                                        style={{ color: "#4CAF50", flex: 1, textAlign: "center" }}
                                        numberOfLines={1}
                                        adjustsFontSizeToFit={true}
                                    >
                                        {selectedDayData.flights} floors
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
                                    flexWrap: "wrap", // Allow wrapping if needed
                                }}
                            >
                                <Text 
                                    fontSize={42} 
                                    font="Poppins-SemiBold"
                                    numberOfLines={1}
                                    adjustsFontSizeToFit={true}
                                    style={{ flex: 1, minWidth: 0 }}
                                >
                                    {activeTimeData.activeMinutes}
                                </Text>
                                <Text
                                    fontSize={14}
                                    font="Poppins-Medium"
                                    style={{ marginLeft: 4, marginBottom: 6 }}
                                >
                                    mins
                                </Text>
                            </View>

                            <Text
                                fontSize={12}
                                font="Poppins-Regular"
                                style={{ opacity: 0.7 }}
                                numberOfLines={1}
                                adjustsFontSizeToFit={true}
                            >
                                /{activeTimeData.targetMinutes} mins
                            </Text>
                        </View>
                    </Box>
                </View>
            </View>

            <DetailedBarChart 
                onDateChange={setSelectedDate}
                initialDate={selectedDate}
            />
        </PageContainer>
    );
}
