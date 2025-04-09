import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
    Home: undefined;
    Profile: undefined;
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    chat: undefined;
    UpdateUserScreen: { dataKey: string };
};

export interface NavigateProps {
    navigation: StackNavigationProp<RootStackParamList>;
}
