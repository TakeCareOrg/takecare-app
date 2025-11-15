import { useCallback, useMemo } from "react";
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
    // Create animated values for each reference line
    const animatedPositions = useMemo(
        () => referenceLines.map(() => new Animated.Value(0)),
        [referenceLines.length], // eslint-disable-line react-hooks/exhaustive-deps
    );

    // Animate reference lines to their new positions
    const animateReferenceLines = useCallback(() => {
        const animations = referenceLines.map((line, index) => {
            const position = (line.value / dynamicMaxValue) * chartHeight;
            const cappedPosition = Math.min(position, chartHeight);

            return Animated.timing(animatedPositions[index], {
                toValue: cappedPosition,
                duration: ANIMATION_DURATION,
                easing: Easing.out(Easing.ease),
                useNativeDriver: false,
            });
        });

        Animated.parallel(animations).start();
    }, [dynamicMaxValue, chartHeight, referenceLines, animatedPositions]);

    return {
        animatedPositions,
        animateReferenceLines,
    };
};
