import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useColors } from "../../../styles/Colors";
import {
    HeightUnit,
    InputQuizProps,
    QuizUserResponse,
} from "../../../types/quiz.types";
import { TextComponent } from "../../../ui/text-component";
import { convertHeight, formatDisplayValue } from "../../../utils/convert-unit";
import { PreciseSlider } from "./precise-slider";
import { UnitSelector } from "./unit-selector";

interface HeightBlockProps extends InputQuizProps {
    unitValue: HeightUnit;
}

export const HeightBlock: React.FC<HeightBlockProps> = ({
    value,
    onChange,
    unitValue,
}) => {
    const [initialLoad, setInitialLoad] = useState(true);
    const { white } = useColors();

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
                    step={unitValue === "cm" ? 1 : 0.1}
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
