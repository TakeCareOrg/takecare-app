import React from "react";
import {
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    TouchableOpacityProps,
} from "react-native";
import { Text } from "react-native";

interface CustomButtonProps extends TouchableOpacityProps {
    onPress: () => void;
    title?: string;
    children?: React.ReactNode;
    isLoading?: boolean;
    variant?: "primary" | "secondary" | "outline";
}

export const Button = ({
    onPress,
    title,
    children,
    variant = "primary",
    isLoading = false,
    ...props
}: CustomButtonProps) => {
    return (
        <TouchableOpacity
            style={[
                styles.container,
                !props.disabled && variant !== "outline" && styles.shadow,
                props.disabled ? styles.disabled : styles[variant],
            ]}
            onPress={isLoading ? undefined : onPress}
            {...props}
        >
            {isLoading ? (
                <ActivityIndicator color={"white"} />
            ) : !children ? (
                <Text
                    style={{
                        ...styles.text,
                        color: props.disabled
                            ? "#8E8E8E"
                            : styles[`text_${variant}`].color,
                    }}
                >
                    {title}
                </Text>
            ) : (
                children
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 12,
        justifyContent: "center",
    },
    text: {
        fontSize: 16,
        textAlign: "center",
        fontWeight: 500,
    },
    shadow: {
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 5,
        shadowColor: "#7889D2",
    },
    disabled: {
        backgroundColor: "#CFDBD5",
        shadowColor: "none",
    },
    primary: {
        backgroundColor: "#7889D2",
    },
    secondary: {
        backgroundColor: "#7889D2",
    },
    outline: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: "#7889D2",
    },
    text_primary: {
        color: "white",
    },
    text_secondary: {
        color: "white",
    },
    text_outline: {
        color: "#7889D2",
    },
});
