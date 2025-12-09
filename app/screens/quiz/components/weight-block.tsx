import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text } from "@components/ui/text";
import {
    InputQuizProps,
    QuizUserResponse,
    WeightUnit,
} from "@dtypes/quiz-types";
import { useColorTheme } from "@hooks/use-color-theme";
import { convertWeight, formatDisplayValue } from "@utils/convert-unit";

import { PreciseSlider } from "./precise-slider";
import { UnitSelector } from "./unit-selector";

interface WeightBlockProps extends InputQuizProps {
    value: number;
    unitValue: WeightUnit;
}

export function WeightBlock({ value, onChange, unitValue }: WeightBlockProps) {
    const [initialLoad, setInitialLoad] = useState(true);
    const { white } = useColorTheme();

    const displayValue = formatDisplayValue(value, unitValue);

    useEffect(() => {
        if (!initialLoad) {
            const convertedValue =
                unitValue === "lbs"
                    ? convertWeight(value, "kg", "lbs")
                    : convertWeight(value, "lbs", "kg");

            onChange((prev: QuizUserResponse) => ({
                ...prev,
                weight: convertedValue,
            }));
        }
        setInitialLoad(false);
    }, [unitValue]);

    const handleValueChange = useCallback(
        (val: number) => {
            if (isNaN(val) || val === null || val === undefined) {
                val = 0;
            }

            const roundedValue = Math.round(val * 5) / 5;

            onChange((prev: QuizUserResponse) => ({
                ...prev,
                weight: roundedValue,
            }));
        },
        [onChange],
    );

    const handleUnitChange = useCallback(
        (selectedUnit: WeightUnit) => {
            onChange((prev: QuizUserResponse) => ({
                ...prev,
                weight_unit: selectedUnit,
            }));
        },
        [onChange],
    );

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <UnitSelector
                    unit1={"lbs"}
                    unit2={"kg"}
                    onChange={(e: WeightUnit) => handleUnitChange(e)}
                    value={unitValue}
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
                    step={0.2}
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
