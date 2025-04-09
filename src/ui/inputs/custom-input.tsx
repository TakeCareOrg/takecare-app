import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Input } from "@rneui/base";
import Feather from "react-native-vector-icons/Feather";

type CustomInputProps = {
    placeholder: string;
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    autoCorrect?: boolean;
    editable?: boolean;
    leftIcon?: React.ReactElement;
    rightIcon?: React.ReactElement;
    isPassword?: boolean;
    iconColor?: string;
    autoComplete?: any;
    containerStyle?: any;
    labelStyle?: any;
    inputStyle?: any;
    placeholderTextColor?: string;
    multiline?: boolean;
    disabled?: boolean;
    labelColor?: string;
    inputBoderColor?: string;
    inputShadowColor?: string;
    textColor?: string;
    inputBackgroundColor?: string;
};

function CustomInput({
    placeholder,
    label,
    value,
    onChangeText,
    leftIcon,
    rightIcon,
    secureTextEntry = false,
    isPassword = false,
    iconColor,
    autoComplete,
    autoCorrect = false,
    containerStyle,
    labelStyle,
    inputStyle,
    placeholderTextColor = "#c7c6c3",
    multiline = false,
    disabled = false,
    labelColor,
    inputBoderColor,
    inputShadowColor,
    textColor,
    inputBackgroundColor,
    autoCapitalize = "none",
}: CustomInputProps): React.ReactElement {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(
        secureTextEntry || false
    );

    return (
        <View>
            {label && (
                <Text
                    style={[
                        labelStyle,
                        {
                            alignItems: "center",
                            justifyContent: "center",
                            color: labelColor ?? "#7889D2",
                            fontSize: 14,
                            fontFamily: "Poppins-Regular",
                            marginBottom: 5,
                        },
                    ]}
                >
                    {label}
                </Text>
            )}
            <View
                style={[
                    styles.container,
                    containerStyle,
                    isFocused && styles.focused,
                    {
                        paddingRight: isPassword ? 35 : 0,
                        borderColor: inputBoderColor ?? "#7889D2",
                        shadowColor: inputShadowColor ?? "#394792",
                        backgroundColor: inputBackgroundColor ?? "white",
                    },
                ]}
            >
                <Input
                    value={value}
                    placeholder={placeholder}
                    onChangeText={onChangeText}
                    leftIcon={leftIcon}
                    rightIcon={rightIcon}
                    secureTextEntry={
                        isPassword ? isPasswordVisible : secureTextEntry
                    }
                    autoComplete={autoComplete}
                    autoCorrect={autoCorrect}
                    inputContainerStyle={{
                        borderBottomWidth: 0,
                        width: "auto",
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    errorStyle={{ display: "none" }}
                    autoCapitalize={autoCapitalize}
                    placeholderTextColor={placeholderTextColor}
                    style={{
                        ...inputStyle,
                        ...{
                            color: textColor ?? "#736B66",
                            fontSize: 14,
                            fontFamily: "Poppins-Regular",
                            fontWeight: value ? "500" : "400",
                        },
                    }}
                    multiline={multiline}
                    disabled={disabled}
                />

                {isPassword && (
                    <TouchableOpacity
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                        {!isPasswordVisible ? (
                            <Feather name="eye" size={18} color={iconColor} />
                        ) : (
                            <Feather
                                name="eye-off"
                                size={18}
                                color={iconColor}
                            />
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 16,
        borderWidth: 2,
        height: 48,
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

export default CustomInput;
