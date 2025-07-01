import { eachDayOfInterval, format, parseISO } from "date-fns";

import { getDynamicColor } from "./chart-utils";

export interface BaseBarDataItem {
    value: number;
    color?: string;
}

export interface DailyBarDataItem extends BaseBarDataItem {
    day: string;
    startDate?: string;
}

export interface IntervalBarDataItem extends BaseBarDataItem {
    label: string;
    intervalKey: string;
}

/**
 * Fill missing days in daily data with empty entries
 */
export const fillMissingDays = <T extends DailyBarDataItem>(
    data: T[],
    emptyDayColor: string,
    dynamicColors?: {
        belowFirstReference: string;
        aboveFirstReference: string;
        aboveSecondReference?: string;
    },
    referenceLines: { value: number; label: string }[] = [],
): T[] => {
    if (!data || data.length === 0) {
        return data;
    }

    const dataWithDates = data.filter(
        (item) => "startDate" in item && item.startDate,
    );

    if (dataWithDates.length === 0) {
        return data.map((item) => ({
            ...item,
            color: getDynamicColor(
                item.value,
                item.color,
                dynamicColors,
                referenceLines,
            ),
        }));
    }

    // Sort data by date to ensure chronological order
    const sortedData = [...dataWithDates].sort(
        (a, b) =>
            new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime(),
    );

    const firstDate = parseISO(sortedData[0].startDate!);
    const lastDate = new Date();

    const dataMap = new Map();
    dataWithDates.forEach((item) => {
        const dateKey = format(parseISO(item.startDate!), "yyyy-MM-dd");
        dataMap.set(dateKey, item);
    });

    const allDays = eachDayOfInterval({
        start: firstDate,
        end: lastDate,
    });

    const result = allDays.map((date) => {
        const dateKey = format(date, "yyyy-MM-dd");
        const existingData = dataMap.get(dateKey);

        if (existingData) {
            return {
                ...existingData,
                color: getDynamicColor(
                    existingData.value,
                    existingData.color,
                    dynamicColors,
                    referenceLines,
                ),
            };
        } else {
            return {
                day: format(date, "dd"),
                value: 0,
                color: emptyDayColor,
                startDate: format(date, "yyyy-MM-dd"),
            } as T;
        }
    });

    return result;
};

/**
 * Fill missing intervals in interval data with empty entries
 */
export const fillMissingIntervals = (
    data: IntervalBarDataItem[],
    intervalLabels: string[],
    intervalKeys: string[],
    emptyBarColor: string,
    dynamicColors?: {
        belowFirstReference: string;
        aboveFirstReference: string;
        aboveSecondReference?: string;
    },
    referenceLines: { value: number; label: string }[] = [],
): IntervalBarDataItem[] => {
    const dataMap = new Map<string, IntervalBarDataItem>();

    // Map existing data by interval key
    data.forEach((item) => {
        dataMap.set(item.intervalKey, item);
    });

    // Create full interval data with missing intervals filled
    return intervalLabels.map((label, index) => {
        const intervalKey = intervalKeys[index];
        const existingData = dataMap.get(intervalKey);

        if (existingData) {
            return {
                ...existingData,
                color: getDynamicColor(
                    existingData.value,
                    existingData.color,
                    dynamicColors,
                    referenceLines,
                ),
            };
        } else {
            return {
                label,
                value: 0,
                color: emptyBarColor,
                intervalKey,
            };
        }
    });
};

/**
 * Get interval configuration for different interval types
 */
export const getIntervalConfig = (
    intervalType: "hours" | "weekdays" | "months",
) => {
    const configs = {
        hours: {
            labels: Array.from({ length: 24 }, (_, i) =>
                i.toString().padStart(2, "0"),
            ),
            keys: Array.from({ length: 24 }, (_, i) => i.toString()),
        },
        weekdays: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            keys: [
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday",
            ],
        },
        months: {
            labels: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ],
            keys: [
                "january",
                "february",
                "march",
                "april",
                "may",
                "june",
                "july",
                "august",
                "september",
                "october",
                "november",
                "december",
            ],
        },
    };

    return configs[intervalType];
};
