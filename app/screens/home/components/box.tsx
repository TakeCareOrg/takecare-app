import { Dimensions, DimensionValue, View } from "react-native";

import { Text } from "@components/ui/text";
import { useColorTheme } from "@hooks/use-color-theme";
import { useResponsive } from "@hooks/use-reponsive";

export function Box({
    id = null,
    children,
    height = 150,
    title,
    headerContent,
    headerStyle,
    width = "100%",
}: {
    id?: string | null;
    children: React.ReactNode;
    height?: number;
    title?: string;
    headerContent?: React.ReactNode;
    headerStyle?: object;
    width?: DimensionValue;
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
                width: width,
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
                            fontSize: 14,
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
