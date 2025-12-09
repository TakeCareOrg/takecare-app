import React, { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { InputQuizProps, Option, QuizUserResponse } from "@dtypes/quiz-types";
import { useColorTheme } from "@hooks/use-color-theme";

type StressLevelProps = InputQuizProps & {
    level?: number;
    options: Option[];
};

export const StressLevel = ({ level, options, onChange }: StressLevelProps) => {
    const { blue, white, black } = useColorTheme();

    const handleSelect = useCallback(
        (value: string | number) => {
            onChange((prev: QuizUserResponse) => ({
                ...prev,
                stress_level: value as number,
            }));
        },
        [onChange],
    );
    return (
        <View style={styles.container}>
            <Text
                style={{
                    fontSize: 180,
                    fontWeight: "bold",
                    color: blue[500],
                }}
            >
                {level || "-"}
            </Text>
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 20,
                    backgroundColor: "white",
                    padding: 6,
                    borderRadius: 50,
                }}
            >
                {options?.map((option, i) => (
                    <TouchableOpacity
                        key={i}
                        style={[styles.button]}
                        onPress={() => handleSelect(option.value)}
                    >
                        <View
                            style={{
                                backgroundColor:
                                    level === option.value
                                        ? blue[500]
                                        : "white",
                                width: 50,
                                height: 50,
                                borderRadius: 50,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    color:
                                        level === option.value ? white : black,
                                }}
                            >
                                {option.text}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
            {level && options && options[level - 1] && (
                <View
                    style={{
                        opacity: 0.5,
                        marginTop: 20,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: "bold",
                            color: blue[500],
                        }}
                    >
                        {options[level - 1].description}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
    },
});
