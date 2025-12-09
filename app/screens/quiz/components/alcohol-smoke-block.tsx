import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";

import {
    InputQuizProps,
    Option,
    QuizUserResponse,
} from "@app/types/quiz-types";

import { AlcoholSmokeItem } from "./utils/alcohol-smoke-item";

type AlcoholSmokeBlockProps = InputQuizProps & {
    options: Option[];
    value?: string;
    fieldKey: "alcohol" | "smoking";
};

export const AlcoholSmokeBlock = ({
    options,
    onChange,
    value,
    fieldKey,
}: AlcoholSmokeBlockProps) => {
    const handleChange = useCallback(
        (selectedValue: string | number) => {
            onChange((prev: QuizUserResponse) => ({
                ...prev,
                [fieldKey]: selectedValue,
            }));
        },
        [onChange, fieldKey],
    );

    return (
        <View style={styles.container}>
            {options?.map((option, i) => (
                <AlcoholSmokeItem
                    key={i}
                    option={option}
                    onChange={handleChange}
                    value={value}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
    },
});
