import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

interface AnimatedDotsProps {
    color: string;
}

export const AnimatedDots: React.FC<AnimatedDotsProps> = ({ color }) => {
    const dot1 = useRef(new Animated.Value(0.3)).current;
    const dot2 = useRef(new Animated.Value(0.3)).current;
    const dot3 = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const createDotAnimation = (dot: Animated.Value, delay: number) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(dot, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dot, {
                        toValue: 0.3,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ]),
            );

        const a1 = createDotAnimation(dot1, 0);
        const a2 = createDotAnimation(dot2, 200);
        const a3 = createDotAnimation(dot3, 400);

        a1.start();
        a2.start();
        a3.start();

        return () => {
            a1.stop();
            a2.stop();
            a3.stop();
        };
    }, [dot1, dot2, dot3]);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[styles.dot, { backgroundColor: color, opacity: dot1 }]}
            />
            <Animated.View
                style={[styles.dot, { backgroundColor: color, opacity: dot2 }]}
            />
            <Animated.View
                style={[styles.dot, { backgroundColor: color, opacity: dot3 }]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});
