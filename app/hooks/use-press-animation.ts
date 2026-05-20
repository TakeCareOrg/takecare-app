import { useCallback } from "react";
import {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

import * as Haptics from "expo-haptics";

const SPRING = { damping: 14, stiffness: 320, mass: 0.6 };

type HapticKind = "light" | "medium" | "selection" | "none";

export function usePressAnimation(options?: {
    scaleTo?: number;
    haptic?: HapticKind;
}) {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const scaleTo = options?.scaleTo ?? 0.96;
    const haptic = options?.haptic ?? "light";

    const onPressIn = useCallback(() => {
        scale.value = withSpring(scaleTo, SPRING);
        if (haptic === "none") return;
        if (haptic === "selection") {
            Haptics.selectionAsync();
            return;
        }
        Haptics.impactAsync(
            haptic === "medium"
                ? Haptics.ImpactFeedbackStyle.Medium
                : Haptics.ImpactFeedbackStyle.Light,
        );
    }, [scale, scaleTo, haptic]);

    const onPressOut = useCallback(() => {
        scale.value = withSpring(1, SPRING);
    }, [scale]);

    return { animatedStyle, onPressIn, onPressOut };
}
