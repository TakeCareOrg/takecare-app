import { useMemo } from "react";

import { BarDataItem } from "@app/components/ui/chart/daily-bar-chart/progress-bars";
import { LineChartDataPoint } from "@app/components/ui/chart/line-chart";
import { HealthData } from "@app/types/health-data-types";
import { safeFormatDate } from "@app/utils/date";
import { aggregateHeartRateByHour } from "@app/utils/heart-rate";

interface UseHeartRateDataParams {
    heartRate: HealthData["heartRate"] | undefined;
    selectedDate: Date;
}

interface HeartRateStats {
    todayMin: number;
    todayMax: number;
    todayAverage: number;
}

export function useHeartRateData({
    heartRate,
    selectedDate,
}: UseHeartRateDataParams) {
    // Daily chart data
    const chartData = useMemo(() => {
        if (!heartRate?.values || heartRate.values.length === 0) {
            return [];
        }

        // Group by day and calculate average
        const dailyHeartRateMap = new Map<
            string,
            { total: number; count: number; date: Date }
        >();

        heartRate.values.forEach((rate) => {
            if (!rate.startDate) return;
            const date = new Date(rate.startDate);
            const dayKey = safeFormatDate(date);
            const current = dailyHeartRateMap.get(dayKey) || {
                total: 0,
                count: 0,
                date,
            };

            dailyHeartRateMap.set(dayKey, {
                total: current.total + rate.value,
                count: current.count + 1,
                date: current.date,
            });
        });

        // Convert to chart format with average values
        return Array.from(dailyHeartRateMap.entries())
            .map(([dateStr, { total, count, date }]) => ({
                id: `heartRate-${dateStr}`,
                day: date.getDate().toString(),
                value: Math.round(total / count),
                startDate: date.toISOString(),
            }))
            .sort(
                (a, b) =>
                    new Date(a.startDate).getTime() -
                    new Date(b.startDate).getTime(),
            );
    }, [heartRate]);

    // Hourly heart rate data for the selected date
    const hourlyHeartRateData = useMemo(() => {
        if (!heartRate?.values || heartRate.values.length === 0) {
            return [];
        }

        const hourlyData = aggregateHeartRateByHour(
            heartRate.values,
            selectedDate,
        );

        // Filter out hours with no data (value = 0)
        const result: LineChartDataPoint[] = hourlyData
            .filter((data) => data.count > 0)
            .map((data) => ({
                value: data.value,
                min: data.min,
                max: data.max,
                timestamp: data.timestamp,
                label: data.label,
            }));

        return result;
    }, [heartRate, selectedDate]);

    // Calculate today's range statistics
    const todayStats = useMemo((): HeartRateStats | null => {
        if (hourlyHeartRateData.length === 0) {
            return null;
        }

        const todayMin = Math.min(
            ...hourlyHeartRateData.map((d) => d.min || d.value),
        );
        const todayMax = Math.max(
            ...hourlyHeartRateData.map((d) => d.max || d.value),
        );
        const todayAverage = Math.round(
            hourlyHeartRateData.reduce((sum, d) => sum + d.value, 0) /
                hourlyHeartRateData.length,
        );

        return {
            todayMin,
            todayMax,
            todayAverage,
        };
    }, [hourlyHeartRateData]);

    return {
        chartData,
        hourlyHeartRateData,
        todayStats,
    };
}

export type { BarDataItem, HeartRateStats };
