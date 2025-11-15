import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ScrollView } from "react-native";

import { REFERENCE_LINE_BUFFER } from "../constants";
import {
    BaseBarDataItem,
    ReferenceLine,
    VisibleIndices,
} from "../types/chart-types";

/**
 * Hook to calculate dynamic max value based on visible data and reference lines
 */
interface UseDynamicMaxValueProps<T extends BaseBarDataItem> {
    data: T[];
    visibleIndices: VisibleIndices;
    providedMaxValue?: number;
    referenceLines: ReferenceLine[];
    buffer: number;
}

export const useDynamicMaxValue = <T extends BaseBarDataItem>({
    data,
    visibleIndices,
    providedMaxValue,
    referenceLines,
    buffer,
}: UseDynamicMaxValueProps<T>) => {
    return useMemo(() => {
        if (providedMaxValue) {
            return providedMaxValue;
        }

        const visibleData = data.slice(
            visibleIndices.start,
            visibleIndices.end + 1,
        );

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
                const dataWithBuffer =
                    baseMaxValue + (baseMaxValue * buffer) / 100;
                return Math.max(dataWithBuffer, minRequiredValue);
            } else {
                return Math.max(baseMaxValue, minRequiredValue);
            }
        } else {
            return baseMaxValue + (baseMaxValue * buffer) / 100;
        }
    }, [
        data,
        providedMaxValue,
        buffer,
        visibleIndices.start,
        visibleIndices.end,
        referenceLines,
    ]);
};

/**
 * Hook to manage visible indices
 */
interface UseVisibleIndicesProps {
    dataLength: number;
    initialLength?: number;
}

export const useVisibleIndices = ({
    dataLength,
    initialLength = 5,
}: UseVisibleIndicesProps) => {
    const [visibleIndices, setVisibleIndices] = useState<VisibleIndices>(() => {
        const length = Math.min(initialLength, dataLength);
        return {
            start: Math.max(0, dataLength - length),
            end: Math.max(0, dataLength - 1),
        };
    });

    // Reset when data length changes
    useEffect(() => {
        const length = Math.min(initialLength, dataLength);
        setVisibleIndices({
            start: Math.max(0, dataLength - length),
            end: Math.max(0, dataLength - 1),
        });
    }, [dataLength, initialLength]);

    return {
        visibleIndices,
        setVisibleIndices,
    };
};

/**
 * Hook to initialize and manage scroll refs
 */
export const useScrollRefs = () => {
    const scrollViewRef = useRef<ScrollView | null>(null);
    const scrollOffsetRef = useRef(0);
    const isUserScrollingRef = useRef(false);
    const isAdjustingRef = useRef(false);
    const isInitializedRef = useRef(false);
    const lastScrollTimeRef = useRef(0);
    const scrollVelocityRef = useRef(0);
    const lastScrollOffsetRef = useRef(0);

    return {
        scrollViewRef,
        scrollOffsetRef,
        isUserScrollingRef,
        isAdjustingRef,
        isInitializedRef,
        lastScrollTimeRef,
        scrollVelocityRef,
        lastScrollOffsetRef,
    };
};

/**
 * Hook to calculate bar position with year dividers (for DailyBarChart)
 */
interface UseBarPositionProps<
    T extends BaseBarDataItem & { startDate?: string },
> {
    data: T[];
    barWidth: number;
    barGap: number;
    yearDividerWidth?: number;
}

export const useBarPosition = <
    T extends BaseBarDataItem & { startDate?: string },
>({
    data,
    barWidth,
    barGap,
    yearDividerWidth = 0,
}: UseBarPositionProps<T>) => {
    const getBarPosition = useCallback(
        (index: number) => {
            let position = index * (barWidth + barGap);

            if (yearDividerWidth > 0) {
                let dividersBeforeThisBar = 0;
                for (let i = 1; i <= index; i++) {
                    const currentItem = data[i];
                    const prevItem = data[i - 1];

                    if (
                        currentItem?.startDate &&
                        prevItem?.startDate &&
                        new Date(currentItem.startDate).getFullYear() !==
                            new Date(prevItem.startDate).getFullYear()
                    ) {
                        dividersBeforeThisBar++;
                    }
                }
                position += dividersBeforeThisBar * yearDividerWidth;
            }

            return position;
        },
        [data, barWidth, barGap, yearDividerWidth],
    );

    return { getBarPosition };
};
