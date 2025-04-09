import React, { useState } from "react";
import {
    DimensionValue,
    StyleSheet,
    TextStyle,
    TouchableHighlight,
    View,
} from "react-native";
import { TextComponent } from "../text-component";
import { FunctionComponent } from "react";
import { useColors } from "../../styles/Colors";

type ButtonProps = {
    title: string;
    onPress: () => void;
    style?: TextStyle;
    backgroundColor?: string;
    color?: string;
    width?: DimensionValue;
    height?: DimensionValue;
};

export const Button: FunctionComponent<ButtonProps> = ({
    title,
    onPress,
    style,
    backgroundColor,
    color,
    width = 150,
    height = 30,
}) => {
    const [pressed, setPressed] = useState<boolean>(false);
    const { main } = useColors();

    const buttonColor = backgroundColor || main.button;
    const buttonTextColor = color || main.white;

    const styles = ButtonStyle(buttonColor);

    return (
        <TouchableHighlight
            style={[
                styles.touchableContainer,
                {
                    width: width,
                    height: height,
                },
                style,
            ]}
            onPress={() => onPress()}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            underlayColor="transparent"
        >
            <View
                style={[
                    styles.buttonContainer,
                    { backgroundColor: backgroundColor },
                ]}
            >
                <TextComponent color={buttonTextColor} fontSize={13}>
                    {title}
                </TextComponent>
                {pressed && <View style={styles.overlay} />}
            </View>
        </TouchableHighlight>
    );
};

function ButtonStyle(backgroundColor: string) {
    let backgroundOverlay;
    //? just a simple logic to change the overlay color based on the button color

    const { main } = useColors();
    if (backgroundColor === main.button) {
        backgroundOverlay = "rgba(255, 255, 255, 0.2)";
    } else {
        backgroundOverlay = "rgba(0, 0, 0, 0.1)";
    }

    const styles = StyleSheet.create({
        touchableContainer: {
            borderRadius: 30,
            overflow: "hidden",
        },
        buttonContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
        },
        overlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: backgroundOverlay,
        },
    });

    return styles;
}
