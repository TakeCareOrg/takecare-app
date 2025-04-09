import {
    DarkTheme,
    DefaultTheme,
    NavigationContainer,
} from "@react-navigation/native";
import React from "react";
import { useColorScheme } from "react-native";
import { useAuth } from "../contexts/auth-context";
import Loading from "../ui/loading/index";
import { VerifyScreen } from "../views/auth/verify-screen";
import { QuizScreen } from "../views/quiz/quiz-screen";
import AppStack from "./app-navigation-stack";
import AuthStack from "./auth-navigation-stack";

export const Router: React.FC = () => {
    const { authData, user, loading } = useAuth();
    const colorScheme = useColorScheme();

    if (loading && authData?.token && !user) {
        return <Loading />;
    }

    return (
        <NavigationContainer
            theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
            {authData?.token && !user?.verified ? (
                <VerifyScreen />
            ) : authData?.token && user?.quiz_finished ? (
                <AppStack />
            ) : authData?.token && !user?.quiz_finished ? (
                <QuizScreen />
            ) : (
                <AuthStack />
            )}
        </NavigationContainer>
    );
};
