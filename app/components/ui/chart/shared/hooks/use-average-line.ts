import { useMemo } from "react";

import {
    ProcessedIntervalBarDataItem,
    ReferenceLine,
    VisibleIndices,
} from "../types/chart-types";

interface UseAverageLineProps {
    showAverageLine: boolean;
    data: ProcessedIntervalBarDataItem[];
    visibleIndices: VisibleIndices;
    averageValue?: number;
    averageLineColor?: string;
}

/**
 * Hook to calculate average line from visible data
 * Returns a ReferenceLine object if average should be shown
 */
export const useAverageLine = ({
    showAverageLine,
    data,
    visibleIndices,
    averageValue,
    averageLineColor = "#FFA500",
}: UseAverageLineProps): {
    averageReferenceLine: ReferenceLine | null;
    visibleDataAverage: number;
} => {
    // Calculate average from visible data
    const visibleDataAverage = useMemo(() => {
        const visibleData = data.slice(
            visibleIndices.start,
            visibleIndices.end + 1,
        );

        const nonZeroValues = visibleData
            .map((item) => item.value)
            .filter((value) => value > 0);

        if (nonZeroValues.length === 0) {
            return 0;
        }

        const sum = nonZeroValues.reduce((acc, val) => acc + val, 0);
        return sum / nonZeroValues.length;
    }, [data, visibleIndices.start, visibleIndices.end]);

    // Create average reference line if needed
    const averageReferenceLine = useMemo(() => {
        if (!showAverageLine) {
            return null;
        }

        // Use provided averageValue if available, otherwise calculate from visible data
        const avgValue =
            averageValue !== undefined ? averageValue : visibleDataAverage;

        if (avgValue === 0) {
            return null;
        }

        return {
            value: Math.round(avgValue),
            label: `Avg`,
            color: averageLineColor,
            dashArray: [5, 5],
        };
    }, [showAverageLine, averageValue, visibleDataAverage, averageLineColor]);

    return { averageReferenceLine, visibleDataAverage };
};
