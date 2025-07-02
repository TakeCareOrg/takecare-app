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

export function DetailedBarChart() {
    const [selectedInterval, setSelectedInterval] =
        useState<IntervalType>("weekdays");
    const [selectedData, setSelectedData] =
        useState<IntervalBarDataItem | null>(null);

    const { width: screenWidth } = useWindowDimensions();

    // Calculate date ranges based on interval type (always show most recent data)
    const dateRange = useMemo(() => {
        const today = new Date();
        
        switch (selectedInterval) {
            case "hours":
                // For hours: show today's 24 hours
                return {
                    startDate: startOfDay(today),
                    endDate: endOfDay(today),
                };
                
            case "weekdays": // 7 days
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
                
            case "months":
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
    }, [selectedInterval]);

    // Fetch health data for the current date range
    const { steps } = useHealthData({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
    });

    // Calculate optimal bar dimensions for hours mode
    const calculateHourBarDimensions = () => {
        if (selectedInterval !== "hours") return { barWidth: undefined, barGap: undefined };
        
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
        
        console.log("Processing daily data:", {
            startDate: format(startDate, "yyyy-MM-dd"),
            endDate: format(endDate, "yyyy-MM-dd"),
            stepsDataCount: stepsData.length,
            today: format(today, "yyyy-MM-dd EEE")
        });
        
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
            
            console.log(`Day ${format(currentDate, "yyyy-MM-dd")} (${dayLabel}): ${daySteps} steps`);
            
            dailyData.push({
                label: dayLabel,
                value: daySteps,
                intervalKey: format(currentDate, "yyyy-MM-dd"),
            });
        }
        
        console.log("Final daily data order:", dailyData.map(d => d.label).join(", "));
        
        return dailyData;
    };

    const process31DaysData = (stepsData: any[], startDate: Date, endDate: Date) => {
        const daysData: IntervalBarDataItem[] = [];
        const today = new Date();
        
        console.log("Processing 31 days data:", {
            startDate: format(startDate, "yyyy-MM-dd"),
            endDate: format(endDate, "yyyy-MM-dd"),
            stepsDataCount: stepsData.length
        });
        
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
            
            console.log(`Day ${format(currentDate, "yyyy-MM-dd")} (${dayLabel}): ${daySteps} steps`);
            
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
        
        console.log("Processing monthly data:", {
            startDate: format(startDate, "yyyy-MM-dd"),
            endDate: format(endDate, "yyyy-MM-dd"),
            stepsDataCount: stepsData.length
        });
        
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
            
            console.log(`Month ${format(currentMonth, "yyyy-MM")} (${monthLabel}): ${monthSteps} steps`);
            
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
            console.log("DetailedBarChart: No steps data available");
            return [];
        }

        console.log("DetailedBarChart: Processing steps data:", {
            interval: selectedInterval,
            stepsCount: steps.length,
            dateRange: {
                start: format(dateRange.startDate, "yyyy-MM-dd"),
                end: format(dateRange.endDate, "yyyy-MM-dd")
            },
            sampleData: steps.slice(0, 3).map(s => ({
                value: s.value,
                startDate: s.startDate
            }))
        });

        switch (selectedInterval) {
            case "hours":
                return processHourlyData(steps, dateRange.startDate);
                
            case "weekdays": // 7 days
                return processDailyData(steps, dateRange.startDate, dateRange.endDate);

            case "31days": // 31 days
                return process31DaysData(steps, dateRange.startDate, dateRange.endDate);
                
            case "months":
                return processMonthlyData(steps, dateRange.startDate, dateRange.endDate);
                
            default:
                return [];
        }
    }, [steps, selectedInterval, dateRange]);

    const handleBarSelect = (data: IntervalBarDataItem, index: number) => {
        setSelectedData(data);
    };

    // Generate title based on current interval
    const getPageTitle = () => {
        const today = new Date();
        
        switch (selectedInterval) {
            case "hours":
                return format(today, "dd MMM yyyy");
                
            case "weekdays":
                const startWeek = subDays(today, 6);
                return `${format(startWeek, "dd MMM")} - ${format(today, "dd MMM yyyy")}`;

            case "31days":
                const start31Days = subDays(today, 30);
                return `${format(start31Days, "dd MMM")} - ${format(today, "dd MMM yyyy")}`;
                
            case "months":
                const startMonth = subMonths(today, 11);
                return `${format(startMonth, "MMM yyyy")} - ${format(today, "MMM yyyy")}`;
                
            default:
                return "";
        }
    };

    return (
        <>
            <View style={{ marginBottom: 16 }}>
                <ToggleSwitch
                    data={[
                        { value: "hours", label: "Day" },
                        { value: "weekdays", label: "7 Days" },
                        { value: "31days", label: "31 Days" },
                        { value: "months", label: "Months" },
                    ]}
                    selectedValue={selectedInterval}
                    onChange={(value) =>
                        setSelectedInterval(value as IntervalType)
                    }
                />
            </View>

            {/* Page title */}
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

            <IntervalBarChart
                data={chartData}
                intervalType={selectedInterval}
                height={120}
                onSelect={handleBarSelect}
                showAverageLine={true} 
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
