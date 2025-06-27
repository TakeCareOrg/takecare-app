import Feather from "@expo/vector-icons/Feather";

export const BottomTabIcons = {
    home: ({ color, isFocused }: { color: string; isFocused: boolean }) => (
        <Feather name="home" size={20} color={color} />
    ),
    chat: () => null,
    profile: ({ color, isFocused }: { color: string; isFocused: boolean }) => (
        <Feather name="user" size={20} color={color} />
    ),
};
