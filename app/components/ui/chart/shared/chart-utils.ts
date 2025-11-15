import {
    BAR_GAP,
    BAR_WIDTH,
    CENTERING_OFFSET,
    REFERENCE_LINE_BUFFER,
    RIGHT_PADDING_WIDTH,
    SELECTION_ZONE_WIDTH,
    YEAR_DIVIDER_WIDTH,
} from "./constants";
import { DynamicColors, ReferenceLine } from "./types/chart-types";

/**
 * Unified function to calculate dynamic color for a bar based on reference thresholds
 * Supports both static reference lines and dynamic average values
 *
 * @param value - The value of the bar
 * @param originalColor - The original color to fall back to
 * @param dynamicColors - Color configuration for different thresholds
 * @param referenceLines - Static reference lines (optional)
 * @param averageValue - Dynamic average value to use as threshold (optional)
 * @param barColor - Override color for all non-empty bars (optional)
 */
export const getDynamicColor = (
    value: number,
    originalColor?: string,
    dynamicColors?: DynamicColors,
    referenceLines?: ReferenceLine[],
    averageValue?: number,
    barColor?: string,
): string => {
    // If barColor is provided, use it for all non-empty bars
    if (barColor && value > 0) {
        return barColor;
    }

    if (!dynamicColors) {
        return originalColor || "#5B7BFB";
    }

    // If we have static reference lines, use them
    if (referenceLines && referenceLines.length > 0) {
        const sortedRefs = [...referenceLines].sort(
            (a, b) => a.value - b.value,
        );

        const firstReference = sortedRefs[0].value;
        const secondReference = sortedRefs[1]?.value;

        if (secondReference && value >= secondReference) {
            return (
                dynamicColors.aboveSecondReference ||
                dynamicColors.aboveFirstReference
            );
        } else if (value >= firstReference) {
            return dynamicColors.aboveFirstReference;
        } else {
            return dynamicColors.belowFirstReference;
        }
    }

    // If we only have average value (no static references)
    if (averageValue !== undefined && averageValue > 0) {
        if (value >= averageValue) {
            return dynamicColors.aboveFirstReference;
        } else {
            return dynamicColors.belowFirstReference;
        }
    }

    // Fallback
    return originalColor || dynamicColors.belowFirstReference;
};

/**
 * Calculate the dynamic max value for the chart based on visible data and reference lines
 */
export const calculateDynamicMaxValue = (
    visibleData: { value: number }[],
    providedMaxValue: number | undefined,
    referenceLines: ReferenceLine[],
    buffer: number,
): number => {
    if (providedMaxValue) {
        return providedMaxValue;
    }

    const nonZeroValues = visibleData
        .map((item) => item.value)
        .filter((value) => value > 0);

    const highestDataValue =
        nonZeroValues.length > 0 ? Math.max(...nonZeroValues) : 1;

    const highestReferenceValue =
        referenceLines.length > 0
            ? Math.max(...referenceLines.map((line) => line.value))
            : 0;

    const baseMaxValue = Math.max(highestDataValue, highestReferenceValue);

    if (referenceLines.length > 0) {
        const minRequiredValue =
            highestReferenceValue * (1 + REFERENCE_LINE_BUFFER / 100);

        if (highestDataValue > highestReferenceValue) {
            const dataWithBuffer = baseMaxValue + (baseMaxValue * buffer) / 100;
            return Math.max(dataWithBuffer, minRequiredValue);
        } else {
            return Math.max(baseMaxValue, minRequiredValue);
        }
    } else {
        return baseMaxValue + (baseMaxValue * buffer) / 100;
    }
};

/**
 * Calculate the total content width for the chart
 */
export const calculateContentWidth = (
    dataLength: number,
    viewportWidth: number,
    selectionZoneLeft: number | null,
    yearDividersCount: number = 0,
): number => {
    const barsWidth = dataLength * (BAR_WIDTH + BAR_GAP) - BAR_GAP;
    const dividersWidth = yearDividersCount * YEAR_DIVIDER_WIDTH;

    const minPadding =
        selectionZoneLeft !== null
            ? Math.max(
                  0,
                  selectionZoneLeft +
                      SELECTION_ZONE_WIDTH / 2 -
                      (viewportWidth - RIGHT_PADDING_WIDTH),
              )
            : SELECTION_ZONE_WIDTH / 2;

    return barsWidth + dividersWidth + minPadding;
};

/**
 * Calculate the target bar index based on scroll position
 */
export const calculateTargetBarIndex = (
    scrollX: number,
    selectionZoneLeft: number,
    dataLength: number,
): number => {
    const targetPosition =
        scrollX + selectionZoneLeft + SELECTION_ZONE_WIDTH / 2;
    const targetIndex = Math.round(
        (targetPosition - CENTERING_OFFSET) / (BAR_WIDTH + BAR_GAP),
    );

    return Math.max(0, Math.min(targetIndex, dataLength - 1));
};

/**
 * Calculate the scroll position for a given bar index
 */
export const calculateScrollPositionForIndex = (
    index: number,
    selectionZoneLeft: number,
): number => {
    const barCenterX =
        CENTERING_OFFSET + index * (BAR_WIDTH + BAR_GAP) + BAR_WIDTH / 2;
    return barCenterX - selectionZoneLeft - SELECTION_ZONE_WIDTH / 2;
};

/**
 * Check if snapping is needed based on current position and target
 */
export const shouldSnapToCenter = (
    currentScrollX: number,
    targetScrollX: number,
    threshold: number = 5,
): boolean => {
    return Math.abs(currentScrollX - targetScrollX) > threshold;
};

/**
 * Update visible indices based on scroll position and viewport
 */
export const updateVisibleIndices = (
    scrollX: number,
    viewportWidth: number,
    dataLength: number,
): { start: number; end: number } => {
    const visibleStartFloat = scrollX / (BAR_WIDTH + BAR_GAP);
    const visibleEndFloat = (scrollX + viewportWidth) / (BAR_WIDTH + BAR_GAP);

    const start = Math.max(0, Math.floor(visibleStartFloat) - 2);
    const end = Math.min(dataLength - 1, Math.ceil(visibleEndFloat) + 2);

    return { start, end };
};
