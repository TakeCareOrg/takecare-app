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
    varint?: "primary" | "secondary" | "outline";
}

export const Button = ({
    onPress,
    title,
    children,
    varint = "primary",
    isLoading = false,
    ...props
}: CustomButtonProps) => {
    return (
        <TouchableOpacity
            style={[
                styles.container,
                !props.disabled && varint !== "outline" && styles.shadow,
                props.disabled ? styles.disabled : styles[varint],
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
                            : styles[`text_${varint}`].color,
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
        justifyContent: "center",
    },
    text: {
        fontSize: 16,
        textAlign: "center",
        padding: 10,
        fontWeight: 500,
    },
    shadow: {
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 5,
        shadowColor: "#5856D6",
    },
    disabled: {
        backgroundColor: "#CFDBD5",
        shadowColor: "none",
    },
    primary: {
        backgroundColor: "#5856D6",
    },
    secondary: {
        backgroundColor: "#5856D6",
    },
    outline: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: "#5856D6",
    },
    text_primary: {
        color: "white",
    },
    text_secondary: {
        color: "white",
    },
    text_outline: {
        color: "#5856D6",
    },
});
