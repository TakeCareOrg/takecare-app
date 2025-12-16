import { format } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import {
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";

import {
    IntervalBarChart,
    IntervalType,
} from "@app/components/ui/chart/interval-bar-chart";
import {
    calculatePeriodAverage,
    processHealthDataByInterval,
} from "@app/components/ui/chart/interval-bar-chart/interval-data-processor";
import {
    calculateDateRange,
    getIntervalTitle,
} from "@app/components/ui/chart/interval-bar-chart/interval-date-calculator";
import { ToggleSwitch } from "@app/components/ui/toogle-switch";
import useHealthData from "@app/hooks/health/use-health-data";
import { formatFullDate } from "@app/utils/date";

export function DetailedBarChart({
    onDateChange,
    initialDate,
}: {
    onDateChange?: (date: Date) => void;
    initialDate?: Date;
} = {}) {
    const [selectedInterval, setSelectedInterval] =
        useState<IntervalType>("7days");
    const [selectedDate, setSelectedDate] = useState<Date>(
        initialDate || new Date(),
    ); // Track current selected date

    // const colors = useColorTheme();

    // Sync local selectedDate with initialDate prop when it changes
    useEffect(() => {
        if (initialDate) {
            setSelectedDate(initialDate);
        }
    }, [initialDate]);

    const { width: screenWidth } = useWindowDimensions();

    // Check if the selected date is today
    const isToday = useMemo(() => {
        const today = new Date();
        return (
            format(selectedDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
        );
    }, [selectedDate]);

    // Generate dynamic toggle switch label for 24hours
    const get24HoursLabel = useMemo(() => {
        return isToday ? "Today" : "Day";
    }, [isToday]);

    // Calculate date ranges based on interval type (always show most recent data)
    const dateRange = useMemo(() => {
        return calculateDateRange(selectedInterval, selectedDate);
    }, [selectedInterval, selectedDate]);

    // Fetch health data for the current date range
    const { steps } = useHealthData({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
    });

    // Calculate optimal bar dimensions for hours mode
    const calculateHourBarDimensions = () => {
        if (selectedInterval !== "24hours")
            return { barWidth: undefined, barGap: undefined };

        // Available width (accounting for padding/margins - approximate)
        const availableWidth = screenWidth - 60; // Rough estimate for paddings
        const totalHours = 24;

        // Total width per hour (bar + gap)
        const widthPerHour = availableWidth / totalHours;

        // Optimal ratio: 70% bar, 30% gap
        const barWidth = Math.max(4, Math.floor(widthPerHour * 0.7)); // Minimum 4px bar
        const barGap = Math.max(1, Math.floor(widthPerHour * 0.3)); // Minimum 1px gap

        return { barWidth, barGap };
    };

    const { barWidth, barGap } = calculateHourBarDimensions();

    // Process real health data based on interval type
    const chartData = useMemo(() => {
        return processHealthDataByInterval(
            steps || [],
            selectedInterval,
            selectedDate,
        );
    }, [steps, selectedInterval, selectedDate]);

    // Calculate average for the entire selected period (not just visible data)
    const periodAverage = useMemo(() => {
        return calculatePeriodAverage(chartData);
    }, [chartData]);

    // Generate reference lines based on rounded step values
    const referenceLines = useMemo(() => {
        if (!periodAverage || periodAverage === 0) return [];

        // Round to nearest 1000 for cleaner reference values
        const roundToNearest = (value: number, nearest: number) => {
            return Math.round(value / nearest) * nearest;
        };

        const refValue1 = roundToNearest(periodAverage * 0.5, 1000);
        const refValue2 = roundToNearest(periodAverage * 1.5, 1000);

        const lines = [];
        if (refValue1 > 0) {
            lines.push({
                value: refValue1,
                label: refValue1.toLocaleString(),
            });
        }
        if (refValue2 > 0 && refValue2 !== refValue1) {
            lines.push({
                value: refValue2,
                label: refValue2.toLocaleString(),
            });
        }

        return lines;
    }, [periodAverage]);

    const goToToday = () => {
        setSelectedDate(new Date());
    };

    // Generate title based on current interval
    const pageTitle = useMemo(() => {
        return getIntervalTitle(selectedInterval);
    }, [selectedInterval]);

    // Notify parent when selected date changes
    useEffect(() => {
        if (onDateChange) {
            onDateChange(selectedDate);
        }
    }, [selectedDate, onDateChange]);

    return (
        <>
            <View style={{ marginBottom: 16 }}>
                <ToggleSwitch
                    data={[
                        { value: "24hours", label: get24HoursLabel },
                        { value: "7days", label: "7 Days" },
                        { value: "31days", label: "31 Days" },
                        { value: "12months", label: "12 Months" },
                    ]}
                    selectedValue={selectedInterval}
                    onChange={(value) =>
                        setSelectedInterval(value as IntervalType)
                    }
                />
            </View>

            {/* Date navigation for 24hours mode */}
            {selectedInterval === "24hours" && (
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 12,
                        paddingHorizontal: 20,
                    }}
                >
                    <TouchableOpacity
                        onPress={goToToday}
                        style={{ flex: 1, alignItems: "center" }}
                    >
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: "600",
                                color: isToday ? "#22C55E" : "#333",
                            }}
                        >
                            {formatFullDate(selectedDate)}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Page title for non-24hours modes */}
            {selectedInterval !== "24hours" && (
                <View
                    style={{
                        alignItems: "center",
                        marginBottom: 12,
                        paddingHorizontal: 4,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: "#333",
                            textAlign: "center",
                        }}
                    >
                        {pageTitle}
                    </Text>
                </View>
            )}

            <IntervalBarChart
                data={chartData}
                intervalType={selectedInterval}
                showAverageLine={true}
                averageValue={periodAverage}
                averageLineColor="#22b5c5ff"
                selectionLineColor="#5feb9eff"
                barColor="#22C55E"
                buffer={10}
                barWidth={barWidth}
                barGap={barGap}
                referenceLines={referenceLines}
            />
        </>
    );
}
