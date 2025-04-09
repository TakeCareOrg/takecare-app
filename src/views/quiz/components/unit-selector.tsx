import React from "react";
import { StyleSheet, View } from "react-native";
import { useColors } from "../../../styles/Colors";
import { padding } from "../../../styles/global-style";
import { HeightUnit, WeightUnit } from "../../../types/quiz.types";
import { TextComponent } from "../../../ui/text-component";

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
    const { main, quiz } = useColors();

    const activesStyle = {
        backgroundColor: main.blueGray,
        shadowColor: quiz.shadow,
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.0,
        elevation: 24,
        zIndex: 1,
        color: main.white,
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
                <TextComponent
                    color={value === unit1 ? main.white : main.black}
                >
                    {unit1}
                </TextComponent>
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
                <TextComponent
                    color={value === unit2 ? main.white : main.black}
                >
                    {unit2}
                </TextComponent>
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
        ...padding(15, 0),
        width: "100%",
    },
});
