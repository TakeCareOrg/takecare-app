import { View } from "react-native";

import { useColorTheme } from "@hooks/use-color-theme";

import { Text } from "@app/components/ui/text";
import { useResponsive } from "@app/hooks/use-reponsive";

export function Box({
    id = null,
    children,
    height = 150,
    title,
    headerContent,
    headerStyle,
}: {
    id?: string | null;
    children: React.ReactNode;
    height?: number;
    title?: string;
    headerContent?: React.ReactNode;
    headerStyle?: object;
}) {
    const colors = useColorTheme();
    const responsivePadding = useResponsive({
        smallScreenValue: 12,
        largeScreenValue: 16,
        threshold: 400,
        thresholdType: "width",
    });

    return (
        <View
            id={id ? id : undefined}
            style={{
                flex: 1,
                minHeight: height,
                backgroundColor: colors.card,
                borderRadius: 8,
                padding: responsivePadding,
            }}
        >
            <View
                style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    columnGap: 8,
                    ...headerStyle,
                }}
            >
                {title && (
                    <Text
                        style={{
                            fontFamily: "Poppins-Medium",
                            marginBottom: 8,
                        }}
                    >
                        {title}
                    </Text>
                )}
                {headerContent && (
                    <View style={{ marginBottom: 8 }}>{headerContent}</View>
                )}
            </View>
            {children}
        </View>
    );
}
