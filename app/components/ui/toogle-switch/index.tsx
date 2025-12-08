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
                backgroundColor: isSelected
                    ? themeColors.black[500]
                    : "transparent",
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
            }}
            onPress={() => onPress(value.value)}
        >
            <Text
                style={{
                    color: isSelected
                        ? themeColors.black[50]
                        : themeColors.black[500],
                    fontWeight: "600",
                    fontSize: 16,
                }}
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
                backgroundColor: themeColors.black[300],
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
                padding: 4,
                backgroundColor: themeColors.isDark
                    ? themeColors.black[700]
                    : themeColors.black[50],
                borderRadius: 10,
                height: 40,
                gap: 4,
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
