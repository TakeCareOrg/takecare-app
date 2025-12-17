import { DimensionValue, Pressable, View } from "react-native";

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
    onPress,
    aspectRatio = false,
}: {
    id?: string | null;
    children: React.ReactNode;
    height?: number;
    title?: string;
    headerContent?: React.ReactNode;
    headerStyle?: object;
    width?: DimensionValue;
    onPress?: () => void;
    aspectRatio?: boolean;
}) {
    const colors = useColorTheme();

    const responsivePadding = useResponsive({
        smallScreenValue: 6,
        largeScreenValue: 8,
        threshold: 400,
        thresholdType: "width",
    });

    const Wrapper = onPress ? Pressable : View;

    return (
        <Wrapper
            id={id ? id : undefined}
            onPress={onPress}
            style={{
                flex: 1,
                minHeight: height,
                backgroundColor: colors.box,
                borderRadius: 15,
                padding: responsivePadding,
                width: width,
                aspectRatio: aspectRatio ? 1 : undefined,
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
                        weight="700"
                        numberOfLines={1}
                        adjustsFontSizeToFit={true}
                        color={colors.secondary}
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
        </Wrapper>
    );
}
