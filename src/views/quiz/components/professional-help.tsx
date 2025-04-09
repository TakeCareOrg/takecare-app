import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ProfessionalHelpImg } from "../../../../assets/images/illustrations/ProfessionalHelpImg";
import { useColors } from "../../../styles/Colors";
import { InputQuizProps } from "../../../types/quiz.types";
import { TextComponent } from "../../../ui/text-component";

export const ProfessionalHelp = ({
    onChange,
    value,
    options,
}: InputQuizProps) => {
    const { main, quiz } = useColors();

    return (
        <View style={styles.container}>
            <ProfessionalHelpImg />
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 50,
                    width: "90%",
                }}
            >
                {options?.map((option, i) => (
                    <TouchableOpacity
                        key={i}
                        style={[
                            styles.button,
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
                        <TextComponent
                            font="Urbanist"
                            textWeight="extrabold"
                            fontSize={18}
                            color={
                                value === option.value ? main.white : main.black
                            }
                        >
                            {option.text}
                        </TextComponent>
                    </TouchableOpacity>
                ))}
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
        padding: 16,
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        width: "47%",
    },
});
