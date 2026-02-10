import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import * as SplashScreen from "expo-splash-screen";

import { useColorTheme } from "@app/hooks/use-color-theme";
import { QuizScreen } from "@app/screens/quiz/quiz-screen";
import { initializeMedicalData } from "@app/stores/medical-data";
import I18n from "@i18n/index";
import BottomTabNavigation from "@navigation/bottom-tab-navigation";
import { LoginScreen } from "@screens/auth/login";
import { RegisterScreen } from "@screens/auth/register";
import "@services/axios";
import { useAuthStore } from "@stores/auth";
import { initializeUserAuth, useUserStore } from "@stores/users";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
    duration: 1000,
    fade: true,
});

initializeUserAuth();
initializeMedicalData();

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
};

export type AppStackParamList = {
    Quiz: undefined;
    Main: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isInitialized = useAuthStore((state) => state.isInitialized);
    const user = useUserStore((state) => state.user);
    const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);
    const colors = useColorTheme();
    useEffect(() => {
        async function prepare() {
            try {
                // checkAuthStatus already loads user data if authenticated
                await checkAuthStatus();

                await new Promise((resolve) => setTimeout(resolve, 1000));
            } catch (e) {
                throw new Error("Failed to initialize app: " + e);
            } finally {
                setAppIsReady(true);
            }
        }

        prepare();
    }, [checkAuthStatus]);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady && isInitialized) {
            await SplashScreen.hideAsync();
        }
    }, [appIsReady, isInitialized]);

    // Show loader while waiting for user data
    if (!appIsReady || !isInitialized || (isAuthenticated && !user)) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: colors.background,
                }}
            >
                <ActivityIndicator size="large" color={colors.text} />
            </View>
        );
    }
    return (
        <SafeAreaProvider>
            <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
                <I18nextProvider i18n={I18n}>
                    <NavigationContainer>
                        {isAuthenticated ? (
                            user?.quiz_finished === true ? (
                                <AppStack.Navigator
                                    screenOptions={{
                                        headerShown: false,
                                        animation: "fade",
                                        animationDuration: 500,
                                    }}
                                >
                                    <AppStack.Screen
                                        name="Main"
                                        component={BottomTabNavigation}
                                    />
                                </AppStack.Navigator>
                            ) : (
                                <AppStack.Navigator
                                    screenOptions={{
                                        headerShown: false,
                                        animation: "fade",
                                        animationDuration: 500,
                                    }}
                                >
                                    <AppStack.Screen
                                        name="Quiz"
                                        component={QuizScreen}
                                    />
                                </AppStack.Navigator>
                            )
                        ) : (
                            <AuthStack.Navigator
                                screenOptions={{
                                    headerShown: false,
                                    animation: "fade",
                                    animationDuration: 500,
                                }}
                            >
                                <AuthStack.Screen
                                    name="Login"
                                    component={LoginScreen}
                                />
                                <AuthStack.Screen
                                    name="Register"
                                    component={RegisterScreen}
                                />
                            </AuthStack.Navigator>
                        )}
                    </NavigationContainer>
                </I18nextProvider>
            </View>
        </SafeAreaProvider>
    );
}
