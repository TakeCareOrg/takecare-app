import Feather from "@expo/vector-icons/Feather";
import { forwardRef, useState } from "react";
import {
    StyleProp,
    StyleSheet,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

import { useColorTheme } from "@app/hooks/use-color-theme";

type CustomInputProps = {
    value: string;
    onChangeText: (text: string) => void;
    containerStyle?: StyleProp<ViewStyle>;
    isPassword?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
} & TextInputProps;

export const Input = forwardRef<TextInput, CustomInputProps>(
    (
        { value, onChangeText, containerStyle, isPassword = false, ...props },
        ref,
    ) => {
        const [isFocused, setIsFocused] = useState(false);
        const [isPasswordVisible, setIsPasswordVisible] = useState(
            isPassword || false,
        );
        const { text, border, input, placeholder } = useColorTheme();

        return (
            <View
                style={[
                    styles.container,
                    { backgroundColor: input },
                    containerStyle,
                    isFocused && styles.focused,
                    { borderColor: border, shadowColor: border },
                ]}
            >
                {props.leftIcon && (
                    <View style={{ marginRight: 5 }}>{props.leftIcon}</View>
                )}
                <TextInput
                    ref={ref}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={isPassword ? isPasswordVisible : false}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    style={{
                        color: text,
                        fontSize: 14,
                        flex: 1,
                    }}
                    placeholderTextColor={placeholder}
                    {...props}
                />

                {isPassword && (
                    <TouchableOpacity
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                        {!isPasswordVisible ? (
                            <Feather name="eye" size={18} color={border} />
                        ) : (
                            <Feather name="eye-off" size={18} color={border} />
                        )}
                    </TouchableOpacity>
                )}
            </View>
        );
    },
);
Input.displayName = "Input";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 16,
        borderWidth: 2,
        paddingHorizontal: 10,
        paddingVertical: 12,
    },
    focused: {
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
});
