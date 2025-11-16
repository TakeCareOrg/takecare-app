import { useMemo } from "react";

import { INTERVAL_CONFIGS, IntervalType } from "../constants";
import {
    IntervalBarDataItem,
    ProcessedIntervalBarDataItem,
} from "../types/chart-types";

interface UseIntervalDataProps {
    data: IntervalBarDataItem[];
    intervalType: IntervalType;
    emptyBarColor?: string;
}

/**
 * Hook to process interval data and ensure all intervals are present
 * Handles different interval types: 24hours, 7days, 31days, 12months
 */
export const useIntervalData = ({
    data,
    intervalType,
    emptyBarColor = "#2A2A2A",
}: UseIntervalDataProps) => {
    const processedData = useMemo(() => {
        // For 7days, 31days, and 12months, use the actual data order instead of static config
        if (
            intervalType === "7days" ||
            intervalType === "31days" ||
            intervalType === "12months"
        ) {
            // Just return the data as-is since it's already in the correct order
            return data.map((item) => ({
                day: item.label,
                value: item.value,
                color: item.color || "#5B7BFB",
                intervalKey: item.intervalKey,
            }));
        }

        // For 24hours, use the static config to ensure all hours are present
        const config = INTERVAL_CONFIGS[intervalType];
        const dataMap = new Map();

        // Map existing data by intervalKey
        data.forEach((item) => {
            dataMap.set(item.intervalKey, item);
        });

        // Create complete dataset with all intervals
        const result: ProcessedIntervalBarDataItem[] = config.keys.map(
            (key: string, index: number) => {
                const existingData = dataMap.get(key);

                if (existingData) {
                    return {
                        day: config.labels[index], // Use config label for consistency
                        value: existingData.value,
                        color: existingData.color || "#5B7BFB",
                        intervalKey: existingData.intervalKey,
                    };
                } else {
                    return {
                        day: config.labels[index],
                        value: 0,
                        color: emptyBarColor,
                        intervalKey: key,
                    };
                }
            },
        );

        return result;
    }, [intervalType, data, emptyBarColor]);

    return { processedData };
};
