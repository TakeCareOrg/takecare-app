import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
    interpolateColor,
    SharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";

import { useColorTheme } from "@hooks/use-color-theme";

import { BOX_WIDTH } from "./precise-slider";

export const WheelItem: React.FC<{
    currentOffset: SharedValue<number>;
    style?: ViewStyle;
    index?: number;
    unit?: "kg" | "lbs" | "cm" | "ft";
}> = ({ currentOffset, index = 0, unit = "kg" }) => {
    const { white, border } = useColorTheme();
    const animatedStyle = useAnimatedStyle(() => {
        const distance = Math.abs(currentOffset.value - index * BOX_WIDTH);
        const isSelected = distance < BOX_WIDTH / 2;
        const highlight = interpolateColor(
            currentOffset.value - index * BOX_WIDTH,
            [-BOX_WIDTH, 0, BOX_WIDTH],
            ["#ffffff00", "#ffffffaa", "#ffffff00"],
        );
        const falloffOpacity = 1 - distance / 500;
        return {
            backgroundColor: highlight,
            transform: [
                {
                    translateX: index * BOX_WIDTH - currentOffset.value,
                },
                {
                    scale: 1.3 / Math.log10(distance / 2 + 25),
                },
            ],
            opacity: isSelected ? 1 : falloffOpacity,
        };
    });

    let isMajorGraduation = false;
    let isMediumGraduation = false;
    let isMinorGraduation = false;

    switch (unit) {
        case "kg":
            isMajorGraduation = index % 5 === 0;
            isMediumGraduation = index % 1 === 0;
            break;
        case "lbs":
            isMajorGraduation = index % 5 === 0;
            isMediumGraduation = index % 1 === 0;
            break;
        case "cm":
            isMajorGraduation = index % 10 === 0;
            isMediumGraduation = index % 5 === 0 && index % 10 !== 0;
            isMinorGraduation = index % 1 === 0 && index % 5 !== 0;
            break;
        case "ft":
            isMajorGraduation = index % 5 === 0;
            isMediumGraduation = index % 1 === 0 && index % 5 !== 0;
            break;
    }

    return (
        <Animated.View
            style={[
                {
                    borderRadius: 12,
                    width: BOX_WIDTH,
                    height: "100%",
                    position: "absolute",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 20,
                },
                animatedStyle,
            ]}
            pointerEvents={"none"}
        >
            <View
                style={[
                    isMajorGraduation
                        ? {
                              ...styles.graduationMajor,
                              backgroundColor: white,
                          }
                        : isMediumGraduation
                          ? {
                                ...styles.graduationMedium,
                                backgroundColor: white,
                            }
                          : isMinorGraduation
                            ? {
                                  ...styles.graduationMinor,
                                  backgroundColor: white,
                              }
                            : {},
                    styles.graduation,
                    { borderColor: border },
                ]}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    graduationMajor: {
        height: "100%",
    },
    graduationMedium: {
        height: "60%",
    },
    graduationMinor: {
        height: "30%",
    },
    graduation: {
        borderRadius: 12,
        width: "100%",
        borderWidth: 6,
    },
});
