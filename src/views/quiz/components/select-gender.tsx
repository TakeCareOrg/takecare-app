import React from "react";
import {
    Dimensions,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useColors } from "../../../styles/Colors";
import { padding } from "../../../styles/global-style";
import { InputQuizProps } from "../../../types/quiz.types";

const { height } = Dimensions.get("window");

export const SelectGender: React.FC<InputQuizProps> = ({
    options,
    onChange,
    value,
}) => {
    const { main, quiz } = useColors();

    return (
        <View style={styles.container}>
            {options?.map((option, i) => (
                <View
                    key={i}
                    style={{
                        ...(value === option.value && {
                            shadowColor: quiz.shadow,
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
                        onPress={() => onChange(option.value)}
                    >
                        <View
                            style={[
                                {
                                    ...styles.button,
                                    backgroundColor: main.white,
                                    ...(value === option.value && {
                                        shadowColor: quiz.shadow,
                                        shadowOffset: {
                                            width: 0,
                                            height: 10,
                                        },
                                        shadowOpacity: 0.8,
                                        shadowRadius: 6.27,
                                        elevation: 10,
                                        borderWidth: 1,
                                        borderColor: quiz.shadow,
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
        ...padding(0, 10),
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
