import Feather from "@expo/vector-icons/Feather";
import React, { forwardRef, useState } from "react";
import {
    StyleProp,
    StyleSheet,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

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

        return (
            <View
                style={[
                    styles.container,
                    containerStyle,
                    isFocused && styles.focused,
                    { borderColor: "#7889D2", shadowColor: "#7889D2" },
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
                        color: "#736B66",
                        fontSize: 14,
                        flex: 1,
                    }}
                    placeholderTextColor={"#8E8E8E"}
                    {...props}
                />

                {isPassword && (
                    <TouchableOpacity
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                        {!isPasswordVisible ? (
                            <Feather name="eye" size={18} color={"#7889D2"} />
                        ) : (
                            <Feather
                                name="eye-off"
                                size={18}
                                color={"#7889D2"}
                            />
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
