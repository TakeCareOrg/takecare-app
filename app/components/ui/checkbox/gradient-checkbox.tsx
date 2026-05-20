import { MaterialIcons } from "@expo/vector-icons";
import { CheckBox } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";

import { Text } from "@app/components/ui/text";
import { useColorTheme } from "@hooks/use-color-theme";

type SelectableItemProps = {
    item: string;
    isSelected: boolean;
    onChange: () => void;
    icon?: React.ReactNode;
};

export const GradientCheckbox = ({
    item,
    isSelected,
    onChange,
    icon,
}: SelectableItemProps) => {
    const { card, blue, white, text } = useColorTheme();

    return (
        <LinearGradient
            colors={isSelected ? [blue[400], blue[300]] : [card, card]}
            style={{ ...styles.gradient }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
        >
            <CheckBox
                checked={isSelected}
                onPress={onChange}
                checkedIcon={
                    <MaterialIcons
                        name="radio-button-checked"
                        color={white}
                        size={25}
                    />
                }
                uncheckedIcon={
                    <MaterialIcons
                        name="radio-button-unchecked"
                        color={white}
                        size={25}
                    />
                }
                iconRight
                title={
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        {icon}
                        <Text
                            weight="500"
                            fontSize={14}
                            color={isSelected ? white : text}
                        >
                            {item}
                        </Text>
                    </View>
                }
                containerStyle={{
                    ...styles.container,
                }}
                wrapperStyle={{
                    ...styles.wrapper,
                }}
            />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        borderRadius: 12,
    },
    container: {
        flex: 1,
        backgroundColor: "transparent",
        paddingHorizontal: 4,
        paddingVertical: 8,
    },
    wrapper: {
        justifyContent: "space-between",
    },
});
