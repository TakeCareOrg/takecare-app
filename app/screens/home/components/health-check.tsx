import { useMemo } from "react";
import {
    Dimensions,
    StyleSheet,
    useWindowDimensions,
    View,
} from "react-native";

import { AverageScoreIcon } from "@app/assets/icons/AverageScoreIcon";
import { BadScoreIcon } from "@app/assets/icons/BadScoreIcon";
import { GoodScoreIcon } from "@app/assets/icons/GoodScoreIcon";
import { VeryBadScoreIcon } from "@app/assets/icons/VeryBadScoreIcon";
import { VeryGoodScoreIcon } from "@app/assets/icons/VeryGoodScoreIcon";
import { Text } from "@app/components/ui/text";
import { margin, padding } from "@app/utils/styles";
import { useTranslation } from "react-i18next";

export function HealthCheck({ score }: { score: number | null }) {
    const windowWidth = useWindowDimensions().width;
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

    const IconComponent = useMemo(() => {
        if (score === null) {
            return VeryBadScoreIcon;
        }
        if (score > 0 && score < 20) {
            return VeryBadScoreIcon;
        }
        if (score >= 20 && score < 40) {
            return BadScoreIcon;
        }
        if (score >= 40 && score < 60) {
            return AverageScoreIcon;
        }
        if (score >= 60 && score < 80) {
            return GoodScoreIcon;
        }
        if (score >= 80) {
            return VeryGoodScoreIcon;
        }
        return VeryBadScoreIcon;
    }, [score]);

    const iconSize = useMemo(() => {
        if (score === null) {
            return iconSizes.small;
        }
        if (score > 0 && score < 20) {
            return iconSizes.small;
        }
        if (score >= 20 && score < 40) {
            return iconSizes.medium;
        }
        if (score >= 40 && score < 60) {
            return iconSizes.medium;
        }
        if (score >= 60 && score < 80) {
            return iconSizes.small;
        }
        if (score >= 80) {
            return iconSizes.medium;
        }
        return iconSizes.medium;
    }, [score]);
    const backgroundColor = useMemo(() => {
        if (score === null) {
            return "#FFFFFF";
        }
        if (score > 0 && score < 20) {
            return "#923939";
        }
        if (score >= 20 && score < 40) {
            return "#925939";
        }
        if (score >= 40 && score < 60) {
            return "#396792";
        }
        if (score >= 60 && score < 80) {
            return "#399262";
        }
        if (score >= 80) {
            return "#11DA6D";
        }
        return "#FFFFFF";
    }, [score]);

    const iconColor = useMemo(() => {
        if (score === null) {
            return "rgba(77, 27, 27, 0.4)";
        }
        if (score > 0 && score < 20) {
            return "rgba(77, 27, 27, 0.4)";
        }
        if (score >= 20 && score < 40) {
            return "rgba(67, 44, 30, 0.4)";
        }
        if (score >= 40 && score < 60) {
            return "rgba(23, 44, 63, 0.4)";
        }
        if (score >= 60 && score < 80) {
            return "rgba(25, 61, 42, 0.4)";
        }
        if (score >= 80) {
            return "rgba(6, 43, 23,0.4)";
        }
        return "rgba(6, 43, 23,0.4)";
    }, [score]);

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
                    color="rgba(193, 193, 193, 0.79)"
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
            <Text fontSize={50} color="#FFFFFF" style={styles.score}>
                {score}
            </Text>
            <Text
                fontSize={17}
                color="rgba(193, 193, 193, 0.79)"
                style={styles.text}
            >
                {t("HOME_PAGE.HEALTH_CHECK.SCORE_TODAY")}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1A1A1A",
        borderRadius: 15,
        ...padding(10, 15),
        ...margin(12, 0),
        width: "47%",
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
