import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { InputQuizProps } from "../../../types/quiz.types";
import { GradientCheckbox } from "./utils/gradient-checkbox";

export const HealthGoals = ({ options, onChange, value }: InputQuizProps) => {
    const [selected, setSelected] = React.useState<string[]>(value || "");

    const onCheckPressed = (option: string) => {
        const isSelected = selected.includes(option);
        if (isSelected) {
            setSelected(selected.filter((item) => item !== option));
            onChange(selected.filter((item) => item !== option));
        } else {
            setSelected([...selected, option]);
            onChange([...selected, option]);
        }
    };

    return (
        <ScrollView
            style={styles.containerButtons}
            showsVerticalScrollIndicator={false}
        >
            {options?.map((option, i) => (
                <GradientCheckbox
                    key={i}
                    item={option.text}
                    isSelected={selected.includes(option.value)}
                    onChange={() => onCheckPressed(option.value)}
                    rigthIcon={
                        selected.includes(option.value)
                            ? option.iconActive
                            : option.icon
                    }
                />
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    containerButtons: {
        gap: 5,
    },

    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        marginVertical: 5,
        borderRadius: 50,
        backgroundColor: "white",
    },

    label: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
});
