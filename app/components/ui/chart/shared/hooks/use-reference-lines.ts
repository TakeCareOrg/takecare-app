import { useCallback, useRef } from "react";
import { Animated, Easing } from "react-native";

import { ANIMATION_DURATION } from "../constants";
import { ReferenceLine } from "../types/chart-types";

/**
 * Hook to manage reference lines animation
 */
interface UseReferenceLineAnimationProps {
    referenceLines: ReferenceLine[];
    dynamicMaxValue: number;
    chartHeight: number;
}

export const useReferenceLineAnimation = ({
    referenceLines,
    dynamicMaxValue,
    chartHeight,
}: UseReferenceLineAnimationProps) => {
    // Use ref to maintain animated values across renders
    const animatedPositionsRef = useRef<Animated.Value[]>([]);
    const referenceLinesLengthRef = useRef(0);
    const previousMaxValueRef = useRef(dynamicMaxValue);

    // Update animated values array when reference lines count changes
    if (referenceLinesLengthRef.current !== referenceLines.length) {
        referenceLinesLengthRef.current = referenceLines.length;
        // Initialize with current calculated positions
        animatedPositionsRef.current = referenceLines.map((line, index) => {
            const existingValue = animatedPositionsRef.current[index];
            if (existingValue) {
                return existingValue;
            }
            // Initialize new values with their target position
            const position = (line.value / dynamicMaxValue) * chartHeight;
            const cappedPosition = Math.min(position, chartHeight);
            return new Animated.Value(cappedPosition);
        });
    }

    const animatedPositions = animatedPositionsRef.current;

    // Ref to track running animations so we can stop them
    const runningAnimationsRef = useRef<Animated.CompositeAnimation | null>(
        null,
    );

    // Animate reference lines to their new positions
    const animateReferenceLines = useCallback(() => {
        // Stop any running animation first
        if (runningAnimationsRef.current) {
            runningAnimationsRef.current.stop();
        }

        const animations = referenceLines.map((line, index) => {
            const position = (line.value / dynamicMaxValue) * chartHeight;
            const cappedPosition = Math.min(position, chartHeight);

            return Animated.timing(animatedPositionsRef.current[index], {
                toValue: cappedPosition,
                duration: ANIMATION_DURATION,
                easing: Easing.out(Easing.ease),
                useNativeDriver: false,
            });
        });

        const parallelAnimation = Animated.parallel(animations);
        runningAnimationsRef.current = parallelAnimation;
        parallelAnimation.start(() => {
            runningAnimationsRef.current = null;
        });
        previousMaxValueRef.current = dynamicMaxValue;
    }, [dynamicMaxValue, chartHeight, referenceLines]);

    return {
        animatedPositions,
        animateReferenceLines,
    };
};
