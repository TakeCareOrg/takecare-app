import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedProps,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export type RingDatum = {
    value: number;
    target: number;
    color: string;
    trackColor?: string;
    label: string;
    unit?: string;
};

export type ActivityRingsProps = {
    data: [RingDatum, RingDatum, RingDatum];
    size?: number;
    strokeWidth?: number;
    gap?: number;
    animated?: boolean;
};

const ANIMATION_DURATION = 900;

function AnimatedRing({
    cx,
    cy,
    radius,
    strokeWidth,
    color,
    trackColor,
    progress,
    animated,
}: {
    cx: number;
    cy: number;
    radius: number;
    strokeWidth: number;
    color: string;
    trackColor: string;
    progress: number;
    animated: boolean;
}) {
    const circumference = 2 * Math.PI * radius;
    const animatedProgress = useSharedValue(animated ? 0 : progress);

    useEffect(() => {
        if (animated) {
            animatedProgress.value = withTiming(progress, {
                duration: ANIMATION_DURATION,
                easing: Easing.out(Easing.cubic),
            });
        } else {
            animatedProgress.value = progress;
        }
    }, [progress, animated, animatedProgress]);

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: circumference * (1 - animatedProgress.value),
    }));

    return (
        <>
            <Circle
                cx={cx}
                cy={cy}
                r={radius}
                stroke={trackColor}
                strokeWidth={strokeWidth}
                fill="none"
            />
            <AnimatedCircle
                cx={cx}
                cy={cy}
                r={radius}
                stroke={color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                animatedProps={animatedProps}
                transform={`rotate(-90 ${cx} ${cy})`}
            />
        </>
    );
}

function hexToRgba(hex: string, alpha: number): string {
    const cleaned = hex.replace("#", "");
    const r = parseInt(cleaned.substring(0, 2), 16);
    const g = parseInt(cleaned.substring(2, 4), 16);
    const b = parseInt(cleaned.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function ActivityRings({
    data,
    size = 180,
    strokeWidth = 16,
    gap = 6,
    animated = true,
}: ActivityRingsProps) {
    const cx = size / 2;
    const cy = size / 2;

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size}>
                {data.map((datum, index) => {
                    const radius =
                        size / 2 -
                        strokeWidth / 2 -
                        index * (strokeWidth + gap);
                    const ratio =
                        datum.target > 0 ? datum.value / datum.target : 0;
                    const progress = Math.min(Math.max(ratio, 0), 1);
                    const trackColor =
                        datum.trackColor ?? hexToRgba(datum.color, 0.2);

                    return (
                        <AnimatedRing
                            key={`${datum.label}-${index}`}
                            cx={cx}
                            cy={cy}
                            radius={radius}
                            strokeWidth={strokeWidth}
                            color={datum.color}
                            trackColor={trackColor}
                            progress={progress}
                            animated={animated}
                        />
                    );
                })}
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
});
