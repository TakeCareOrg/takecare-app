import { useCallback } from "react";
import { StyleSheet, View } from "react-native";

import { InputQuizProps, Option, QuizUserResponse } from "@dtypes/quiz-types";

import { BoxItem } from "./utils/box-item";

type MedicationTreatmentProps = InputQuizProps & {
    options: Option[];
    selected: string[];
};

export const MedicationTreatment = ({
    options,
    onChange,
    selected,
}: MedicationTreatmentProps) => {
    const handleToggle = useCallback(
        (value: string | number) => {
            const valueStr = String(value);
            const isSelected = selected.includes(valueStr);
            const newSelected = isSelected
                ? selected.filter((item) => item !== valueStr)
                : [...selected, valueStr];

            onChange((prev: QuizUserResponse) => ({
                ...prev,
                medication_treatment: newSelected,
            }));
        },
        [selected, onChange],
    );

    return (
        <View style={styles.container}>
            {options?.map((option, i) => {
                return (
                    <BoxItem
                        key={i}
                        option={option}
                        onChange={handleToggle}
                        value={
                            selected.some(
                                (selectedItem) => selectedItem === option.value,
                            )
                                ? option.value
                                : undefined
                        }
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
    },
});
