import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { HeartScreen } from "@app/screens/bpm";
import { SleepScreen } from "@app/screens/sleep";
import { StepsScreen } from "@app/screens/steps";

import { MainStackParamList } from "./app-navigation-types";

const AppStack = createNativeStackNavigator<MainStackParamList>();

export const AppNavigator = ({
    defaultComponent,
}: {
    defaultComponent: React.ComponentType;
}) => {
    return (
        <AppStack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="Tabs"
        >
            <AppStack.Screen name="Tabs" component={defaultComponent} />
            <AppStack.Screen name="Steps" component={StepsScreen} />
            <AppStack.Screen name="Heart" component={HeartScreen} />
            <AppStack.Screen name="Sleep" component={SleepScreen} />
        </AppStack.Navigator>
    );
};
