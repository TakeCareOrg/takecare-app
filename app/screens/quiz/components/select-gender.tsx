import React, { useCallback } from "react";
import {
    Dimensions,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from "react-native";

import {
    InputQuizProps,
    Option,
    QuizUserResponse,
} from "@app/types/quiz-types";
import { useColorTheme } from "@hooks/use-color-theme";

import { useQuizFlow } from "../quiz-context";

const { height } = Dimensions.get("window");

type SelectGenderProps = InputQuizProps & {
    options: Option[];
    gender?: string;
};

export const SelectGender: React.FC<SelectGenderProps> = ({
    options,
    onChange,
    gender,
}) => {
    const { white, shadow } = useColorTheme();
    const { goNext } = useQuizFlow();

    const handleSelect = useCallback(
        (value: string | number) => {
            onChange((prev: QuizUserResponse) => ({
                ...prev,
                gender: value as "male" | "female",
            }));
            // Auto-advance after selection
            setTimeout(() => goNext(), 300);
        },
        [onChange, goNext],
    );

    return (
        <View style={styles.container}>
            {options?.map((option, i) => (
                <View
                    key={i}
                    style={{
                        ...(gender === option.value && {
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
                        onPress={() => handleSelect(option.value)}
                    >
                        <View
                            style={[
                                {
                                    ...styles.button,
                                    backgroundColor: white,
                                    ...(gender === option.value && {
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
        height: height / 4.5,
        borderRadius: 32,
        marginBottom: 16,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden", // Ensure this is not causing shadow clipping
        zIndex: 2,
    },
});
