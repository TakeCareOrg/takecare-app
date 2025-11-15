import { useCallback, useRef, useState } from "react";

import {
    BAR_WIDTH,
    CENTERING_OFFSET,
    SELECTION_ZONE_WIDTH,
} from "../constants";
import { BaseBarDataItem } from "../types/chart-types";

/**
 * Hook to manage bar selection and selection zone positioning
 */
interface UseChartSelectionProps<T extends BaseBarDataItem> {
    data: T[];
    viewportWidth: number;
    rightPaddingWidth: number;
    getBarPosition: (index: number) => number;
    onSelect?: (selectedData: T, index: number) => void;
    snapToBar: (index: number) => void;
    barWidth?: number;
    isAdjustingRef?: React.MutableRefObject<boolean>; // Optional ref from useChartScroll
}

export const useChartSelection = <T extends BaseBarDataItem>({
    data,
    viewportWidth,
    rightPaddingWidth,
    getBarPosition,
    onSelect,
    snapToBar,
    barWidth = BAR_WIDTH,
    isAdjustingRef,
}: UseChartSelectionProps<T>) => {
    const [selectedBarIndex, setSelectedBarIndex] = useState(data.length - 1);
    const [selectionZoneLeft, setSelectionZoneLeft] = useState<number | null>(
        null,
    );

    // Use provided ref or create internal one
    const internalAdjustingRef = useRef(false);
    const adjustingRef = isAdjustingRef || internalAdjustingRef;

    // Handle bar press/selection
    const handleBarPress = useCallback(
        (index: number, scrollOffsetRef: React.MutableRefObject<number>) => {
            // Check if we're currently adjusting or if selection zone not initialized
            if (adjustingRef.current || selectionZoneLeft === null) return;

            // Update selection and trigger callback
            setSelectedBarIndex((prevIndex) => {
                if (prevIndex !== index) {
                    setTimeout(() => {
                        if (onSelect && data[index]) {
                            onSelect(data[index], index);
                        }
                    }, 0);
                }
                return index;
            });

            // Calculate positioning
            const currentScrollOffset = scrollOffsetRef.current;
            const barContentPosition = getBarPosition(index) + barWidth / 2;
            const barScreenPosition = barContentPosition - currentScrollOffset;

            const idealZoneLeft =
                barScreenPosition - SELECTION_ZONE_WIDTH / 2 + CENTERING_OFFSET;

            const minZoneLeft = 0;
            const maxZoneLeft =
                viewportWidth - rightPaddingWidth - SELECTION_ZONE_WIDTH;
            const clampedZoneLeft = Math.max(
                minZoneLeft,
                Math.min(maxZoneLeft, idealZoneLeft),
            );

            setSelectionZoneLeft(clampedZoneLeft);

            // Snap if zone was clamped
            if (Math.abs(clampedZoneLeft - idealZoneLeft) > 1) {
                setTimeout(() => {
                    snapToBar(index);
                }, 50);
            }
        },
        [
            viewportWidth,
            getBarPosition,
            onSelect,
            data,
            selectionZoneLeft,
            snapToBar,
            barWidth,
            rightPaddingWidth,
            adjustingRef,
        ],
    );

    return {
        selectedBarIndex,
        setSelectedBarIndex,
        selectionZoneLeft,
        setSelectionZoneLeft,
        handleBarPress,
    };
};
