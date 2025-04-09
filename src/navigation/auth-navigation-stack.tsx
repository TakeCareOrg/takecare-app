import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ForgotPasswordScreen } from "../views/auth/forgot-password-screen";
import { LoginScreen } from "../views/auth/login-screen";
import { RegisterScreen } from "../views/auth/register-screen";
import { QuizScreen } from "../views/quiz/quiz-screen";
import { WelcomeScreen } from "../views/welcome/welcome-screen";

const Stack = createNativeStackNavigator();

const AuthStack: React.FC = () => {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="Welcome"
        >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Quiz" component={QuizScreen} />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
            />
        </Stack.Navigator>
    );
};

export default AuthStack;
