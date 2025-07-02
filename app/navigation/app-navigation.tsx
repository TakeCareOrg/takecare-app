import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { StepsScreen } from "@app/screens/steps";

import { BottomTabParamList, MainStackParamList } from "./app-navigation-types";

const AppStack = createNativeStackNavigator<MainStackParamList>();

export const AppNavigator = ({
    defaultRoute,
    defaultComponent,
}: {
    defaultRoute: keyof BottomTabParamList;
    defaultComponent: React.ComponentType;
}) => {
    return (
        <AppStack.Navigator
            key={`${defaultRoute}-${Date.now()}`}
            screenOptions={{
                headerShown: false,
                animationTypeForReplace: "push",
            }}
            initialRouteName={defaultRoute}
        >
            <AppStack.Screen name={defaultRoute} component={defaultComponent} />
            <AppStack.Screen name="Steps" component={StepsScreen} />
        </AppStack.Navigator>
    );
};
