import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { useTranslation } from "react-i18next";

import {
    NavigationProvider,
    resetHomeFromOutside,
    useNavigationContext,
} from "@app/contexts/navigation-context";
import { HomeScreen } from "@app/screens/home";
import { BottomTab } from "@layouts/tab-bar";
import { ChatbotScreen } from "@screens/chatbot";
import { StepsScreen } from "@screens/steps";

import { BottomTabParamList } from "./app-navigation-types";

const Tab = createBottomTabNavigator<BottomTabParamList>();

const HomeNavigatorWithContext = () => {
    const { currentHomeScreen } = useNavigationContext();

    if (currentHomeScreen === "Steps") {
        return <StepsScreen />;
    }

    return <HomeScreen />;
};

const BottomTabNavigation = () => {
    const { t } = useTranslation("full_trads");

    return (
        <NavigationProvider>
            <Tab.Navigator
                tabBar={(props) => <BottomTab {...props} />}
                safeAreaInsets={{ bottom: 0 }}
                screenOptions={{ headerShown: false }}
            >
                <Tab.Screen
                    name={"Home"}
                    options={{ title: t("ROUTES.HOME") }}
                    component={HomeNavigatorWithContext}
                    listeners={() => ({
                        tabPress: () => {
                            resetHomeFromOutside();
                        },
                    })}
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
        </NavigationProvider>
    );
};

export default BottomTabNavigation;
