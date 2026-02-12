import {
    DimensionValue,
    Pressable,
    StyleProp,
    View,
    ViewStyle,
} from "react-native";

import { Text } from "@components/ui/text";
import { useColorTheme } from "@hooks/use-color-theme";
import { useResponsive } from "@hooks/use-reponsive";

export function Box({
    id = null,
    children,
    height,
    title,
    headerContent,
    headerStyle,
    width = "100%",
    onPress,
    aspectRatio = false,
    style,
}: {
    id?: string | null;
    children?: React.ReactNode;
    height?: number;
    title?: string;
    headerContent?: React.ReactNode;
    headerStyle?: object;
    width?: DimensionValue;
    onPress?: () => void;
    aspectRatio?: boolean;
    style?: StyleProp<ViewStyle>;
}) {
    const colors = useColorTheme();

    const responsivePadding = useResponsive({
        smallScreenValue: 12,
        largeScreenValue: 8,
        threshold: 400,
        thresholdType: "width",
    });

    const Wrapper = onPress ? Pressable : View;

    return (
        <Wrapper
            id={id ? id : undefined}
            onPress={onPress}
            style={[
                {
                    minHeight: height,
                    backgroundColor: colors.box,
                    borderRadius: 15,
                    padding: responsivePadding,
                    width: width,
                    aspectRatio: aspectRatio ? 1 : undefined,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,

                    elevation: 3,
                },
                style,
            ]}
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
