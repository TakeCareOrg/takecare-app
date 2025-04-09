import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useColors } from "../../../styles/Colors";
import { InputQuizProps } from "../../../types/quiz.types";
import { TextComponent } from "../../../ui/text-component";

export const StressLevel = ({ value, options, onChange }: InputQuizProps) => {
    const { main } = useColors();
    return (
        <View style={styles.container}>
            <TextComponent
                font="Urbanist"
                textWeight="extrabold"
                fontSize={180}
                color={main.primary}
            >
                {value}
            </TextComponent>
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
                        onPress={() => onChange(option.value)}
                    >
                        <View
                            style={{
                                backgroundColor:
                                    value === option.value
                                        ? main.blueGray
                                        : "white",
                                width: 50,
                                height: 50,
                                borderRadius: 50,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <TextComponent
                                font="Urbanist"
                                textWeight="bold"
                                fontSize={20}
                                color={
                                    value === option.value
                                        ? main.white
                                        : main.black
                                }
                            >
                                {option.text}
                            </TextComponent>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
            <View
                style={{
                    opacity: 0.5,
                    marginTop: 20,
                }}
            >
                <TextComponent
                    font="Urbanist"
                    textWeight="bold"
                    fontSize={14}
                    color={main.primary}
                >
                    {options && options[value - 1].description}
                </TextComponent>
            </View>
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
