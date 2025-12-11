import { Icon } from "@rneui/base";
import { CheckBox } from "@rneui/themed";
import React from "react";
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

export const GradientCheckbox: React.FC<SelectableItemProps> = ({
    item,
    isSelected,
    onChange,
    icon,
}) => {
    const { card, blue, white, black } = useColorTheme();

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
                    <Icon
                        name="radio-button-checked"
                        type="material"
                        color={white}
                        size={25}
                    />
                }
                uncheckedIcon={
                    <Icon
                        name="radio-button-unchecked"
                        type="material"
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
                            font="Poppins-Medium"
                            fontSize={14}
                            color={isSelected ? white : black}
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
