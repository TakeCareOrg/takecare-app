import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { useTranslation } from "react-i18next";

import { BottomTab } from "@layouts/tab-bar";
import { ChatbotScreen } from "@screens/chatbot";
import { HomeScreen } from "@screens/home";
import { ProfileScreen } from "@screens/profile";

import { AppNavigator } from "./app-navigation";
import { BottomTabParamList } from "./app-navigation-types";

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigation = () => {
    const { t } = useTranslation("full_trads");

    return (
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
                component={ChatbotScreen}
            />
            <Tab.Screen
                name={"Profile"}
                options={{ title: t("ROUTES.PROFILE") }}
                component={ProfileScreen}
            />
        </Tab.Navigator>
    );
};

export default BottomTabNavigation;
