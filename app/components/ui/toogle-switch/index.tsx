import React from "react";
import { TouchableOpacity, View } from "react-native";

import { Text } from "@app/components/ui/text";
import { useColorTheme } from "@app/hooks/use-color-theme";

interface SwitchOption {
    value: string | number;
    label: string;
}

interface PeriodOptionProps {
    value: SwitchOption;
    isSelected: boolean;
    onPress: (period: SwitchOption["value"]) => void;
}

const ToggleSwitchOption = ({
    value,
    isSelected,
    onPress,
}: PeriodOptionProps) => {
    const themeColors = useColorTheme();

    return (
        <TouchableOpacity
            style={{
                flex: 1,
                height: "100%",
                backgroundColor: isSelected ? themeColors.text : "transparent",
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
            }}
            onPress={() => onPress(value.value)}
        >
            <Text
                style={{
                    color: isSelected ? themeColors.reverse : themeColors.text,
                    fontSize: 16,
                    opacity: isSelected ? 1 : 0.6,
                }}
                weight="600"
            >
                {value.label}
            </Text>
        </TouchableOpacity>
    );
};

const Divider = () => {
    const themeColors = useColorTheme();
    return (
        <View
            style={{
                width: 1,
                height: "50%",
                backgroundColor: themeColors.border,
            }}
        />
    );
};

export const ToggleSwitch = ({
    data,
    selectedValue,
    onChange,
}: {
    data: SwitchOption[];
    selectedValue: SwitchOption["value"];
    onChange: (period: SwitchOption["value"]) => void;
}) => {
    const themeColors = useColorTheme();

    if (!data || data.length === 0) {
        return null; // No options to display
    }

    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: themeColors.box,
                borderRadius: 10,
                height: 34,
            }}
        >
            {data.map((item, index) => (
                <React.Fragment key={item.value}>
                    <ToggleSwitchOption
                        value={item}
                        isSelected={selectedValue === item.value}
                        onPress={() => onChange(item.value)}
                    />
                    {index < data.length - 1 && (
                        <Divider key={`divider-${index}`} />
                    )}
                </React.Fragment>
            ))}
        </View>
    );
};
