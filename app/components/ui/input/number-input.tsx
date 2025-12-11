import { forwardRef, useState } from "react";
import { StyleProp, TextInput, TextInputProps, ViewStyle } from "react-native";

import { Input } from "./index";

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
        const [displayText, setDisplayText] = useState(value.toString() || "");
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

        return (
            <Input
                ref={ref}
                value={displayText}
                onChangeText={handleTextChange}
                placeholder={props.placeholder}
                keyboardType={allowDecimal ? "decimal-pad" : "number-pad"}
                {...props}
            />
        );
    },
);

NumberInput.displayName = "NumberInput";
