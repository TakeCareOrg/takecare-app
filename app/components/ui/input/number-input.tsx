import { forwardRef, useState } from "react";
import {
    StyleProp,
    StyleSheet,
    TextInput,
    TextInputProps,
    View,
    ViewStyle,
} from "react-native";

type NumberInputProps = {
    value: number;
    onChangeText: (value: number) => void;
    containerStyle?: StyleProp<ViewStyle>;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    allowDecimal?: boolean;
} & Omit<TextInputProps, "value" | "onChangeText" | "keyboardType">;

export const NumberInput = forwardRef<TextInput, NumberInputProps>(
    (
        { value, onChangeText, containerStyle, allowDecimal = true, ...props },
        ref,
    ) => {
        const [isFocused, setIsFocused] = useState(false);
        const [displayText, setDisplayText] = useState("");

        const handleTextChange = (text: string) => {
            // Remove any non-numeric characters except decimal point and comma
            let cleanedText = text.replace(/[^0-9.,]/g, "");

            // If decimal is not allowed, remove decimal points and commas
            if (!allowDecimal) {
                cleanedText = cleanedText.replace(/[.,]/g, "");
            } else {
                // Ensure only one decimal separator (. or ,)
                const hasComma = cleanedText.includes(",");
                const hasDot = cleanedText.includes(".");

                if (hasComma && hasDot) {
                    // If both are present, keep only the first one
                    const commaIndex = cleanedText.indexOf(",");
                    const dotIndex = cleanedText.indexOf(".");
                    if (commaIndex < dotIndex) {
                        cleanedText = cleanedText.replace(/\./g, "");
                    } else {
                        cleanedText = cleanedText.replace(/,/g, "");
                    }
                }

                // Ensure only one decimal separator
                const separator = hasComma ? "," : ".";
                const parts = cleanedText.split(separator);
                if (parts.length > 2) {
                    cleanedText =
                        parts[0] + separator + parts.slice(1).join("");
                }
            }

            // Update display text
            setDisplayText(cleanedText);

            // Convert to number for callback (replace comma with period for parsing)
            const textForParsing = cleanedText.replace(/,/g, ".");
            const numValue =
                textForParsing === "" ? 0 : parseFloat(textForParsing);

            // Call onChange with the number value
            if (!isNaN(numValue)) {
                onChangeText(numValue);
            } else if (cleanedText === "") {
                onChangeText(0);
            }
        };

        const handleFocus = () => {
            setIsFocused(true);
            setDisplayText(value === 0 ? "" : String(value));
        };

        const handleBlur = () => {
            setIsFocused(false);
            setDisplayText("");
        };

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
                    value={
                        isFocused
                            ? displayText
                            : value === 0
                              ? ""
                              : String(value)
                    }
                    onChangeText={handleTextChange}
                    keyboardType={allowDecimal ? "decimal-pad" : "number-pad"}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={styles.input}
                    placeholderTextColor={"#8E8E8E"}
                    {...props}
                />
                {props.rightIcon && (
                    <View style={{ marginLeft: 5 }}>{props.rightIcon}</View>
                )}
            </View>
        );
    },
);

NumberInput.displayName = "NumberInput";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 16,
        borderWidth: 2,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    input: {
        color: "#736B66",
        fontSize: 14,
        fontFamily: "Poppins-Regular",
        flex: 1,
        minHeight: 20,
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
