import React from "react";
import { View, StyleSheet } from "react-native";
import DatePicker from "react-native-date-picker";
import { getDeviceLocale } from "../../utils/system-local-lang";
import { InputQuizProps } from "../../types/quiz.types";

export const DatePickerInput = ({ value, onChange }: InputQuizProps) => {
    const locales = getDeviceLocale();

    return (
        <View style={styles.container}>
            <DatePicker
                date={value}
                onDateChange={onChange}
                mode="date"
                locale={locales}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
