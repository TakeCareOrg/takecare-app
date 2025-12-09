import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import { Icon } from "@rneui/base";
import { CheckBox } from "@rneui/themed";
import { Colors } from "../../../../styles/Colors";

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
    const { main, chat } = Colors();

    return (
        <LinearGradient
            colors={
                isSelected
                    ? chat.userMessageBackground
                    : [main.container, main.container]
            }
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
                        color={main.white}
                        size={25}
                    />
                }
                uncheckedIcon={
                    <Icon
                        name="radio-button-unchecked"
                        type="material"
                        color={main.primary}
                        size={25}
                    />
                }
                iconRight
                title={item}
                textStyle={[
                    styles.text,
                    { color: isSelected ? main.white : main.primary },
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
