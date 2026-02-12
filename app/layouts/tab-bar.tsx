import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomTabParamList } from "@app/navigation/app-navigation-types";
import { Text } from "@components/ui/text";
import { BottomTabIcons } from "@constants/bottom-tab-icons";
import { useColorTheme } from "@hooks/use-color-theme";
import { TabBarFloatButton } from "@navigation/components/tabbar-chatbot-button";

const ResetableRoutes = ["Home"];

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
    const color = isFocused ? themeColors.blue[200] : themeColors.text;

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
            <Text style={{ color: color }} fontSize={12} weight="600">
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
    const insets = useSafeAreaInsets();

    const bottomOffset =
        Platform.OS === "ios"
            ? 15 //? Fixed offset for iOS home indicator
            : insets.bottom > 0
              ? insets.bottom //? Android with navigation bar
              : 15; //? Android without navigation bar (gesture mode)

    const activeRoute = state.routes[state.index];
    if (activeRoute.name === "Chat") return null;

    return (
        <View
            style={[
                styles.tabbar,
                {
                    backgroundColor: colors.background,
                    bottom: bottomOffset,
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
                const routeName = route.name as keyof BottomTabParamList;

                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        // Reset the stack when navigating to Home from another tab
                        if (ResetableRoutes.includes(routeName)) {
                            navigation.reset({
                                index: 0,
                                routes: [
                                    { name: route.name, params: route.params },
                                ],
                            });
                        } else {
                            navigation.navigate(route.name, route.params);
                        }
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: "tabLongPress",
                        target: route.key,
                    });
                };

                if (routeName === "Chat") {
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
