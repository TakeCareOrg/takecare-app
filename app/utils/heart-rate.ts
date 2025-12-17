import { HeartRateValue } from "@app/types/health-data-types";

import { safeFormatDate } from "./date";

export interface HourlyHeartRateData {
    hour: number;
    value: number; // average
    min: number;
    max: number;
    timestamp: string;
    label: string;
    count: number;
}

/**
 * Aggregate heart rate data by hour for a specific day
 * @param heartRateValues - Array of heart rate values
 * @param targetDate - The date to aggregate data for
 * @returns Array of hourly averaged heart rate data
 */
export function aggregateHeartRateByHour(
    heartRateValues: HeartRateValue[] | null | undefined,
    targetDate: Date,
): HourlyHeartRateData[] {
    if (!heartRateValues || heartRateValues.length === 0) {
        return [];
    }

    const targetDateStr = safeFormatDate(targetDate);

    // Filter data for the target date and group by hour
    const hourlyDataMap = new Map<
        number,
        {
            total: number;
            count: number;
            min: number;
            max: number;
            timestamps: string[];
        }
    >();

    heartRateValues.forEach((rate) => {
        if (!rate.startDate) return;

        const date = new Date(rate.startDate);
        const dateStr = safeFormatDate(date);

        // Only include data from the target date
        if (dateStr !== targetDateStr) return;

        const hour = date.getHours();
        const current = hourlyDataMap.get(hour);

        if (current) {
            hourlyDataMap.set(hour, {
                total: current.total + rate.value,
                count: current.count + 1,
                min: Math.min(current.min, rate.value),
                max: Math.max(current.max, rate.value),
                timestamps: [...current.timestamps, rate.startDate],
            });
        } else {
            hourlyDataMap.set(hour, {
                total: rate.value,
                count: 1,
                min: rate.value,
                max: rate.value,
                timestamps: [rate.startDate],
            });
        }
    });

    // Convert to array format, filling missing hours with 0
    const result: HourlyHeartRateData[] = [];

    for (let hour = 0; hour < 24; hour++) {
        const data = hourlyDataMap.get(hour);

        if (data) {
            const avgValue = Math.round(data.total / data.count);
            const timestamp = new Date(targetDate);
            timestamp.setHours(hour, 0, 0, 0);

            result.push({
                hour,
                value: avgValue,
                min: data.min,
                max: data.max,
                timestamp: timestamp.toISOString(),
                label: `${hour}:00`,
                count: data.count,
            });
        } else {
            // Fill missing hours with 0
            const timestamp = new Date(targetDate);
            timestamp.setHours(hour, 0, 0, 0);

            result.push({
                hour,
                value: 0,
                min: 0,
                max: 0,
                timestamp: timestamp.toISOString(),
                label: `${hour}:00`,
                count: 0,
            });
        }
    }

    return result;
}
