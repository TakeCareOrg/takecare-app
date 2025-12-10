import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
} from "react-native";

interface CustomButtonProps extends TouchableOpacityProps {
    onPress: () => void;
    title?: string;
    children?: React.ReactNode;
    isLoading?: boolean;
    variant?: "primary" | "secondary" | "outline";
    size?: "default" | "square";
}

export const Button = ({
    onPress,
    title,
    children,
    variant = "primary",
    isLoading = false,
    size = "default",
    ...props
}: CustomButtonProps) => {
    return (
        <TouchableOpacity
            style={[
                styles.container,
                !props.disabled && variant !== "outline" && styles.shadow,
                props.disabled ? styles.disabled : styles[variant],
                size === "square" && styles.square,
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
        shadowOpacity: 0.5,
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
    square: {
        paddingHorizontal: 0,
        paddingVertical: 0,
        width: 35,
        height: 35,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
});
