import { DimensionValue, View } from "react-native";

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
                    marginBottom: title || headerContent ? 8 : 0,
                    ...headerStyle,
                }}
            >
                {title && (
                    <Text
                        style={{
                            flex: 1,
                            flexShrink: 1,
                        }}
                        numberOfLines={1}
                        adjustsFontSizeToFit={true}
                    >
                        {title}
                    </Text>
                )}
                {headerContent && (
                    <View
                        style={{
                            flexShrink: 0, // Don't shrink the chip
                            maxWidth: "50%", // Limit chip width to 50% of container
                        }}
                    >
                        {headerContent}
                    </View>
                )}
            </View>
            {children}
        </View>
    );
}
