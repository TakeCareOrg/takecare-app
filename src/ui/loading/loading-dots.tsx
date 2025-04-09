import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Animated, Easing } from "react-native";

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

    useEffect(() => {
        const dotAnimations: Animated.Value[] = [];
        const animationsAmount =
            !!components && Array.isArray(components)
                ? components.length
                : dots;
        for (let i = 0; i < animationsAmount; i++) {
            dotAnimations.push(new Animated.Value(0));
        }
        setAnimations(dotAnimations);
    }, [dots, components]);

    useEffect(() => {
        if (animations.length === 0) return;
        loadingAnimation(animations, reverse);
        appearAnimation();
    }, [animations]);

    function appearAnimation() {
        Animated.timing(opacity, {
            toValue: 1,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();
    }

    function floatAnimation(
        node: Animated.Value,
        reverseY: boolean,
        delay: number
    ) {
        const floatSequence = Animated.sequence([
            Animated.timing(node, {
                toValue: reverseY ? 0 : -bounceHeight,
                easing: Easing.ease,
                delay,
                useNativeDriver: true,
            }),
            Animated.timing(node, {
                toValue: reverseY ? -bounceHeight : 0,
                easing: Easing.ease,
                delay,
                useNativeDriver: true,
            }),
            Animated.timing(node, {
                toValue: 0,
                delay,
                useNativeDriver: true,
            }),
        ]);
        return floatSequence;
    }

    function loadingAnimation(nodes: Animated.Value[], reverseY: boolean) {
        Animated.parallel(
            nodes.map((node, index) =>
                floatAnimation(node, reverseY, index * 100)
            )
        ).start(() => {
            setReverse(!reverse);
        });
    }

    useEffect(() => {
        if (animations.length === 0) return;
        loadingAnimation(animations, reverse);
    }, [reverse, animations]);

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
                            },
                            { backgroundColor: colors[index] || "#4dabf7" },
                            { transform: [{ translateY: animation }] },
                        ]}
                    />
                )
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
