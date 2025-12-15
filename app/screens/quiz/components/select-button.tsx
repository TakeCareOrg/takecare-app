import React from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";

import { InputQuizProps, Option, QuizUserResponse } from "@dtypes/quiz-types";
import { useColorTheme } from "@hooks/use-color-theme";

type SelectButtonProps = InputQuizProps & {
    options: Option[];
    value: string;
    fieldKey: keyof QuizUserResponse;
};

export const SelectButton = ({
    options,
    onChange,
    value,
    fieldKey,
}: SelectButtonProps) => {
    const { white, shadow } = useColorTheme();

    return (
        <View style={styles.container}>
            {options?.map((option, i) => (
                <View
                    key={i}
                    style={{
                        ...(value === option.value && {
                            shadowColor: shadow,
                            shadowOffset: {
                                width: 0,
                                height: 5,
                            },
                            shadowOpacity: 0.8,
                            shadowRadius: 6.27,
                            elevation: 10,
                            zIndex: 1,
                        }),
                    }}
                >
                    <TouchableWithoutFeedback
                        onPress={() => {
                            if (value !== option.value) {
                                onChange((prev: QuizUserResponse) => ({
                                    ...prev,
                                    [fieldKey]: option.value,
                                }));
                            } else {
                                onChange((prev: QuizUserResponse) => ({
                                    ...prev,
                                    [fieldKey]: "",
                                }));
                            }
                        }}
                    >
                        <View
                            style={[
                                {
                                    ...styles.button,
                                    backgroundColor: white,
                                    ...(value === option.value && {
                                        shadowColor: shadow,
                                        shadowOffset: {
                                            width: 0,
                                            height: 10,
                                        },
                                        shadowOpacity: 0.8,
                                        shadowRadius: 6.27,
                                        elevation: 10,
                                        borderWidth: 1,
                                        borderColor: shadow,
                                    }),
                                },
                            ]}
                        >
                            {option.image}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
    },
    button: {
        borderRadius: 32,
        marginBottom: 10,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden", // Ensure this is not causing shadow clipping
        zIndex: 2,
    },
});
