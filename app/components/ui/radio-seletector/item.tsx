import { StyleSheet, TouchableOpacity } from "react-native";

import { Text } from "@app/components/ui/text";
import { useColorTheme } from "@app/hooks/use-color-theme";

type ItemProps = {
    option: { label: string | number; value: string | number };
    isSelected: boolean;
    onSelect: (value: string | number) => void;
};
export const RadioItem = ({ option, isSelected, onSelect }: ItemProps) => {
    const colors = useColorTheme();

    return (
        <TouchableOpacity
            style={[
                styles.item,
                isSelected && {
                    borderColor: colors.blue[200],
                },
            ]}
            onPress={() => onSelect(option.value)}
        >
            <Text color={colors.blue[200]}>{option.label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    item: {
        padding: 16,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: "#fff",
    },
    selectedItem: {
        borderColor: "#007AFF",
        backgroundColor: "#E0F0FF",
    },
});
