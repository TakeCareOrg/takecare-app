import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

/**
 * Custom hook that returns a responsive margin based on screen height
 * @param smallScreenValue - Value to use when screen height is below threshold (default: 12)
 * @param largeScreenValue - Value to use when screen height is above threshold (default: 16)
 * @param threshold - Height threshold in pixels (default: 700)
 * @returns The appropriate margin value based on screen height
 */
export const useResponsiveMargin = (
    smallScreenValue: number = 12,
    largeScreenValue: number = 16,
    threshold: number = 700,
): number => {
    const { height } = useWindowDimensions();

    const responsiveMargin = useMemo(() => {
        return height < threshold ? smallScreenValue : largeScreenValue;
    }, [height, smallScreenValue, largeScreenValue, threshold]);

    return responsiveMargin;
};
