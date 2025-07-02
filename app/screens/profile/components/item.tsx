import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Text } from "@components/ui/text";
import { UserAttributions, UserHealthAttributions } from "@dtypes/base/users";
import { useColorTheme } from "@hooks/use-color-theme";

interface ItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    onPress: () => void;
    value?:
        | UserAttributions[keyof UserAttributions]
        | UserHealthAttributions[keyof UserHealthAttributions]
        | null
        | undefined;
    isLast?: boolean;
}

export const Item = ({
    icon,
    title,
    onPress,
    value,
    isLast = false,
}: ItemProps) => {
    const { t, i18n } = useTranslation("full_trads");
    const themeColors = useColorTheme();

    const displayValue = useMemo(() => {
        if (value === undefined || value === null) return null;
        if (typeof value === "boolean")
            return value ? t("PROFILE.VALUES.YES") : t("PROFILE.VALUES.NO");
        if (value instanceof Date) {
            return value.toLocaleString(i18n.language);
        }
        return value.toString();
    }, [value, t, i18n.language]);

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.itemContainer,
                !isLast && {
                    ...styles.itemBorder,
                    borderBottomColor: themeColors.border,
                },
            ]}
            activeOpacity={0.7}
        >
            <View style={styles.itemLeft}>
                <View
                    style={[
                        styles.iconContainer,
                        {
                            backgroundColor: themeColors.isDark
                                ? `${themeColors.raw.blue[300]}95`
                                : `${themeColors.raw.blue[200]}30`,
                        },
                    ]}
                >
                    <Ionicons
                        name={icon}
                        size={18}
                        color={themeColors.reverse}
                    />
                </View>
                <Text style={[styles.itemTitle]}>{title}</Text>
            </View>
            <View style={styles.itemRight}>
                {displayValue ? (
                    <Text
                        style={[
                            styles.itemValue,
                            { color: themeColors.reverse },
                        ]}
                    >
                        {displayValue}
                    </Text>
                ) : null}
                <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={themeColors.reverse}
                />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
    },
    itemBorder: {
        borderBottomWidth: 0.5,
    },
    itemLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    iconContainer: {
        width: 30,
        height: 30,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: "500",
        flex: 1,
    },
    itemRight: {
        flexDirection: "row",
        alignItems: "center",
    },
    itemValue: {
        fontSize: 15,
        marginRight: 8,
        fontWeight: "500",
    },
});
