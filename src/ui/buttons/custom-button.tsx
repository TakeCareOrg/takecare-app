import React from "react";
import { StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Text } from "react-native";

interface CustomButtonProps {
    onPress: () => void;
    title?: string;
    disabled?: boolean;
    customStyle?: object;
    background?: boolean;
    textColor?: string;
    children?: React.ReactNode;
    isLoading?: boolean;
}

function CustomButton({
    onPress,
    title,
    disabled,
    customStyle,
    background = true,
    textColor,
    children,
    isLoading,
}: CustomButtonProps): React.JSX.Element {
    return (
        <TouchableOpacity
            style={[
                styles.container,
                background && !disabled && styles.shadow,
                customStyle,
                disabled
                    ? styles.disabled
                    : {
                          backgroundColor: background
                              ? "#7889D2"
                              : "transparent",
                          shadowColor: background ? "#394792" : "none",
                      },
                { height: !children ? 48 : "auto" },
            ]}
            onPress={onPress}
            disabled={disabled || isLoading}
        >
            {isLoading ? (
                <ActivityIndicator color={"white"} />
            ) : !children ? (
                <Text
                    style={{
                        ...styles.text,
                        color: disabled
                            ? "#8E8E8E"
                            : textColor
                            ? textColor
                            : "#fff",
                    }}
                >
                    {title}
                </Text>
            ) : (
                children
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        paddingHorizontal: 10,
        justifyContent: "center",
    },
    text: {
        fontSize: 18,
        textAlign: "center",
        padding: 10,
        fontWeight: "600",
    },
    shadow: {
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 3,
    },
    disabled: {
        backgroundColor: "#CFDBD5",
        shadowColor: "none",
    },
});

export default CustomButton;
