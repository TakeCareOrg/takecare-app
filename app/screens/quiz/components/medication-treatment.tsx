import React, { useCallback } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { InputQuizProps, Option, QuizUserResponse } from "@dtypes/quiz-types";
import { useColorTheme } from "@hooks/use-color-theme";

const { height, width } = Dimensions.get("window");

type MedicationTreatmentProps = InputQuizProps & {
    options: Option[];
    selected: string[];
};

export function MedicationTreatment({
    options,
    onChange,
    selected,
}: MedicationTreatmentProps) {
    const { blue, white, black, shadow } = useColorTheme();

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
                const isSelected = selected.includes(String(option.value));
                return (
                    <TouchableOpacity
                        key={i}
                        style={[
                            styles.box,
                            {
                                backgroundColor: isSelected
                                    ? blue[500]
                                    : "white",
                                shadowColor: isSelected
                                    ? shadow
                                    : "transparent",
                                shadowOffset: {
                                    width: 0,
                                    height: 5,
                                },
                                shadowOpacity: 0.8,
                                shadowRadius: 6.27,
                                elevation: 10,
                                zIndex: 1,
                            },
                        ]}
                        onPress={() => handleToggle(option.value)}
                    >
                        {isSelected ? option.iconActive : option.icon}
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                color: isSelected ? white : black,
                            }}
                        >
                            {option.text}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
    },
    box: {
        padding: 16,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        borderRadius: 32,
        width: width / 2.35,
        height: height / 4.4,
        marginVertical: 8,
    },
});
