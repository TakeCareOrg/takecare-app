import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet } from "react-native";

const defaultColors = ["#4dabf7", "#3bc9db", "#38d9a9", "#69db7c"];

interface LoadingDotsProps {
    dots?: number;
    colors?: string[];
    size?: number;
    bounceHeight?: number;
    borderRadius?: number;
    components?: JSX.Element[];
}

const LoadingDots: React.FC<LoadingDotsProps> = ({
    dots = 4,
    colors = defaultColors,
    size = 20,
    bounceHeight = 20,
    borderRadius,
    components,
}) => {
    const [animations, setAnimations] = useState<Animated.Value[]>([]);
    const [reverse, setReverse] = useState<boolean>(false);
    const opacity = useRef(new Animated.Value(0)).current;
    const animationRef = useRef<Animated.CompositeAnimation | null>(null);

    useEffect(() => {
        const animationsAmount = components?.length || dots;
        const dotAnimations: Animated.Value[] = [];

        for (let i = 0; i < animationsAmount; i++) {
            dotAnimations.push(new Animated.Value(0));
        }

        setAnimations(dotAnimations);

        Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();
    }, [dots, components?.length]);

    const floatAnimation = useCallback(
        (node: Animated.Value, reverseY: boolean, delay: number) => {
            return Animated.sequence([
                Animated.timing(node, {
                    toValue: reverseY ? 0 : -bounceHeight,
                    duration: 400,
                    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
                    delay,
                    useNativeDriver: true,
                }),
                Animated.timing(node, {
                    toValue: reverseY ? -bounceHeight : 0,
                    duration: 400,
                    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
                    delay,
                    useNativeDriver: true,
                }),
                Animated.timing(node, {
                    toValue: 0,
                    duration: 200,
                    delay,
                    useNativeDriver: true,
                }),
            ]);
        },
        [bounceHeight],
    );

    const startLoadingAnimation = useCallback(
        (nodes: Animated.Value[], reverseY: boolean) => {
            if (animationRef.current) {
                animationRef.current.stop();
            }

            animationRef.current = Animated.parallel(
                nodes.map((node, index) =>
                    floatAnimation(node, reverseY, index * 100),
                ),
            );

            animationRef.current.start(({ finished }) => {
                if (finished) {
                    setTimeout(() => {
                        setReverse((prev) => !prev);
                    }, 0);
                }
            });
        },
        [floatAnimation],
    );

    useEffect(() => {
        if (animations.length > 0) {
            startLoadingAnimation(animations, reverse);
        }
    }, [animations, reverse, startLoadingAnimation]);

    useEffect(() => {
        return () => {
            if (animationRef.current) {
                animationRef.current.stop();
            }
        };
    }, []);

    if (animations.length === 0) {
        return null;
    }

    return (
        <Animated.View style={[styles.loading, { opacity }]}>
            {animations.map((animation, index) =>
                components ? (
                    <Animated.View
                        key={`loading-anim-${index}`}
                        style={[
                            {
                                transform: [{ translateY: animation }],
                                margin: 3,
                            },
                        ]}
                    >
                        {components[index]}
                    </Animated.View>
                ) : (
                    <Animated.View
                        key={`loading-anim-${index}`}
                        style={[
                            {
                                width: size,
                                height: size,
                                borderRadius: borderRadius || size / 2,
                                margin: 3,
                                backgroundColor: colors[index] || "#4dabf7",
                            },
                            { transform: [{ translateY: animation }] },
                        ]}
                    />
                ),
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    loading: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
});

export default LoadingDots;
