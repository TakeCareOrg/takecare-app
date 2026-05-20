import {
    DimensionValue,
    Pressable,
    StyleProp,
    View,
    ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";

import { LinearGradient } from "expo-linear-gradient";

import { Text } from "@components/ui/text";
import { useColorTheme } from "@hooks/use-color-theme";
import { usePressAnimation } from "@hooks/use-press-animation";
import { useResponsive } from "@hooks/use-reponsive";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type GradientStop = { x: number; y: number };

export function GradientBox({
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
    gradient,
    start = { x: 0, y: 0 },
    end = { x: 1, y: 1 },
    titleColor,
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
    gradient: readonly [string, string, ...string[]];
    start?: GradientStop;
    end?: GradientStop;
    titleColor?: string;
}) {
    const colors = useColorTheme();
    const { animatedStyle, onPressIn, onPressOut } = usePressAnimation();

    const responsivePadding = useResponsive({
        smallScreenValue: 12,
        largeScreenValue: 8,
        threshold: 400,
        thresholdType: "width",
    });

    const resolvedTitleColor = titleColor ?? colors.white;

    const baseStyle: ViewStyle = {
        minHeight: height,
        borderRadius: 15,
        width: width,
        aspectRatio: aspectRatio ? 1 : undefined,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
        elevation: 3,
    };

    const inner = (
        <LinearGradient
            colors={gradient as unknown as [string, string, ...string[]]}
            start={start}
            end={end}
            style={{
                flex: 1,
                padding: responsivePadding,
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
                        color={resolvedTitleColor}
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
        </LinearGradient>
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
