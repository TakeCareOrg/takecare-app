import { StyleSheet, View } from "react-native";
import React from "react";
import { AlcoholSmokeItem } from "./utils/alcohol-smoke-item";
import { InputQuizProps } from "../../../types/quiz.types";

export const AlcoholSmokeBlock = ({
    options,
    onChange,
    value,
}: InputQuizProps) => {
    return (
        <View style={styles.container}>
            {options?.map((option, i) => (
                <AlcoholSmokeItem
                    key={i}
                    option={option}
                    onChange={onChange}
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
