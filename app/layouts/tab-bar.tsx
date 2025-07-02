import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Text } from "@components/ui/text";
import { BottomTabIcons } from "@constants/bottom-tab-icons";
import { useColorTheme } from "@hooks/use-color-theme";
import { BottomTabParamList } from "@navigation/bottom-tab-navigation";
import { TabBarFloatButton } from "@navigation/components/tabbar-chatbot-button";

// type RouteName = "home" | "chat";

const BottomBarButton = ({
    onPress,
    onLongPress,
    isFocused,
    routeName,
    label,
}: {
    onPress: () => void;
    onLongPress: () => void;
    isFocused: boolean;
    routeName: keyof BottomTabParamList;
    label: string;
}) => {
    const themeColors = useColorTheme();
    const color = isFocused
        ? themeColors.blue
        : themeColors.isDark
          ? themeColors.raw.grey[600]
          : themeColors.raw.grey[300];

    if (!BottomTabIcons[routeName]) {
        return null;
    }

    return (
        <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[styles.tabbarItem]}
        >
            {BottomTabIcons[routeName]({ color: color, isFocused })}
            <Text style={{ color: color }} fontSize={12} font="Poppins-Medium">
                {label}
            </Text>
        </TouchableOpacity>
    );
};

export function BottomTab({
    state,
    descriptors,
    navigation,
}: BottomTabBarProps) {
    const colors = useColorTheme();

    return (
        <View
            style={[
                styles.tabbar,
                {
                    backgroundColor: colors.background,
                },
            ]}
        >
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                          ? options.title
                          : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: "tabLongPress",
                        target: route.key,
                    });
                };

                if (route.name === "chat") {
                    return (
                        <TabBarFloatButton onPress={onPress} key={route.name} />
                    );
                }

                return (
                    <BottomBarButton
                        key={route.name}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        isFocused={isFocused}
                        routeName={route.name as keyof BottomTabParamList}
                        label={label as string}
                    />
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    tabbar: {
        position: "absolute",
        bottom: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },
    tabbarItem: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
    },
});
