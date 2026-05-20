import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ComponentType } from "react";

import { BodyCompositionScreen } from "@app/screens/body-composition";
import { HeartScreen } from "@app/screens/bpm";
import { SleepScreen } from "@app/screens/sleep";
import { StepsScreen } from "@app/screens/steps";
import { VitalsScreen } from "@app/screens/vitals";

import { MainStackParamList } from "./app-navigation-types";

const AppStack = createNativeStackNavigator<MainStackParamList>();

export const AppNavigator = ({
    defaultComponent,
}: {
    defaultComponent: ComponentType;
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
            <AppStack.Screen
                name="BodyComposition"
                component={BodyCompositionScreen}
            />
            <AppStack.Screen name="Vitals" component={VitalsScreen} />
        </AppStack.Navigator>
    );
};
