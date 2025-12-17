import React, { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler";
import {
    runOnJS,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

import { HeightUnit, WeightUnit } from "@dtypes/quiz-types";

import { WheelItem } from "./wheel-item";

export const BOX_WIDTH = 35;
const ITEM_COUNT = 50;
const RESET_THRESHOLD = 10;
const SCROLL_SENSITIVITY = 0.1;

type PreciseSliderProps = {
    unit: WeightUnit | HeightUnit;
    value: number;
    step: number;
    onChange: (value: number) => void;
};

export function PreciseSlider({
    value,
    step: propStep,
    unit,
    onChange,
}: PreciseSliderProps) {
    const step = useMemo(() => {
        switch (unit) {
            case "cm":
                return 1;
            case "ft":
                return 0.2;
            default:
                return propStep;
        }
    }, [unit, propStep]);

    const graduations = useSharedValue(
        Array.from({ length: ITEM_COUNT * 2 }, (_, i) => i % ITEM_COUNT),
    );
    const currentOffset = useSharedValue(0);
    const globalIndex = useSharedValue(0);
    const position = useSharedValue(0);
    const hasGenerated = useSharedValue(false);

    //handle unit change
    useEffect(() => {
        globalIndex.value = Number(value);
    }, [value]);

    const graduationsArray = useDerivedValue(
        () => graduations.value,
        [graduations],
    );

    const resetOffset = () => {
        "worklet";
        currentOffset.value =
            (currentOffset.value + BOX_WIDTH * ITEM_COUNT) %
            (BOX_WIDTH * ITEM_COUNT);
        hasGenerated.value = true;
    };

    const generateGraduations = (direction: string) => {
        const offset = direction === "backward" ? 0 : -ITEM_COUNT;

        graduations.value = Array.from(
            { length: ITEM_COUNT * 2 },
            (_, i) => (globalIndex.value + offset + i) % ITEM_COUNT,
        );
    };

    const gesture = Gesture.Pan()
        .shouldCancelWhenOutside(false)
        .onChange((e) => {
            const translationX = -e.translationX;
            const isScrollingForward = translationX > 0;

            if (globalIndex.value <= 0 && !isScrollingForward) {
                globalIndex.value = 0;
                currentOffset.value = 0;
                graduations.value = Array.from(
                    { length: ITEM_COUNT * 2 },
                    (_, i) => i % ITEM_COUNT,
                );
                return;
            }

            currentOffset.value += translationX * SCROLL_SENSITIVITY;
            currentOffset.value =
                (currentOffset.value + BOX_WIDTH * ITEM_COUNT) %
                (BOX_WIDTH * ITEM_COUNT);

            const prevPosition = position.value;
            position.value = Math.round(currentOffset.value / BOX_WIDTH);

            if (prevPosition > position.value) {
                globalIndex.value -= step;
            } else if (prevPosition < position.value) {
                globalIndex.value += step;
            }

            if (
                position.value >= ITEM_COUNT - RESET_THRESHOLD &&
                !hasGenerated.value &&
                globalIndex.value > ITEM_COUNT &&
                isScrollingForward
            ) {
                runOnJS(generateGraduations)("forward");
                resetOffset();
            } else if (
                position.value <= RESET_THRESHOLD &&
                !hasGenerated.value &&
                !isScrollingForward
            ) {
                runOnJS(generateGraduations)("backward");
                resetOffset();
            } else if (
                position.value > RESET_THRESHOLD &&
                position.value < ITEM_COUNT - RESET_THRESHOLD
            ) {
                hasGenerated.value = false;
            }

            runOnJS(onChange)(Math.max(globalIndex.value, 0));
        })
        .onEnd(() => {
            const nearestPosition =
                Math.round(currentOffset.value / BOX_WIDTH) * BOX_WIDTH;

            currentOffset.value = withTiming(nearestPosition, {
                duration: 200,
            });

            if (nearestPosition !== currentOffset.value) {
                runOnJS(onChange)(Math.max(globalIndex.value, 0));
            }
        });

    return (
        <View style={styles.container}>
            <GestureHandlerRootView style={styles.gestureRoot}>
                <GestureDetector gesture={gesture}>
                    <View style={styles.gestureOverlay} />
                </GestureDetector>
                <View style={styles.wheelContainer}>
                    {graduationsArray.value.map((item, i) => (
                        <WheelItem
                            key={i}
                            currentOffset={currentOffset}
                            index={i}
                            unit={unit}
                        />
                    ))}
                </View>
            </GestureHandlerRootView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 16,
        width: "100%",
        height: "30%",
    },
    gestureRoot: {
        width: "100%",
        height: "100%",
    },
    gestureOverlay: {
        height: "100%",
        width: "100%",
        zIndex: 10000,
    },
    wheelContainer: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        position: "absolute",
    },
});
