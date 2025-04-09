import { StyleSheet, View } from "react-native";
import React from "react";
import { useColors } from "../../styles/Colors";
import { TextComponent } from "../text-component";
import { CheckIcon } from "../../../assets/icons/CheckIcon";

type CheckBoxProps = {
    checked: boolean;
    label?: string;
    setChecked: React.Dispatch<React.SetStateAction<boolean>>;
    fontSize?: number;
};

const CheckBox = ({
    checked,
    label,
    setChecked,
    fontSize = 10,
}: CheckBoxProps) => {
    const { main } = useColors();

    return (
        <View style={styles.container}>
            <View style={styles.checkboxContainer}>
                <View
                    style={[
                        styles.checkbox,
                        {
                            backgroundColor: checked
                                ? main.primary
                                : main.button,
                            borderColor: main.inputBorder,
                        },
                    ]}
                    onTouchStart={(e) => {
                        e.preventDefault();
                        setChecked(true);
                    }}
                />
                {checked && (
                    <CheckIcon
                        style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                        }}
                        color={main.reverse}
                        onPress={() => {
                            setChecked(false); //? To handle android devices we cannot just use onTouchStart on the view
                        }}
                    />
                )}
            </View>
            {label && (
                <TextComponent style={styles.label} fontSize={fontSize}>
                    {label}
                </TextComponent>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
    },
    checkboxContainer: {
        position: "relative",
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 5,
        borderWidth: 1,
    },
    label: {
        marginLeft: 14,
        letterSpacing: 1,
    },
});

export default CheckBox;
