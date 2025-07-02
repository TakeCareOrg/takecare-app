import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { useTranslation } from "react-i18next";

import { HomeScreen } from "@app/screens/home";
import { BottomTab } from "@layouts/tab-bar";
import { ChatbotScreen } from "@screens/chatbot";

import { AppNavigator } from "./app-navigation";
import { BottomTabParamList } from "./app-navigation-types";

const Tab = createBottomTabNavigator<BottomTabParamList>();

const ProfileScreen = () => {
    return null; // Placeholder for the profile screen component
};

const BottomTabNavigation = () => {
    const { t } = useTranslation("full_trads");

    return (
        // Hide the header
        <Tab.Navigator
            tabBar={(props) => <BottomTab {...props} />}
            safeAreaInsets={{ bottom: 0 }}
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen
                name={"Home"}
                options={{ title: t("ROUTES.HOME") }}
                component={() => (
                    <AppNavigator
                        defaultRoute="Home"
                        defaultComponent={HomeScreen}
                    />
                )}
            />
            <Tab.Screen
                name={"Chat"}
                options={{ title: t("ROUTES.CHAT") }}
                component={() => (
                    <AppNavigator
                        defaultRoute="Chat"
                        defaultComponent={ChatbotScreen}
                    />
                )}
            />
            <Tab.Screen
                name={"Profile"}
                options={{ title: t("ROUTES.PROFILE") }}
                component={() => (
                    <AppNavigator
                        defaultRoute="Profile"
                        defaultComponent={ProfileScreen}
                    />
                )}
            />

            {/* <Tab.Screen
                name={t("GLOBAL.HEALTH")}
                // component={Health}
                component={StepsInfo}
                options={{
                    tabBarIcon: ({ color }) => <HealthIcon color={color} />,
                }}
            /> */}
            {/* // remove the icon from the tab bar */}
            {/* <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarButton: () => null, // This hides the tab button
                }}
            />
            <Tab.Screen
                name="UpdateUserScreen"
                component={UpdateUserScreen}
                options={{
                    tabBarButton: () => null, // This hides the tab button
                }}
            /> */}
        </Tab.Navigator>
    );
};

export default BottomTabNavigation;
