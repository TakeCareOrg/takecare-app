import Feather from "@expo/vector-icons/Feather";

export const BottomTabIcons = {
    home: ({ color }: { color: string }) => (
        <Feather name="home" size={24} color={color} />
    ),
    chat: () => null,
    profile: ({ color }: { color: string }) => (
        <Feather name="user" size={24} color={color} />
    ),
};
