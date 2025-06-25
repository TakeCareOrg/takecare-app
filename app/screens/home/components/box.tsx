import { View } from "react-native";

import { useColorTheme } from "@hooks/use-color-theme";

export function Box({
    children,
    height = 150,
}: {
    children: React.ReactNode;
    height?: number;
}) {
    const colors = useColorTheme();
    return (
        <View
            style={{
                width: "100%",
                height: height,
                backgroundColor: colors.card,
                borderRadius: 8,
                padding: 16,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {children}
        </View>
    );
}
