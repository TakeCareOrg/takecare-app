import React, {
    useState,
    forwardRef,
    useImperativeHandle,
    useRef,
} from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Input as RNEInput, InputProps } from "@rneui/base";
import Feather from "@expo/vector-icons/Feather";

type CustomInputProps = {
    value: string;
    onChangeText: (text: string) => void;
    containerStyle?: React.CSSProperties;
    isPassword?: boolean;
} & Omit<InputProps, "ref">;

export const Input = forwardRef<TextInput, CustomInputProps>(
    (
        { value, onChangeText, containerStyle, isPassword = false, ...props },
        ref,
    ) => {
        const [isFocused, setIsFocused] = useState(false);
        const [isPasswordVisible, setIsPasswordVisible] = useState(
            props.secureTextEntry || false,
        );

        const internalRef = useRef<any>(null);

        // Expose TextInput methods through the forwarded ref
        useImperativeHandle(
            ref,
            () => {
                // Get the actual TextInput instance from the RNE Input component
                const textInputRef =
                    internalRef.current?.getElement?.() || internalRef.current;
                return textInputRef;
            },
            [],
        );

        return (
            <View>
                <View
                    style={[
                        styles.container,
                        containerStyle,
                        isFocused && styles.focused,
                        {
                            paddingRight: isPassword ? 30 : 0,
                            borderColor: "#7889D2",
                            shadowColor: "#394792",
                            backgroundColor: "white",
                        },
                    ]}
                >
                    <RNEInput
                        ref={internalRef}
                        value={value}
                        onChangeText={onChangeText}
                        secureTextEntry={
                            isPassword
                                ? isPasswordVisible
                                : props.secureTextEntry
                        }
                        inputContainerStyle={{
                            borderBottomWidth: 0,
                            width: "auto",
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        errorStyle={{ display: "none" }}
                        style={{
                            color: "#736B66",
                            fontSize: 14,
                            fontFamily: "Poppins-Regular",
                            fontWeight: value ? "500" : "400",
                        }}
                        {...props}
                    />

                    {isPassword && (
                        <TouchableOpacity
                            onPress={() =>
                                setIsPasswordVisible(!isPasswordVisible)
                            }
                        >
                            {!isPasswordVisible ? (
                                <Feather
                                    name="eye"
                                    size={18}
                                    color={"#7889D2"}
                                />
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
