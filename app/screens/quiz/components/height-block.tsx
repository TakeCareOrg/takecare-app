import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text } from "@components/ui/text";
import {
    HeightUnit,
    InputQuizProps,
    QuizUserResponse,
} from "@dtypes/quiz-types";
import { useColorTheme } from "@hooks/use-color-theme";
import { convertHeight, formatDisplayValue } from "@utils/convert-unit";

import { PreciseSlider } from "./precise-slider";
import { UnitSelector } from "./unit-selector";

type HeightBlockProps = InputQuizProps & {
    value: number;
    unitValue: HeightUnit;
};

export function HeightBlock({
    value,
    onChange,
    unitValue = "cm",
}: HeightBlockProps) {
    const [initialLoad, setInitialLoad] = useState(true);
    const { white } = useColorTheme();

    const displayValue = formatDisplayValue(value, unitValue);

    // Handle unit change
    useEffect(() => {
        if (!initialLoad) {
            const convertedValue =
                unitValue === "ft"
                    ? convertHeight(value, "cm", "ft")
                    : convertHeight(value, "ft", "cm");

            onChange((prev: QuizUserResponse) => ({
                ...prev,
                height: convertedValue,
            }));
        } else {
            setInitialLoad(false);
        }
    }, [unitValue]);

    const handleUnitChange = useCallback(
        (selectedUnit: HeightUnit) => {
            onChange((prev: QuizUserResponse) => ({
                ...prev,
                height_unit: selectedUnit,
            }));
        },
        [onChange],
    );

    const handleValueChange = useCallback(
        (selectedValue: number) => {
            if (
                isNaN(selectedValue) ||
                selectedValue === null ||
                selectedValue === undefined
            ) {
                selectedValue = 0;
            }

            const formattedValue = formatDisplayValue(selectedValue, unitValue);

            onChange((prev: QuizUserResponse) => ({
                ...prev,
                height: formattedValue,
            }));
        },
        [onChange, unitValue],
    );

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <UnitSelector
                    unit1={"ft"}
                    unit2={"cm"}
                    onChange={(e: HeightUnit) => handleUnitChange(e)}
                    value={unitValue as HeightUnit}
                />
                <View style={styles.valueDisplay}>
                    <Text fontSize={88} color={white}>
                        {displayValue}
                    </Text>
                    <Text
                        fontSize={16}
                        color={white}
                        style={{ lineHeight: 42 }}
                        font="Poppins-Bold"
                    >
                        {unitValue}
                    </Text>
                </View>
                <PreciseSlider
                    onChange={handleValueChange}
                    value={value}
                    step={unitValue === "cm" ? 1 : 0.1}
                    unit={unitValue}
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        justifyContent: "center",
        alignItems: "stretch",
    },
    valueDisplay: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-end",
    },
});
