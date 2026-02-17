import { format, subDays, subMonths } from "date-fns";

import { BasesHealthValue } from "@app/types/health-data-types";
import { safeFormatDate } from "@app/utils/date";

import { IntervalBarDataItem, IntervalType } from "../shared";

/**
 * Build a Map<dateKey, totalSteps> from raw health data in a single O(n) pass.
 * Used by daily/31-day/hourly processors to avoid O(n*m) filtering.
 */
const buildStepsByDateMap = (
    stepsData: BasesHealthValue[],
): Map<string, number> => {
    const map = new Map<string, number>();
    for (const step of stepsData) {
        if (!step.startDate || !step.value) continue;
        const key = safeFormatDate(new Date(step.startDate));
        map.set(key, (map.get(key) || 0) + step.value);
    }
    return map;
};

/**
 * Build a Map<"yyyy-MM", totalSteps> from raw health data in a single O(n) pass.
 * Used by the monthly processor.
 */
const buildStepsByMonthMap = (
    stepsData: BasesHealthValue[],
): Map<string, number> => {
    const map = new Map<string, number>();
    for (const step of stepsData) {
        if (!step.startDate || !step.value) continue;
        const key = format(new Date(step.startDate), "yyyy-MM");
        map.set(key, (map.get(key) || 0) + step.value);
    }
    return map;
};

/**
 * Process health data into hourly intervals.
 * Single O(n) pass to get the day total, then distribute across hours.
 * For today's date, hours in the future are set to 0.
 */
export const processHourlyData = (
    stepsData: BasesHealthValue[],
    targetDate: Date,
): IntervalBarDataItem[] => {
    const targetKey = safeFormatDate(targetDate);

    // Build a Map<hour, totalSteps> for the target date in a single pass
    const stepsByHour = new Map<number, number>();
    for (const step of stepsData) {
        if (!step.startDate || !step.value) continue;
        const stepDate = new Date(step.startDate);
        if (safeFormatDate(stepDate) !== targetKey) continue;
        const hour = stepDate.getHours();
        stepsByHour.set(hour, (stepsByHour.get(hour) || 0) + step.value);
    }

    const now = new Date();
    const isToday = targetKey === safeFormatDate(now);
    const currentHour = now.getHours();

    const hourlyData: IntervalBarDataItem[] = [];
    for (let hour = 0; hour < 24; hour++) {
        const isFutureHour = isToday && hour > currentHour;
        hourlyData.push({
            label: hour.toString().padStart(2, "0"),
            value: isFutureHour ? 0 : stepsByHour.get(hour) || 0,
            intervalKey: hour.toString(),
        });
    }
    return hourlyData;
};

/**
 * Process health data into daily intervals (7 days).
 * Single O(n) indexing pass + O(7) lookups.
 */
export const processDailyData = (
    stepsData: BasesHealthValue[],
): IntervalBarDataItem[] => {
    const stepsByDate = buildStepsByDateMap(stepsData);
    const today = new Date();
    const dailyData: IntervalBarDataItem[] = [];

    for (let i = 6; i >= 0; i--) {
        const currentDate = subDays(today, i);
        const dateKey = safeFormatDate(currentDate);
        const dayLabel = format(currentDate, "EEE");

        dailyData.push({
            label: dayLabel,
            value: Math.round(stepsByDate.get(dateKey) || 0),
            intervalKey: dateKey,
        });
    }

    return dailyData;
};

/**
 * Process health data into daily intervals (31 days).
 * Single O(n) indexing pass + O(31) lookups.
 */
export const process31DaysData = (
    stepsData: BasesHealthValue[],
): IntervalBarDataItem[] => {
    const stepsByDate = buildStepsByDateMap(stepsData);
    const today = new Date();
    const daysData: IntervalBarDataItem[] = [];

    for (let i = 0; i < 31; i++) {
        const currentDate = subDays(today, 30 - i);
        const dateKey = safeFormatDate(currentDate);
        const dayLabel = format(currentDate, "d");

        daysData.push({
            label: dayLabel,
            value: stepsByDate.get(dateKey) || 0,
            intervalKey: dateKey,
        });
    }

    return daysData;
};

/**
 * Process health data into monthly intervals (12 months).
 * Single O(n) indexing pass + O(12) lookups.
 */
export const processMonthlyData = (
    stepsData: BasesHealthValue[],
): IntervalBarDataItem[] => {
    const stepsByMonth = buildStepsByMonthMap(stepsData);
    const today = new Date();
    const monthlyData: IntervalBarDataItem[] = [];

    for (let i = 0; i < 12; i++) {
        const currentMonth = subMonths(today, 11 - i);
        const monthKey = format(currentMonth, "yyyy-MM");
        const monthLabel = format(currentMonth, "MMM");

        monthlyData.push({
            label: monthLabel,
            value: stepsByMonth.get(monthKey) || 0,
            intervalKey: monthKey,
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
