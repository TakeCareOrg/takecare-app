import React, { useEffect, useMemo } from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    runOnJS,
    SharedValue,
    useAnimatedStyle,
    useFrameCallback,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

import type { WidgetId } from "@stores/home-layout";

import type { Slot } from "./grid-layout";

const SPRING_CONFIG = { damping: 18, stiffness: 360, mass: 0.6 };

type Props = {
    slot: Slot;
    baseX: number;
    baseY: number;
    width: number;
    height: number;
    onDragMove: (id: WidgetId, centerX: number, centerY: number) => void;
    onDragEnd: () => void;
    scrollY: SharedValue<number>;
    autoscrollDir: SharedValue<number>;
    scrollEdgeTop: number;
    scrollEdgeBottom: number;
    children: React.ReactNode;
};

export function DraggableWidget({
    slot,
    baseX,
    baseY,
    width,
    height,
    onDragMove,
    onDragEnd,
    scrollY,
    autoscrollDir,
    scrollEdgeTop,
    scrollEdgeBottom,
    children,
}: Props) {
    const tx = useSharedValue(baseX);
    const ty = useSharedValue(baseY);
    const baseXSV = useSharedValue(baseX);
    const baseYSV = useSharedValue(baseY);
    const startTx = useSharedValue(0);
    const startTy = useSharedValue(0);
    const startScrollY = useSharedValue(0);
    const lastTransX = useSharedValue(0);
    const lastTransY = useSharedValue(0);
    const isDragging = useSharedValue(false);

    useEffect(() => {
        baseXSV.value = baseX;
        baseYSV.value = baseY;
        if (!isDragging.value) {
            tx.value = withSpring(baseX, SPRING_CONFIG);
            ty.value = withSpring(baseY, SPRING_CONFIG);
        }
    }, [baseX, baseY, baseXSV, baseYSV, isDragging, tx, ty]);

    useFrameCallback(() => {
        if (!isDragging.value) return;
        const scrollDelta = scrollY.value - startScrollY.value;
        tx.value = startTx.value + lastTransX.value;
        ty.value = startTy.value + lastTransY.value + scrollDelta;
    });

    const pan = useMemo(
        () =>
            Gesture.Pan()
                .activateAfterLongPress(400)
                .onStart(() => {
                    isDragging.value = true;
                    startTx.value = tx.value;
                    startTy.value = ty.value;
                    startScrollY.value = scrollY.value;
                    lastTransX.value = 0;
                    lastTransY.value = 0;
                })
                .onUpdate((e) => {
                    lastTransX.value = e.translationX;
                    lastTransY.value = e.translationY;
                    const scrollDelta = scrollY.value - startScrollY.value;
                    tx.value = startTx.value + e.translationX;
                    ty.value = startTy.value + e.translationY + scrollDelta;
                    const centerX = tx.value + width / 2;
                    const centerY = ty.value + height / 2;
                    runOnJS(onDragMove)(slot.id, centerX, centerY);

                    if (e.absoluteY < scrollEdgeTop) {
                        autoscrollDir.value = -1;
                    } else if (e.absoluteY > scrollEdgeBottom) {
                        autoscrollDir.value = 1;
                    } else {
                        autoscrollDir.value = 0;
                    }
                })
                .onEnd(() => {
                    isDragging.value = false;
                    autoscrollDir.value = 0;
                    runOnJS(onDragEnd)();
                    tx.value = withSpring(baseXSV.value, SPRING_CONFIG);
                    ty.value = withSpring(baseYSV.value, SPRING_CONFIG);
                }),
        [
            width,
            height,
            slot.id,
            onDragMove,
            onDragEnd,
            tx,
            ty,
            startTx,
            startTy,
            startScrollY,
            scrollY,
            lastTransX,
            lastTransY,
            baseXSV,
            baseYSV,
            isDragging,
            autoscrollDir,
            scrollEdgeTop,
            scrollEdgeBottom,
        ],
    );

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: tx.value },
            { translateY: ty.value },
            { scale: isDragging.value ? 1.04 : 1 },
        ],
        zIndex: isDragging.value ? 1000 : 1,
        elevation: isDragging.value ? 12 : 3,
        shadowOpacity: isDragging.value ? 0.25 : 0,
    }));

    return (
        <GestureDetector gesture={pan}>
            <Animated.View
                style={[styles.wrapper, { width, height }, animatedStyle]}
            >
                {children}
            </Animated.View>
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        overflow: "hidden",
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 10,
    },
});
