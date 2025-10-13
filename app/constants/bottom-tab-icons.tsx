import Feather from "@expo/vector-icons/Feather";

export const BottomTabIcons = {
    Home: ({ color, isFocused }: { color: string; isFocused: boolean }) => (
        <Feather name="home" size={20} color={color} />
    ),
    Chat: () => null,
    Profile: ({ color, isFocused }: { color: string; isFocused: boolean }) => (
        <Feather name="user" size={20} color={color} />
    ),
    step: ({ color, isFocused }: { color: string; isFocused: boolean }) => (
        <Feather name="activity" size={20} color={color} />
    ),
};
