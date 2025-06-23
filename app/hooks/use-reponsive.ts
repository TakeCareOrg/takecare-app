import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

/**
 * Custom hook that returns a responsive margin based on screen height
 * @param smallScreenValue - Value to use when screen height is below threshold (default: 12)
 * @param largeScreenValue - Value to use when screen height is above threshold (default: 16)
 * @param threshold - Height threshold in pixels (default: 700)
 * @returns The appropriate margin value based on screen height
 */

type UseResponsiveProps = {
    smallScreenValue?: number;
    largeScreenValue?: number;
    threshold?: number;
};

export const useResponsive = ({
    smallScreenValue = 12,
    largeScreenValue = 16,
    threshold = 700,
}: UseResponsiveProps = {}): number => {
    const { height } = useWindowDimensions();

    const value = useMemo(() => {
        return height < threshold ? smallScreenValue : largeScreenValue;
    }, [height, smallScreenValue, largeScreenValue, threshold]);

    return value;
};
