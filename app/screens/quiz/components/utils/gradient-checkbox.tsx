import { Icon } from "@rneui/base";
import { CheckBox } from "@rneui/themed";
import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";

import { useColorTheme } from "@hooks/use-color-theme";

type SelectableItemProps = {
    item: string;
    isSelected: boolean;
    onChange: () => void;
    rigthIcon?: React.ReactNode;
};

export const GradientCheckbox: React.FC<SelectableItemProps> = ({
    item,
    isSelected,
    onChange,
    rigthIcon,
}) => {
    const { background, card, blue, white } = useColorTheme();

    return (
        <LinearGradient
            colors={isSelected ? [background, background] : [card, card]}
            style={{ ...styles.gradient }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
        >
            {rigthIcon && (
                <View
                    style={{
                        marginLeft: 10,
                        paddingLeft: 10,
                        marginRight: -10,
                    }}
                >
                    {rigthIcon}
                </View>
            )}
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
                title={item}
                textStyle={[
                    styles.text,
                    { color: isSelected ? white : blue[500] },
                ]}
                containerStyle={{
                    ...styles.container,
                    // paddingHorizontal: rigthIcon ? 0 : 10,
                    // marginHorizontal: rigthIcon ? 0 : 10,
                }}
                wrapperStyle={{
                    ...styles.wrapper,
                    // paddingHorizontal: rigthIcon ? 0 : 10,
                    // marginHorizontal: rigthIcon ? 0 : 10,
                }}
            />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        borderRadius: 50,
        marginVertical: 5,
        flexDirection: "row",
        alignItems: "center",
    },
    text: {
        fontFamily: "Urbanist-Regular",
        marginLeft: 0,
    },
    container: {
        flex: 1,
        backgroundColor: "transparent",
    },
    wrapper: {
        justifyContent: "space-between",
    },
});
