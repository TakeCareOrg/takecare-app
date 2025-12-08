import { useMemo } from "react";

import {
    MAX_CHART_HEIGHT,
    MIN_CHART_HEIGHT,
    PADDING_BOTTOM,
    PADDING_TOP,
} from "../constants";

/**
 * Hook to calculate chart dimensions
 */
interface UseChartDimensionsProps {
    height: number;
}

export const useChartDimensions = ({ height }: UseChartDimensionsProps) => {
    const chartHeight = useMemo(() => {
        const availableHeight = height - PADDING_TOP - PADDING_BOTTOM;
        return Math.min(
            MAX_CHART_HEIGHT,
            Math.max(MIN_CHART_HEIGHT, availableHeight),
        );
    }, [height]);

    return {
        chartHeight,
        paddingTop: PADDING_TOP,
        paddingBottom: PADDING_BOTTOM,
    };
};
