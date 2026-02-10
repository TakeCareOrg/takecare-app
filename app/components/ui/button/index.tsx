import React, { useMemo } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
} from "react-native";

import { useColorTheme } from "@app/hooks/use-color-theme";

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
    const { shadow, disabled, text, border, button, secondary } =
        useColorTheme();

    // Create dynamic variant styles based on theme
    const variantStyles = useMemo(
        () => ({
            primary: {
                backgroundColor: button,
            },
            secondary: {
                backgroundColor: secondary,
            },
            outline: {
                backgroundColor: "transparent",
                borderWidth: 2,
                borderColor: border,
            },
        }),
        [button, secondary, border],
    );

    const textVariantStyles = useMemo(
        () => ({
            primary: { color: "#FFF" },
            secondary: { color: text },
            outline: { color: text },
        }),
        [text],
    );

    return (
        <TouchableOpacity
            {...props}
            style={[
                styles.container,
                !props.disabled &&
                    variant !== "outline" && {
                        ...styles.shadow,
                        shadowColor: shadow,
                    },
                props.disabled
                    ? { ...styles.disabled, backgroundColor: disabled }
                    : variantStyles[variant],
                size === "square" && styles.square,
                props.style,
            ]}
            onPress={isLoading ? undefined : onPress}
        >
            {isLoading ? (
                <ActivityIndicator color={text} />
            ) : !children ? (
                <Text
                    style={{
                        ...styles.text,
                        color: props.disabled
                            ? text
                            : textVariantStyles[variant].color,
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
    },
    disabled: {
        shadowColor: "none",
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
