import React from "react";
import { StyleSheet, View } from "react-native";

import { Text } from "@components/ui/text";
import { HeightUnit, WeightUnit } from "@dtypes/quiz-types";
import { useColorTheme } from "@hooks/use-color-theme";

type UnitSelectorProps<T> = {
    unit1: T;
    unit2: T;
    onChange: (value: T) => void;
    value: T;
};

export const UnitSelector = <T extends WeightUnit | HeightUnit>({
    unit1,
    unit2,
    onChange,
    value,
}: UnitSelectorProps<T>) => {
    const { blue, white, shadow, black } = useColorTheme();

    const activesStyle = {
        backgroundColor: blue[500],
        shadowColor: shadow,
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.0,
        elevation: 24,
        zIndex: 1,
        color: white,
    };

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.item,
                    {
                        ...(value === unit1 && {
                            ...activesStyle,
                        }),
                    },
                ]}
                onTouchStart={() => {
                    if (value !== unit1) {
                        onChange(unit1);
                    }
                }}
            >
                <Text color={value === unit1 ? white : black}>{unit1}</Text>
            </View>
            <View
                style={[
                    styles.item,
                    {
                        ...(value === unit2 && {
                            ...activesStyle,
                        }),
                    },
                ]}
                onTouchStart={() => {
                    if (value !== unit2) {
                        onChange(unit2);
                    }
                }}
            >
                <Text color={value === unit2 ? white : black}>{unit2}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 32,
        width: "90%",
        alignSelf: "center",
        padding: 2,
        overflow: "hidden",
    },
    item: {
        flex: 1,
        alignItems: "center",
        borderRadius: 32,
        paddingHorizontal: 15,
        width: "100%",
    },
});
