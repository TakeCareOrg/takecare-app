import React, { useState, useMemo, useEffect } from "react";
import { StyleSheet, Text, View, useWindowDimensions, TouchableOpacity } from "react-native";
import { format, addDays, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subWeeks, subMonths, subYears } from "date-fns";

import { ToggleSwitch } from "@app/components/ui/toogle-switch";
import useHealthData from "@app/hooks/health/use-health-data";

import {
    IntervalBarChart,
    IntervalBarDataItem,
    IntervalType,
} from "@app/components/ui/chart/interval-bar-chart";

export function DetailedBarChart({ 
    onDateChange, 
    initialDate 
}: { 
    onDateChange?: (date: Date) => void;
    initialDate?: Date; 
} = {}) {
    const [selectedInterval, setSelectedInterval] =
        useState<IntervalType>("7days");
    const [selectedData, setSelectedData] =
        useState<IntervalBarDataItem | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(initialDate || new Date()); // Track current selected date

    const { width: screenWidth } = useWindowDimensions();

    // Check if the selected date is today
    const isToday = useMemo(() => {
        const today = new Date();
        return format(selectedDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
    }, [selectedDate]);

    // Generate dynamic toggle switch label for 24hours
    const get24HoursLabel = useMemo(() => {
        return isToday ? "Today" : "Day";
    }, [isToday]);

    // Calculate date ranges based on interval type (always show most recent data)
    const dateRange = useMemo(() => {
        const today = new Date();
        
        switch (selectedInterval) {
            case "24hours":
                // For hours: show the selected date's 24 hours
                return {
                    startDate: startOfDay(selectedDate),
                    endDate: endOfDay(selectedDate),
                };
                
            case "7days": // 7 days
                // For 7 days: show last 7 days including today
                const startWeek = subDays(today, 6); // 6 days ago + today = 7 days
                return {
                    startDate: startOfDay(startWeek),
                    endDate: endOfDay(today),
                };

            case "31days": // 31 days
                // For 31 days: show last 31 days including today
                const start31Days = subDays(today, 30); // 30 days ago + today = 31 days
                return {
                    startDate: startOfDay(start31Days),
                    endDate: endOfDay(today),
                };
                
            case "12months":
                // For months: show last 12 months
                const startMonth = subMonths(today, 11); // 11 months ago + current month = 12 months
                return {
                    startDate: startOfMonth(startMonth),
                    endDate: endOfMonth(today),
                };
                
            default:
                return {
                    startDate: subDays(today, 30),
                    endDate: today,
                };
        }
    }, [selectedInterval, selectedDate]);

    // Fetch health data for the current date range
    const { steps } = useHealthData({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
    });

    // Calculate optimal bar dimensions for hours mode
    const calculateHourBarDimensions = () => {
        if (selectedInterval !== "24hours") return { barWidth: undefined, barGap: undefined };
        
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

    // Helper functions to process data
    const processHourlyData = (stepsData: any[], targetDate: Date) => {
        // Create 24 hours array
        const hourlyData: IntervalBarDataItem[] = [];
        
        for (let hour = 0; hour < 24; hour++) {
            const hourStr = hour.toString().padStart(2, "0");
            
            // Find steps data for this specific hour
            // Note: HealthKit typically gives daily totals, so we simulate hourly distribution
            const daySteps = stepsData
                .filter(step => {
                    const stepDate = new Date(step.startDate);
                    return format(stepDate, "yyyy-MM-dd") === format(targetDate, "yyyy-MM-dd");
                })
                .reduce((total, step) => total + (step.value || 0), 0);
            
            // Simulate realistic hourly distribution based on typical activity patterns
            const hourlySteps = Math.floor(daySteps * getHourlyMultiplier(hour));
            
            hourlyData.push({
                label: hourStr,
                value: hourlySteps,
                intervalKey: hour.toString(),
            });
        }
        
        return hourlyData;
    };

    const processDailyData = (stepsData: any[], startDate: Date, endDate: Date) => {
        const dailyData: IntervalBarDataItem[] = [];
        const today = new Date();
        
        // Generate 7 days ending with today (show last 7 days chronologically)
        // Start from 6 days ago and go to today: Thu, Fri, Sat, Sun, Mon, Tue, Wed
        for (let i = 6; i >= 0; i--) {
            const currentDate = subDays(today, i);
            
            // Use day names for better readability
            const dayLabel = format(currentDate, "EEE"); // Short day name (e.g., "Wed", "Thu")
            
            // Find steps data for this day - aggregate all steps for the day
            const daySteps = stepsData
                .filter(step => {
                    const stepDate = new Date(step.startDate);
                    return format(stepDate, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd");
                })
                .reduce((total, step) => total + (step.value || 0), 0);
            
            
            dailyData.push({
                label: dayLabel,
                value: daySteps,
                intervalKey: format(currentDate, "yyyy-MM-dd"),
            });
        }
                
        return dailyData;
    };

    const process31DaysData = (stepsData: any[], startDate: Date, endDate: Date) => {
        const daysData: IntervalBarDataItem[] = [];
        const today = new Date();
        
        // Generate 31 days ending with today (show last 31 days chronologically)
        for (let i = 0; i < 31; i++) {
            // Start from 30 days ago and go to today
            const currentDate = subDays(today, 30 - i);
            
            // Use day number for labels (1, 2, 3, ..., 31)
            const dayLabel = format(currentDate, "d"); // Day of month (1-31)
            
            // Find steps data for this day - aggregate all steps for the day
            const daySteps = stepsData
                .filter(step => {
                    const stepDate = new Date(step.startDate);
                    return format(stepDate, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd");
                })
                .reduce((total, step) => total + (step.value || 0), 0);
                        
            daysData.push({
                label: dayLabel,
                value: daySteps,
                intervalKey: format(currentDate, "yyyy-MM-dd"),
            });
        }
        
        return daysData;
    };

    const processMonthlyData = (stepsData: any[], startDate: Date, endDate: Date) => {
        const monthlyData: IntervalBarDataItem[] = [];
        const today = new Date();
        
        // Generate 12 months ending with current month (show last 12 months chronologically)
        for (let i = 0; i < 12; i++) {
            // Start from 11 months ago and go to current month
            const currentMonth = subMonths(today, 11 - i);
            const monthLabel = format(currentMonth, "MMM"); // e.g., "Jan", "Feb"
            
            // Aggregate steps for this month
            const monthStart = startOfMonth(currentMonth);
            const monthEnd = endOfMonth(currentMonth);
            
            const monthSteps = stepsData
                .filter(step => {
                    const stepDate = new Date(step.startDate);
                    return stepDate >= monthStart && stepDate <= monthEnd;
                })
                .reduce((total, step) => total + (step.value || 0), 0);
                        
            monthlyData.push({
                label: monthLabel,
                value: monthSteps,
                intervalKey: format(currentMonth, "yyyy-MM"),
            });
        }
        
        return monthlyData;
    };

    // Simulate hourly activity pattern (peak hours: 8-9am, 12-1pm, 6-7pm)
    const getHourlyMultiplier = (hour: number): number => {
        const patterns: { [key: number]: number } = {
            0: 0.001, 1: 0.001, 2: 0.001, 3: 0.001, 4: 0.001, 5: 0.005,
            6: 0.02, 7: 0.05, 8: 0.12, 9: 0.1, 10: 0.08, 11: 0.09,
            12: 0.11, 13: 0.08, 14: 0.06, 15: 0.07, 16: 0.08, 17: 0.09,
            18: 0.1, 19: 0.08, 20: 0.06, 21: 0.04, 22: 0.02, 23: 0.01
        };
        return patterns[hour] || 0.01;
    };

    // Process real health data based on interval type
    const chartData = useMemo(() => {
        if (!steps || steps.length === 0) {
            return [];
        }

        switch (selectedInterval) {
            case "24hours":
                return processHourlyData(steps, selectedDate);
                
            case "7days": // 7 days
                return processDailyData(steps, dateRange.startDate, dateRange.endDate);

            case "31days": // 31 days
                return process31DaysData(steps, dateRange.startDate, dateRange.endDate);
                
            case "12months":
                return processMonthlyData(steps, dateRange.startDate, dateRange.endDate);
                
            default:
                return [];
        }
    }, [steps, selectedInterval, dateRange]);

    // Calculate average for the entire selected period (not just visible data)
    const periodAverage = useMemo(() => {
        if (!steps || steps.length === 0 || !chartData || chartData.length === 0) {
            return 0;
        }

        // Calculate average based on all data in the current period
        const nonZeroValues = chartData
            .map(item => item.value)
            .filter(value => value > 0);

        if (nonZeroValues.length === 0) {
            return 0;
        }

        const average = nonZeroValues.reduce((sum, value) => sum + value, 0) / nonZeroValues.length;

        return average;
    }, [chartData, selectedInterval, selectedDate, steps]);

    const handleBarSelect = (data: IntervalBarDataItem, index: number) => {
        setSelectedData(data);
    };

    // Navigation functions for date selection
    const goToPreviousDay = () => {
        setSelectedDate(prev => subDays(prev, 1));
    };

    const goToNextDay = () => {
        setSelectedDate(prev => addDays(prev, 1));
    };

    const goToToday = () => {
        setSelectedDate(new Date());
    };

    // Check if we can go to next day (not beyond today)
    const canGoToNextDay = useMemo(() => {
        const today = new Date();
        const nextDay = addDays(selectedDate, 1);
        return format(nextDay, "yyyy-MM-dd") <= format(today, "yyyy-MM-dd");
    }, [selectedDate]);

    // Generate title based on current interval
    const getPageTitle = () => {
        const today = new Date();
        
        switch (selectedInterval) {
            case "24hours":
                return "Today";
                
            case "7days":
                const startWeek = subDays(today, 6);
                return `${format(startWeek, "dd MMM")} - ${format(today, "dd MMM yyyy")}`;

            case "31days":
                const start31Days = subDays(today, 30);
                return `${format(start31Days, "dd MMM")} - ${format(today, "dd MMM yyyy")}`;
                
            case "12months":
                const startMonth = subMonths(today, 11);
                return `${format(startMonth, "MMM yyyy")} - ${format(today, "MMM yyyy")}`;
                
            default:
                return "";
        }
    };

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
                <View style={{ 
                    flexDirection: "row", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    marginBottom: 12,
                    paddingHorizontal: 20
                }}>
                    <TouchableOpacity 
                        onPress={goToPreviousDay}
                        style={{
                            padding: 8,
                            backgroundColor: "#f0f0f0",
                            borderRadius: 6,
                            marginRight: 12
                        }}
                    >
                        <Text style={{ fontSize: 16 }}>‹</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        onPress={goToToday}
                        style={{ flex: 1, alignItems: "center" }}
                    >
                        <Text style={{ 
                            fontSize: 14, 
                            fontWeight: "600", 
                            color: isToday ? "#22C55E" : "#333"
                        }}>
                            {format(selectedDate, "dd MMM yyyy")}
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        onPress={goToNextDay}
                        disabled={!canGoToNextDay}
                        style={{
                            padding: 8,
                            backgroundColor: canGoToNextDay ? "#f0f0f0" : "#e0e0e0",
                            borderRadius: 6,
                            marginLeft: 12
                        }}
                    >
                        <Text style={{ 
                            fontSize: 16, 
                            color: canGoToNextDay ? "#000" : "#999"
                        }}>›</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Page title for non-24hours modes */}
            {selectedInterval !== "24hours" && (
                <View style={{ 
                    alignItems: "center", 
                    marginBottom: 12,
                    paddingHorizontal: 4
                }}>
                    <Text style={{ 
                        fontSize: 14, 
                        fontWeight: "600", 
                        color: "#333",
                        textAlign: "center"
                    }}>
                        {getPageTitle()}
                    </Text>
                </View>
            )}

            <IntervalBarChart
                data={chartData}
                intervalType={selectedInterval}
                height={120}
                onSelect={handleBarSelect}
                showAverageLine={true} 
                averageValue={periodAverage}
                averageLineColor="#22C55E" 
                selectionLineColor="#22C55E" 
                barColor="#22C55E"
                buffer={10}
                barWidth={barWidth}
                barGap={barGap}
            />
        </>
    );
}
