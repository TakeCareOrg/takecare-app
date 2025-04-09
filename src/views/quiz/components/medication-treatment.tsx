import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { useColors } from "../../../styles/Colors";
import { InputQuizProps } from "../../../types/quiz.types";
import { TextComponent } from "../../../ui/text-component";

const { height, width } = Dimensions.get("window");

export const MedicationTreatment = ({
    options,
    onChange,
    value,
}: InputQuizProps) => {
    const { main, quiz } = useColors();

    return (
        <View style={styles.container}>
            {options?.map((option, i) => (
                <TouchableOpacity
                    key={i}
                    style={[
                        styles.box,
                        {
                            backgroundColor:
                                value === option.value
                                    ? main.blueGray
                                    : "white",
                            shadowColor:
                                value === option.value
                                    ? quiz.shadow
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
                    onPress={() => onChange(option.value)}
                >
                    {value === option.value ? option.iconActive : option.icon}
                    <TextComponent
                        font="Urbanist"
                        textWeight="bold"
                        fontSize={16}
                        color={value === option.value ? main.white : main.black}
                    >
                        {option.text}
                    </TextComponent>
                </TouchableOpacity>
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
