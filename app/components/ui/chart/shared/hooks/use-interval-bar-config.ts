import { useMemo } from "react";

import {
    BAR_GAP,
    BAR_WIDTH,
    IntervalType,
    RIGHT_PADDING_WIDTH,
} from "../constants";
import { BarConfig } from "../types/chart-types";

interface UseIntervalBarConfigProps {
    intervalType: IntervalType;
    viewportWidth: number;
    customBarWidth?: number;
    customBarGap?: number;
}

/**
 * Hook to calculate dynamic bar configuration based on interval type
 * For 24hours: dynamically calculates bar sizes to fit all bars on screen
 * For other types: uses standard bar sizes
 */
export const useIntervalBarConfig = ({
    intervalType,
    viewportWidth,
    customBarWidth,
    customBarGap,
}: UseIntervalBarConfigProps): BarConfig => {
    return useMemo(() => {
        // If custom bar dimensions are provided, use them
        if (customBarWidth !== undefined && customBarGap !== undefined) {
            return {
                barWidth: customBarWidth,
                barGap: customBarGap,
                barActualWidth: Math.max(2, customBarWidth - 2),
            };
        }

        if (intervalType === "24hours") {
            if (viewportWidth > 0) {
                const availableWidth = viewportWidth - RIGHT_PADDING_WIDTH - 5; // Minimal margin
                const totalBars = 24;

                const totalWidthPerBar = availableWidth / totalBars;
                const barGap = Math.max(1, Math.floor(totalWidthPerBar * 0.15)); // 15% for gaps
                const barWidth = Math.floor(totalWidthPerBar);
                const barActualWidth = Math.max(2, barWidth - barGap); // Minimum 2px visible width

                return {
                    barWidth,
                    barGap,
                    barActualWidth,
                };
            } else {
                // Fallback when viewportWidth not available yet
                return {
                    barWidth: 12,
                    barGap: 1,
                    barActualWidth: 8,
                };
            }
        } else {
            // For other intervals: use standard sizes from constants
            return {
                barWidth: BAR_WIDTH,
                barGap: BAR_GAP,
                barActualWidth: 10,
            };
        }
    }, [intervalType, viewportWidth, customBarWidth, customBarGap]);
};
