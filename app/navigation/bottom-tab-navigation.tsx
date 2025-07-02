import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { useTranslation } from "react-i18next";

import { HomeScreen } from "@app/screens/home";
import { BottomTab } from "@layouts/tab-bar";
import { ChatbotScreen } from "@screens/chatbot";

import { AppNavigator } from "./app-navigation";
import { BottomTabParamList } from "./app-navigation-types";

const Tab = createBottomTabNavigator<BottomTabParamList>();

// Wrapper component pour Home avec AppNavigator
const HomeNavigator = () => (
    <AppNavigator defaultRoute="HomeMain" defaultComponent={HomeScreen} />
);

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
                component={HomeNavigator}
            />
            <Tab.Screen
                name={"Chat"}
                options={{ title: t("ROUTES.CHAT") }}
                component={ChatbotScreen}
            />
            <Tab.Screen
                name={"Profile"}
                options={{ title: t("ROUTES.PROFILE") }}
                component={() => <></>}
            />
        </Tab.Navigator>
    );
};

export default BottomTabNavigation;
