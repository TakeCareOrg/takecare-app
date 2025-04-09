import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useColors } from "../../../styles/Colors";
import {
    InputQuizProps,
    QuizUserResponse,
    WeightUnit,
} from "../../../types/quiz.types";
import { TextComponent } from "../../../ui/text-component";
import { convertWeight, formatDisplayValue } from "../../../utils/convert-unit";
import { PreciseSlider } from "./precise-slider";
import { UnitSelector } from "./unit-selector";

interface WeightBlockProps extends InputQuizProps {
    unitValue: WeightUnit;
}

export const WeightBlock: React.FC<WeightBlockProps> = ({
    value,
    onChange,
    unitValue,
}) => {
    const [initialLoad, setInitialLoad] = useState(true);
    const { white } = useColors();

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
                globalIndex: Math.round(convertedValue / 0.2),
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
                    <TextComponent fontSize={88} color={white.white900}>
                        {displayValue}
                    </TextComponent>
                    <TextComponent
                        fontSize={16}
                        color={white.white800}
                        style={{ lineHeight: 42 }}
                        font="Urbanist"
                        textWeight="extrabold"
                    >
                        {unitValue}
                    </TextComponent>
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
};

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
