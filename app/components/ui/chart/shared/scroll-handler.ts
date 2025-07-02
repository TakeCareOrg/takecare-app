import { MutableRefObject, useCallback, useRef } from "react";
import { Animated, ScrollView } from "react-native";

import {
    calculateScrollPositionForIndex,
    calculateTargetBarIndex,
    shouldSnapToCenter,
} from "./chart-utils";

export interface UseScrollHandlerProps<T> {
    scrollViewRef: MutableRefObject<ScrollView | null>;
    data: T[];
    selectionZoneLeft: number;
    onSelect?: (selectedData: T, index: number) => void;
    disableSnapping?: boolean;
    selectedIndex: number;
    setSelectedIndex: (index: number) => void;
    scrollX: number;
    setScrollX: (x: number) => void;
}

export const useScrollHandler = <T>({
    scrollViewRef,
    data,
    selectionZoneLeft,
    onSelect,
    disableSnapping = false,
    selectedIndex,
    setSelectedIndex,
    scrollX,
    setScrollX,
}: UseScrollHandlerProps<T>) => {
    const isUserScrollingRef = useRef(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const snapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleScroll = useCallback(
        (event: any) => {
            const currentScrollX = event.nativeEvent.contentOffset.x;
            setScrollX(currentScrollX);

            // Mark that user is actively scrolling
            isUserScrollingRef.current = true;

            // Clear any existing timeouts
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            if (snapTimeoutRef.current) {
                clearTimeout(snapTimeoutRef.current);
            }

            // Set timeout to detect when scrolling ends
            scrollTimeoutRef.current = setTimeout(() => {

                // Calculate target bar index based on current scroll position
                const targetIndex = calculateTargetBarIndex(
                    currentScrollX,
                    selectionZoneLeft,
                    data.length,
                );

                // Update selection if it changed
                if (targetIndex !== selectedIndex) {
                    setSelectedIndex(targetIndex);
                    if (onSelect && data[targetIndex]) {
                        onSelect(data[targetIndex], targetIndex);
                    }
                }

                // Schedule snapping check after selection update
                if (!disableSnapping) {
                    snapTimeoutRef.current = setTimeout(() => {

                        const targetScrollX = calculateScrollPositionForIndex(
                            targetIndex,
                            selectionZoneLeft,
                        );


                        if (shouldSnapToCenter(currentScrollX, targetScrollX)) {
                            scrollViewRef.current?.scrollTo({
                                x: targetScrollX,
                                animated: true,
                            });
                        } 

                        // Mark scrolling as complete
                        isUserScrollingRef.current = false;
                    }, 50);
                } else {
                    isUserScrollingRef.current = false;
                }
            }, 150);
        },
        [
            data,
            selectionZoneLeft,
            selectedIndex,
            setSelectedIndex,
            setScrollX,
            onSelect,
            disableSnapping,
            scrollViewRef,
        ],
    );

    const scrollToIndex = useCallback(
        (index: number, animated: boolean = true) => {
            if (index < 0 || index >= data.length) return;

            const targetScrollX = calculateScrollPositionForIndex(
                index,
                selectionZoneLeft,
            );

            scrollViewRef.current?.scrollTo({
                x: targetScrollX,
                animated,
            });

            setSelectedIndex(index);
            if (onSelect && data[index]) {
                onSelect(data[index], index);
            }
        },
        [data, selectionZoneLeft, scrollViewRef, setSelectedIndex, onSelect],
    );

    return {
        handleScroll,
        scrollToIndex,
        isUserScrollingRef,
    };
};
