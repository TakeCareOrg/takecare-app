import {
    endOfDay,
    endOfMonth,
    format,
    startOfDay,
    startOfMonth,
    subDays,
    subMonths,
} from "date-fns";

import { IntervalType } from "../shared";

export interface DateRange {
    startDate: Date;
    endDate: Date;
}

/**
 * Calculate date ranges based on interval type
 * Always shows the most recent data
 */
export const calculateDateRange = (
    intervalType: IntervalType,
    selectedDate: Date,
): DateRange => {
    const today = new Date();

    switch (intervalType) {
        case "24hours":
            // For hours: show the selected date's 24 hours
            return {
                startDate: startOfDay(selectedDate),
                endDate: endOfDay(selectedDate),
            };

        case "7days": {
            // For 7 days: show last 7 days including today
            const startWeek = subDays(today, 6); // 6 days ago + today = 7 days
            return {
                startDate: startOfDay(startWeek),
                endDate: endOfDay(today),
            };
        }

        case "31days": {
            // For 31 days: show last 31 days including today
            const start31Days = subDays(today, 30); // 30 days ago + today = 31 days
            return {
                startDate: startOfDay(start31Days),
                endDate: endOfDay(today),
            };
        }

        case "12months": {
            // For months: show last 12 months
            const startMonth = subMonths(today, 11); // 11 months ago + current month = 12 months
            return {
                startDate: startOfMonth(startMonth),
                endDate: endOfMonth(today),
            };
        }

        default:
            return {
                startDate: subDays(today, 30),
                endDate: today,
            };
    }
};

/**
 * Generate formatted title for the current interval
 */
export const getIntervalTitle = (intervalType: IntervalType): string => {
    const today = new Date();

    switch (intervalType) {
        case "24hours":
            return "Today";

        case "7days": {
            const startWeek = subDays(today, 6);
            return `${format(startWeek, "dd MMM")} - ${format(today, "dd MMM yyyy")}`;
        }

        case "31days": {
            const start31Days = subDays(today, 30);
            return `${format(start31Days, "dd MMM")} - ${format(today, "dd MMM yyyy")}`;
        }

        case "12months": {
            const startMonth = subMonths(today, 11);
            return `${format(startMonth, "MMM yyyy")} - ${format(today, "MMM yyyy")}`;
        }

        default:
            return "";
    }
};
