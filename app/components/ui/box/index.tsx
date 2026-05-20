import {
    DimensionValue,
    Pressable,
    StyleProp,
    View,
    ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";

import { Text } from "@components/ui/text";
import { useColorTheme } from "@hooks/use-color-theme";
import { usePressAnimation } from "@hooks/use-press-animation";
import { useResponsive } from "@hooks/use-reponsive";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
    const { animatedStyle, onPressIn, onPressOut } = usePressAnimation();

    const responsivePadding = useResponsive({
        smallScreenValue: 12,
        largeScreenValue: 8,
        threshold: 400,
        thresholdType: "width",
    });

    const baseStyle: ViewStyle = {
        minHeight: height,
        backgroundColor: colors.box,
        borderRadius: 15,
        padding: responsivePadding,
        width: width,
        aspectRatio: aspectRatio ? 1 : undefined,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
        elevation: 3,
    };

    const inner = (
        <>
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
                            flexShrink: 0,
                            maxWidth: "50%",
                        }}
                    >
                        {headerContent}
                    </View>
                )}
            </View>
            {children}
        </>
    );

    if (onPress) {
        return (
            <AnimatedPressable
                id={id ? id : undefined}
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                style={[baseStyle, style, animatedStyle]}
            >
                {inner}
            </AnimatedPressable>
        );
    }

    return (
        <View id={id ? id : undefined} style={[baseStyle, style]}>
            {inner}
        </View>
    );
}
