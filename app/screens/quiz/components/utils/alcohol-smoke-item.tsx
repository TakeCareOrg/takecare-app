import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";

import { Text } from "@app/components/ui/text";
import { Option } from "@dtypes/quiz-types";
import { useColorTheme } from "@hooks/use-color-theme";

const { height, width } = Dimensions.get("window");

interface AlcoholSmokeItemProps {
    option: Option;
    onChange: (value: string | number) => void;
    value?: string | number;
}

export const AlcoholSmokeItem = ({
    option,
    onChange,
    value,
}: AlcoholSmokeItemProps) => {
    const { background, text, shadow } = useColorTheme();

    return (
        <TouchableOpacity
            style={[
                styles.box,
                {
                    backgroundColor:
                        value === option.value ? background : "white",
                    shadowColor:
                        value === option.value ? shadow : "transparent",
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
            <Text
                font="Poppins-Medium"
                fontSize={16}
                color={value === option.value ? text : text}
            >
                {option.text}
            </Text>
            <View
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0,
                }}
            >
                {option.numberIcon ? (
                    Array.from({ length: option.numberIcon }).map(
                        (_, index) => (
                            <React.Fragment key={index}>
                                {value === option.value
                                    ? option.iconActive
                                    : option.icon}
                            </React.Fragment>
                        ),
                    )
                ) : (
                    <React.Fragment>
                        {value === option.value
                            ? option.iconActive
                            : option.icon}
                    </React.Fragment>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    box: {
        padding: 16,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        borderRadius: 32,
        width: width / 2.35,
        height: height / 4.5,
        marginVertical: 8,
    },
});
