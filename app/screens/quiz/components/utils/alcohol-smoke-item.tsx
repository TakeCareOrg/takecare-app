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
    const { background, text, shadow, blue, white } = useColorTheme();

    return (
        <TouchableOpacity
            style={[
                styles.box,
                {
                    backgroundColor:
                        value === option.value ? blue[200] : background,
                    shadowColor: shadow,
                    shadowOffset: {
                        width: 0,
                        height: 5,
                    },
                    shadowOpacity: value === option.value ? 0.8 : 0.2,
                    shadowRadius: 3,
                    elevation: 10,
                    zIndex: 1,
                },
            ]}
            onPress={() => onChange(option.value)}
        >
            <Text
                font="Poppins-Medium"
                fontSize={13}
                color={value === option.value ? white : text}
            >
                {option.text}
            </Text>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
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
        height: height / 5,
        width: width / 2.3,
    },
});
