import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";

import { Colors } from "../../../../styles/Colors";
import { Option } from "../../../../types/quiz-types";
import { TextComponent } from "../../../../ui/text-component";

const { height, width } = Dimensions.get("window");

interface AlcoholSmokeItemProps {
    option: Option;
    onChange: (value: any) => void;
    value?: any;
}

export const AlcoholSmokeItem = ({
    option,
    onChange,
    value,
}: AlcoholSmokeItemProps) => {
    const { main, quiz } = Colors();

    return (
        <TouchableOpacity
            style={[
                styles.box,
                {
                    backgroundColor:
                        value === option.value ? main.blueGray : "white",
                    shadowColor:
                        value === option.value ? quiz.shadow : "transparent",
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
                textWeight="bold"
                fontSize={16}
                color={value === option.value ? main.white : main.black}
            >
                {option.text}
            </TextComponent>
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
