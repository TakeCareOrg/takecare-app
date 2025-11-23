import { endOfMonth, format, startOfMonth, subDays, subMonths } from "date-fns";

import { BasesHealthValue } from "@app/types/health-data-types";

import { IntervalBarDataItem, IntervalType } from "../shared";

/**
 * Simulate hourly activity pattern (peak hours: 8-9am, 12-1pm, 6-7pm)
 * Returns a multiplier representing the percentage of daily steps for each hour
 */
const getHourlyMultiplier = (hour: number): number => {
    const patterns: { [key: number]: number } = {
        0: 0.001,
        1: 0.001,
        2: 0.001,
        3: 0.001,
        4: 0.001,
        5: 0.005,
        6: 0.02,
        7: 0.05,
        8: 0.12,
        9: 0.1,
        10: 0.08,
        11: 0.09,
        12: 0.11,
        13: 0.08,
        14: 0.06,
        15: 0.07,
        16: 0.08,
        17: 0.09,
        18: 0.1,
        19: 0.08,
        20: 0.06,
        21: 0.04,
        22: 0.02,
        23: 0.01,
    };
    return patterns[hour] || 0.01;
};

/**
 * Process health data into hourly intervals
 * Note: HealthKit typically gives daily totals, so we simulate hourly distribution
 */
export const processHourlyData = (
    stepsData: BasesHealthValue[],
    targetDate: Date,
): IntervalBarDataItem[] => {
    const hourlyData: IntervalBarDataItem[] = [];

    for (let hour = 0; hour < 24; hour++) {
        const hourStr = hour.toString().padStart(2, "0");

        // Find steps data for this specific hour
        const daySteps = stepsData
            .filter((step) => {
                const stepDate = new Date(step.startDate);
                return (
                    format(stepDate, "yyyy-MM-dd") ===
                    format(targetDate, "yyyy-MM-dd")
                );
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

/**
 * Process health data into daily intervals (7 days)
 * Shows last 7 days chronologically ending with today
 */
export const processDailyData = (
    stepsData: BasesHealthValue[],
): IntervalBarDataItem[] => {
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
            .filter((step) => {
                const stepDate = new Date(step.startDate);
                return (
                    format(stepDate, "yyyy-MM-dd") ===
                    format(currentDate, "yyyy-MM-dd")
                );
            })
            .reduce(
                (total, step) => total + (Number(step.value.toFixed(0)) || 0),
                0,
            );

        dailyData.push({
            label: dayLabel,
            value: daySteps,
            intervalKey: format(currentDate, "yyyy-MM-dd"),
        });
    }

    return dailyData;
};

/**
 * Process health data into daily intervals (31 days)
 * Shows last 31 days chronologically ending with today
 */
export const process31DaysData = (
    stepsData: BasesHealthValue[],
): IntervalBarDataItem[] => {
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
            .filter((step) => {
                const stepDate = new Date(step.startDate);
                return (
                    format(stepDate, "yyyy-MM-dd") ===
                    format(currentDate, "yyyy-MM-dd")
                );
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

/**
 * Process health data into monthly intervals (12 months)
 * Shows last 12 months chronologically ending with current month
 */
export const processMonthlyData = (
    stepsData: BasesHealthValue[],
): IntervalBarDataItem[] => {
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
            .filter((step) => {
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

/**
 * Process health data based on interval type
 */
export const processHealthDataByInterval = (
    stepsData: BasesHealthValue[],
    intervalType: IntervalType,
    selectedDate: Date,
): IntervalBarDataItem[] => {
    if (!stepsData || stepsData.length === 0) {
        return [];
    }

    switch (intervalType) {
        case "24hours":
            return processHourlyData(stepsData, selectedDate);

        case "7days":
            return processDailyData(stepsData);

        case "31days":
            return process31DaysData(stepsData);

        case "12months":
            return processMonthlyData(stepsData);

        default:
            return [];
    }
};

/**
 * Calculate average value for the current period
 * Excludes zero values from the calculation
 */
export const calculatePeriodAverage = (
    chartData: IntervalBarDataItem[],
): number => {
    if (!chartData || chartData.length === 0) {
        return 0;
    }

    const nonZeroValues = chartData
        .map((item) => item.value)
        .filter((value) => value > 0);

    if (nonZeroValues.length === 0) {
        return 0;
    }

    const average =
        nonZeroValues.reduce((sum, value) => sum + value, 0) /
        nonZeroValues.length;

    return average;
};
