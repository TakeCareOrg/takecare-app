import React, { useCallback, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "@screens/auth/login";
import { RegisterScreen } from "@screens/auth/register";
import { HomeScreen } from "@screens/home";
import { useAuthStore } from "@stores/auth";
import * as SplashScreen from "expo-splash-screen";
// import * as Font from "expo-font";
import { View } from "react-native";

import "@services/axios";
import { initializeUserAuth } from "@app/stores/users";
import { secureStorage } from "@app/utils/storage";

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
    Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isInitialized = useAuthStore((state) => state.isInitialized);
    const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);

    useEffect(() => {
        async function prepare() {
            try {
                // Vérifier le statut d'authentification au lancement
                await checkAuthStatus();

                // Simuler un délai minimum pour éviter un flash trop rapide (optionnel)
                await new Promise((resolve) => setTimeout(resolve, 1000));
            } catch (e) {
                console.warn("Erreur lors de l'initialisation:", e);
            } finally {
                // Marquer l'app comme prête
                setAppIsReady(true);
            }
        }

        prepare();
    }, [checkAuthStatus]);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady && isInitialized) {
            // Cacher le splash screen quand l'app est prête
            await SplashScreen.hideAsync();
        }
    }, [appIsReady, isInitialized]);

    // Ne pas rendre l'app tant qu'elle n'est pas prête
    if (!appIsReady || !isInitialized) {
        return null;
    }

    return (
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <NavigationContainer>
                <Stack.Navigator>
                    {isAuthenticated ? (
                        <Stack.Screen name="Home" component={HomeScreen} />
                    ) : (
                        <>
                            <Stack.Screen
                                name="Login"
                                component={LoginScreen}
                            />
                            <Stack.Screen
                                name="Register"
                                component={RegisterScreen}
                            />
                        </>
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </View>
    );
}
