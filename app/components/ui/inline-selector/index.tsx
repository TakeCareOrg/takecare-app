import { useCallback, useMemo, useRef, useState } from "react";
import { Animated, LayoutChangeEvent, StyleSheet, View } from "react-native";

import { Text } from "@components/ui/text";
import { useColorTheme } from "@hooks/use-color-theme";

type InlineSelectorProps = {
    options: { label: string; value: string }[];
    onChange: (value: string) => void;
    value: string;
};

export const InlineSelector = ({
    options = [],
    onChange,
    value,
}: InlineSelectorProps) => {
    const { blue, text, background, border } = useColorTheme();
    const translateX = useRef(new Animated.Value(0)).current;
    const [itemWidth, setItemWidth] = useState(0);

    // Calculer l'index de l'item sélectionné
    const selectedIndex = useMemo(() => {
        return options.findIndex((unit) => unit.value === value);
    }, [options, value]);

    const handleLayout = useCallback(
        (event: LayoutChangeEvent) => {
            const { width } = event.nativeEvent.layout;
            // Soustraire le padding (2 * 3 = 6) pour calculer la largeur disponible
            const calculatedWidth = (width - 6) / options.length;
            setItemWidth(calculatedWidth);
            // Positionner l'indicateur au premier rendu
            translateX.setValue(selectedIndex * calculatedWidth);
        },
        [options, selectedIndex, translateX],
    );

    const handleChange = useCallback(
        (newValue: string) => {
            if (value !== newValue) {
                const newIndex = options.findIndex(
                    (unit) => unit.value === newValue,
                );
                if (newIndex !== -1 && itemWidth > 0) {
                    Animated.spring(translateX, {
                        toValue: newIndex * itemWidth,
                        useNativeDriver: true,
                        tension: 75,
                        friction: 10,
                    }).start();
                }
                onChange(newValue);
            }
        },
        [value, options, itemWidth, onChange, translateX],
    );

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: background,
                    borderColor: border,
                    shadowColor: blue[200],
                    shadowOffset: {
                        width: 0,
                        height: 5,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 3.0,
                    elevation: 5,
                },
            ]}
            onLayout={handleLayout}
        >
            {/* Indicateur animé en arrière-plan */}
            {itemWidth > 0 && (
                <Animated.View
                    style={[
                        styles.indicator,
                        {
                            backgroundColor: blue[100],
                            width: itemWidth,
                            transform: [{ translateX }],
                        },
                    ]}
                />
            )}

            {/* Items */}
            {options.map((unit) => (
                <View
                    key={unit.value}
                    style={styles.item}
                    onTouchStart={() => handleChange(unit.value)}
                >
                    <Text color={text} weight="600">
                        {unit.label}
                    </Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        borderRadius: 10,
        alignSelf: "center",
        padding: 2,
        position: "relative",
        borderWidth: 1,
    },
    indicator: {
        position: "absolute",
        left: 2,
        top: 2,
        bottom: 2,
        borderRadius: 8,
    },
    item: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 4,
        width: "100%",
        zIndex: 1,
    },
});
