import React, {
    useState,
    forwardRef,
    useImperativeHandle,
    useRef,
} from "react";
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    TextInputProps,
    ViewStyle,
    StyleProp,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";

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
            props.secureTextEntry || false,
        );

        return (
            <View
                style={[
                    styles.container,
                    containerStyle,
                    isFocused && styles.focused,
                    {
                        borderColor: "#7889D2",
                        shadowColor: "#7889D2",
                        // backgroundColor: "white",
                    },
                ]}
            >
                {props.leftIcon && (
                    <View style={{ marginRight: 5 }}>{props.leftIcon}</View>
                )}
                <TextInput
                    ref={ref}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={
                        isPassword ? isPasswordVisible : props.secureTextEntry
                    }
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    style={{
                        color: "#736B66",
                        fontSize: 14,
                        fontFamily: "Poppins-Regular",
                        fontWeight: 500,
                        flex: 1,
                    }}
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
