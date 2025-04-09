import { StyleSheet, View } from "react-native";
import React, { useCallback } from "react";
import { TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import { InputQuizProps } from "../../../types/quiz.types";
import { useColors } from "../../../styles/Colors";
import { TextComponent } from "../../../ui/text-component";

export const EndMessage = ({ value, onChange }: InputQuizProps) => {
    const { quiz, main } = useColors();
    const { t } = useTranslation();

    const handleChangeText = useCallback(
        (text: string) => {
            if (text.length <= 250) {
                onChange(text);
            }
        },
        [onChange],
    );

    return (
        <View style={styles.container}>
            <TextInput
                multiline={true}
                numberOfLines={10}
                style={{ ...styles.textarea, shadowColor: quiz.shadow }}
                onChangeText={handleChangeText}
                value={value}
                textAlignVertical="top"
                placeholder={t("QUIZ.TYPE_SOMETHING")}
            />
            <TextComponent
                font="Urbanist"
                textWeight="bold"
                fontSize={12}
                color={main.black}
                style={{
                    opacity: 0.5,
                    position: "absolute",
                    bottom: 10,
                    right: 30,
                    zIndex: 10,
                }}
            >
                {value.length}/250
            </TextComponent>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
    },
    textarea: {
        minHeight: 200,
        maxHeight: 300,
        backgroundColor: "white",
        borderRadius: 32,
        paddingTop: 16,
        paddingBottom: 16,
        paddingHorizontal: 16,
        width: "90%",
        alignItems: "flex-start",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.8,
        shadowRadius: 6.27,
        elevation: 10,
        zIndex: 1,
        color: "black",
    },
});
