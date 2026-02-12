import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
    Dimensions,
    StyleSheet,
    useWindowDimensions,
    View,
} from "react-native";

import { useColorTheme } from "@app/hooks/use-color-theme";
import { AverageScoreIcon } from "@assets/icons/AverageScoreIcon";
import { BadScoreIcon } from "@assets/icons/BadScoreIcon";
import { GoodScoreIcon } from "@assets/icons/GoodScoreIcon";
import { VeryBadScoreIcon } from "@assets/icons/VeryBadScoreIcon";
import { VeryGoodScoreIcon } from "@assets/icons/VeryGoodScoreIcon";
import { Text } from "@components/ui/text";
import { padding } from "@utils/styles";

export function HealthCheck({ score }: { score: number | null }) {
    const windowWidth = useWindowDimensions().width;
    const colors = useColorTheme();
    const { t } = useTranslation("full_trads");

    const getIconSize = () => {
        const baseSize = windowWidth / 2;
        if (windowWidth > 500) {
            // For the terrible galaxy fold
            return {
                small: baseSize - 170,
                medium: baseSize - 150,
                large: baseSize,
            };
        }
        return {
            small: baseSize - 35,
            medium: baseSize - 30,
            large: baseSize + 20,
        };
    };

    const iconSizes = getIconSize();

    const [IconComponent, iconSize, backgroundColor, iconColor] =
        useMemo(() => {
            if (score === null) {
                return [
                    VeryBadScoreIcon,
                    iconSizes.small,
                    colors.isDark ? "#1A1A1A" : "#F0F0F0",
                    "rgba(77, 27, 27, 0.4)",
                ];
            }
            if (score > 0 && score < 20) {
                return [
                    VeryBadScoreIcon,
                    iconSizes.small,
                    colors.isDark ? "#923939" : "#D46A6A",
                    colors.isDark
                        ? "rgba(77, 27, 27, 0.4)"
                        : "rgba(77, 27, 27, 0.2)",
                ];
            }
            if (score >= 20 && score < 40) {
                return [
                    BadScoreIcon,
                    iconSizes.medium,
                    colors.isDark ? "#925939" : "#C4845E",
                    colors.isDark
                        ? "rgba(67, 44, 30, 0.4)"
                        : "rgba(67, 44, 30, 0.2)",
                ];
            }
            if (score >= 40 && score < 60) {
                return [
                    AverageScoreIcon,
                    iconSizes.medium,
                    colors.isDark ? "#396792" : "#5A8DB8",
                    colors.isDark
                        ? "rgba(23, 44, 63, 0.4)"
                        : "rgba(23, 44, 63, 0.2)",
                ];
            }
            if (score >= 60 && score < 80) {
                return [
                    GoodScoreIcon,
                    iconSizes.small,
                    colors.isDark ? "#399262" : "#4DB87E",
                    colors.isDark
                        ? "rgba(25, 61, 42, 0.4)"
                        : "rgba(25, 61, 42, 0.2)",
                ];
            }
            if (score >= 80) {
                return [
                    VeryGoodScoreIcon,
                    iconSizes.medium,
                    colors.isDark ? "#11DA6D" : "#2EE880",
                    colors.isDark
                        ? "rgba(6, 43, 23, 0.4)"
                        : "rgba(6, 43, 23, 0.2)",
                ];
            }
            return [
                VeryBadScoreIcon,
                iconSizes.medium,
                colors.isDark ? "#1A1A1A" : "#F0F0F0",
                "rgba(6, 43, 23, 0.4)",
            ];
        }, [iconSizes.medium, iconSizes.small, score, colors.isDark]);

    if (!score) {
        return (
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor,
                        ...padding(10),
                        justifyContent: "center",
                        alignItems: "center",
                        height: Dimensions.get("window").height / 5,
                    },
                ]}
            >
                <Text
                    fontSize={16}
                    weight="700"
                    color={
                        colors.isDark
                            ? "rgba(193, 193, 193, 0.79)"
                            : "rgba(100, 100, 100, 0.79)"
                    }
                    style={{
                        textAlign: "center",
                        lineHeight: 20,
                    }}
                >
                    {t("HOME_PAGE.HEALTH_CHECK.NO_SCORE")}
                </Text>
            </View>
        );
    }

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor,
                    width: windowWidth / 2 - 25,
                },
            ]}
        >
            <View style={[styles.layoutIcon, styles.iconContainer]}>
                <IconComponent
                    width={iconSize}
                    height={iconSize}
                    color={iconColor}
                    style={styles.icon}
                />
            </View>
            <Text
                fontSize={50}
                color="#FFFFFF"
                style={styles.score}
                weight="700"
            >
                {score}
            </Text>
            <Text
                fontSize={17}
                color="rgba(255, 255, 255, 0.8)"
                style={styles.text}
                weight="700"
            >
                {t("HOME_PAGE.HEALTH_CHECK.SCORE_TODAY")}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
        ...padding(10, 15),
        height: 175,
        minHeight: 160,
        flex: 0,
        zIndex: -1,
    },
    icon: {
        resizeMode: "contain",
        maxWidth: "100%",
        maxHeight: "100%",
    },
    score: {
        zIndex: 2,
        position: "absolute",
        left: 25,
        top: 30,
    },
    text: {
        zIndex: 2,
        position: "absolute",
        right: 15,
        bottom: 20,
        width: 100,
        textAlign: "right",
    },
    layoutIcon: {
        zIndex: 1,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    iconContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
    },
});
