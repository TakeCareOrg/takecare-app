import {
    BottomTabBar,
    createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";
import { HealthIcon } from "../../assets/icons/HealthIcon";
import { HomeIcon } from "../../assets/icons/HomeIcon";
import { VisibilityContext } from "../contexts/visibility-context";
import { useColors } from "../styles/Colors";
import { TabBarFloatButton } from "../ui/buttons/tab-bar-float-button";
import { ChatbotScreen } from "../views/chatbot/chatbot-screen";
import { StepsInfo } from "../views/home/components/step/step-infos";
import { HomeScreen } from "../views/home/home-screen";
import { UpdateUserScreen } from "../views/profile/components/update-user-screen";
import { ProfileScreen } from "../views/profile/profile-screen";

const BottomTabNavigation = () => {
    const Tab = createBottomTabNavigator();
    const { isVisible } = useContext(VisibilityContext);
    const { t } = useTranslation();
    const { main } = useColors();

    return (
        // Hide the header
        <Tab.Navigator
            tabBar={(props) => (
                <View
                    style={
                        isVisible
                            ? styles.navigatorContainer
                            : { display: "none" }
                    }
                >
                    <BottomTabBar {...props} />
                </View>
            )}
            safeAreaInsets={{ bottom: 0 }}
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.navigator,
                tabBarItemStyle: {
                    backgroundColor: main.background,
                    paddingBottom: Platform.OS === "ios" ? 30 : 0,
                    flexDirection: "column",
                },
            }}
        >
            <Tab.Screen
                name={t("GLOBAL.HOME")}
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color }) => <HomeIcon color={color} />,
                }}
            />
            <Tab.Screen
                name="Chat"
                options={{
                    tabBarButton: (props: any) => (
                        <TabBarFloatButton {...props} />
                    ),
                }}
            >
                {(props) => <ChatbotScreen />}
            </Tab.Screen>
            <Tab.Screen
                name={t("GLOBAL.HEALTH")}
                // component={Health}
                component={StepsInfo}
                options={{
                    tabBarIcon: ({ color }) => <HealthIcon color={color} />,
                }}
            />
            {/* // remove the icon from the tab bar */}
            <Tab.Screen
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
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    navigatorContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
    navigator: {
        borderTopWidth: 0,
        backgroundColor: "transparent",
        elevation: 0,
        height: Platform.OS === "ios" ? 74 : 50,
    },
});
export default BottomTabNavigation;
