import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";

import { BottomTab } from "@layouts/tab-bar";
import { ChatbotScreen } from "@screens/chatbot";
import { HomeScreen } from "@screens/home";

import { AppNavigator } from "./app-navigation";
import { BottomTabParamList } from "./app-navigation-types";
import { ProfileStackNavigator } from "./profile-stack";

const Tab = createBottomTabNavigator<BottomTabParamList>();

// Extract the home navigator component to prevent recreating it on each render
const HomeNavigator = () => <AppNavigator defaultComponent={HomeScreen} />;

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
                options={{
                    title: t("ROUTES.CHAT"),
                    tabBarStyle: { display: "none" }, // 👈 Cache la bottom bar
                }}
                component={ChatbotScreen}
            />
            <Tab.Screen
                name={"Profile"}
                options={{ title: t("ROUTES.PROFILE") }}
                component={ProfileStackNavigator}
            />
        </Tab.Navigator>
    );
};

export default BottomTabNavigation;
