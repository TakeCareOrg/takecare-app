import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";

import { useColorTheme } from "@app/hooks/use-color-theme";
import { BottomTab } from "@app/layouts/tab-bar";
import { ChatbotScreen } from "@app/screens/chatbot";
import { HomeScreen } from "@app/screens/home";
import { useTranslation } from "react-i18next";

// import { HealthIcon } from "../assets/icons/HealthIcon.tsx";
// import { TabBarFloatButton } from "../ui/buttons/tab-bar-float-button.tsx";

// import { UpdateUserScreen } from "../views/profile/components/update-user-screen.tsx";
// import { ProfileScreen } from "../views/profile/profile-screen.tsx";

export type BottomTabParamList = {
    home: undefined;
    chat: undefined;
    profile: undefined;
};

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
                name={"home"}
                options={{ title: t("ROUTES.HOME") }}
                component={HomeScreen}
            />
            <Tab.Screen
                name={"chat"}
                options={{ title: t("ROUTES.CHAT") }}
                component={ChatbotScreen}
            />
            <Tab.Screen
                name={"profile"}
                options={{ title: t("ROUTES.PROFILE") }}
                component={ProfileScreen}
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
