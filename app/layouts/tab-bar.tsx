import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Text } from "@app/components/ui/text";
import { BottomTabIcons } from "@app/constants/bottom-tab-icons";
import { useColorTheme } from "@app/hooks/use-color-theme";
import { BottomTabParamList } from "@app/navigation/bottom-tab-navigation";
import { TabBarFloatButton } from "@app/navigation/components/tabbar-chatbot-button";
import Feather from "@expo/vector-icons/Feather";

// type RouteName = "home" | "chat";

const BottomBarButton = ({
    onPress,
    onLongPress,
    isFocused,
    routeName,
    color,
    label,
}: {
    onPress: () => void;
    onLongPress: () => void;
    isFocused: boolean;
    routeName: keyof BottomTabParamList;
    color: string;
    label: string;
}) => {
    const colors = useColorTheme();
    return (
        <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[styles.tabbarItem]}
        >
            {BottomTabIcons[routeName]({
                color: isFocused ? colors.blue : colors.grey,
            })}
            <Text style={{ color }}>{label}</Text>
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
                    shadowColor: colors.reverse,
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
                        color={isFocused ? colors.blue : colors.grey}
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
        bottom: 30,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 16,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 5,
    },
    tabbarItem: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
    },
});
