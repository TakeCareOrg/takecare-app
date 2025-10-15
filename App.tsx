import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { View } from "react-native";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import I18n from "@i18n/index";
import BottomTabNavigation from "@navigation/bottom-tab-navigation";
import { LoginScreen } from "@screens/auth/login";
import { RegisterScreen } from "@screens/auth/register";
import "@services/axios";
import { useAuthStore } from "@stores/auth";
import { initializeUserAuth } from "@stores/users";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
    duration: 1000,
    fade: true,
});

initializeUserAuth();

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isInitialized = useAuthStore((state) => state.isInitialized);
    const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);
    const [fontsLoaded] = useFonts({
        "Poppins-Bold": require("@assets/fonts/Poppins/Poppins-Bold.ttf"),
        "Poppins-SemiBold": require("@assets/fonts/Poppins/Poppins-SemiBold.ttf"),
        "Poppins-Medium": require("@assets/fonts/Poppins/Poppins-Medium.ttf"),
        "Poppins-Regular": require("@assets/fonts/Poppins/Poppins-Regular.ttf"),
        "Poppins-Light": require("@assets/fonts/Poppins/Poppins-Light.ttf"),
        "Poppins-ExtraLight": require("@assets/fonts/Poppins/Poppins-ExtraLight.ttf"),
        "Poppins-Italic": require("@assets/fonts/Poppins/Poppins-Italic.ttf"),

        // Inter
        "Inter-Bold": require("@assets/fonts/Inter/Inter-Bold.ttf"),
        "Inter-SemiBold": require("@assets/fonts/Inter/Inter-SemiBold.ttf"),
        "Inter-Medium": require("@assets/fonts/Inter/Inter-Medium.ttf"),
        "Inter-Regular": require("@assets/fonts/Inter/Inter-Regular.ttf"),
        "Inter-Light": require("@assets/fonts/Inter/Inter-Light.ttf"),
        "Inter-ExtraLight": require("@assets/fonts/Inter/Inter-ExtraLight.ttf"),
    });

    useEffect(() => {
        async function prepare() {
            // await secureStorage.removeItem("auth-storage-token");
            try {
                // Vérifier le statut d'authentification au lancement
                await checkAuthStatus();

                // Simuler un délai minimum pour éviter un flash trop rapide (optionnel)
                await new Promise((resolve) => setTimeout(resolve, 1000));
            } catch (e) {
                throw new Error("Failed to initialize app: " + e);
            } finally {
                // Marquer l'app comme prête
                setAppIsReady(true);
            }
        }

        prepare();
    }, [checkAuthStatus]);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady && isInitialized && fontsLoaded) {
            // Cacher le splash screen quand l'app est prête
            await SplashScreen.hideAsync();
        }
    }, [appIsReady, isInitialized, fontsLoaded]);

    // Ne pas rendre l'app tant qu'elle n'est pas prête
    if (!appIsReady || !isInitialized || !fontsLoaded) {
        return null;
    }

    return (
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <I18nextProvider i18n={I18n}>
                <NavigationContainer>
                    {isAuthenticated ? (
                        <BottomTabNavigation />
                    ) : (
                        <Stack.Navigator screenOptions={{ headerShown: false }}>
                            <Stack.Screen
                                name="Login"
                                component={LoginScreen}
                            />
                            <Stack.Screen
                                name="Register"
                                component={RegisterScreen}
                            />
                        </Stack.Navigator>
                    )}
                </NavigationContainer>
            </I18nextProvider>
        </View>
    );
}
