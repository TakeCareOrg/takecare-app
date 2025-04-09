import React from "react";
import { useTranslation } from "react-i18next";
import {
    Dimensions,
    StyleSheet,
    View,
    useWindowDimensions,
} from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import { AverageScoreIcon } from "../../../../assets/icons/AverageScoreIcon";
import { BadScoreIcon } from "../../../../assets/icons/BadScoreIcon";
import { GoodScoreIcon } from "../../../../assets/icons/GoodScoreIcon";
import { VeryBadScoreIcon } from "../../../../assets/icons/VeryBadScoreIcon";
import { VeryGoodScoreIcon } from "../../../../assets/icons/VeryGoodScoreIcon";
import { useColors } from "../../../styles/Colors";
import ContainerStyle from "../../../styles/container-style";
import { padding } from "../../../styles/global-style";
import { HealthCheckStyle } from "../../../styles/health-check-style";
import { TextComponent } from "../../../ui/text-component";

export const HealthScore: React.FC<{ score?: number }> = ({ score }) => {
    const styles = HealthCheckStyle();
    const containerStyle = ContainerStyle();
    const { healthScore, main } = useColors();
    const windowWidth = useWindowDimensions().width;
    const { t } = useTranslation();

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

    const iconStyle = StyleSheet.create({
        iconContainer: {
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
        },
        icon: {
            resizeMode: "contain", // Ensure the icon scales correctly
            maxWidth: "100%",
            maxHeight: "100%",
        },
    });

    if (!score) {
        return (
            <LinearGradient
                colors={healthScore.empty}
                style={[
                    containerStyle.container,
                    {
                        ...padding(10),
                        justifyContent: "center",
                        alignItems: "center",
                        height: Dimensions.get("window").height / 5,
                    },
                ]}
            >
                <TextComponent
                    fontSize={16}
                    color={healthScore.text}
                    style={{
                        textAlign: "center",
                        lineHeight: 20,
                    }}
                >
                    {/* You haven't had your health check-up yet today */}
                    {t("HOME.HEALTH_CHECK_NO_SCORE")}
                </TextComponent>
            </LinearGradient>
        );
    }

    let IconComponent;
    let iconSize;
    let backgroundColor;
    let iconColor;

    switch (true) {
        case score > 0 && score < 20:
            IconComponent = VeryBadScoreIcon;
            iconSize = iconSizes.small;
            backgroundColor = healthScore.VBBackground;
            iconColor = healthScore.VB;
            break;
        case score >= 20 && score < 40:
            IconComponent = BadScoreIcon;
            iconSize = iconSizes.medium;
            backgroundColor = healthScore.BBackground;
            iconColor = healthScore.B;
            break;
        case score >= 40 && score < 60:
            IconComponent = AverageScoreIcon;
            iconSize = iconSizes.medium;
            backgroundColor = healthScore.ABackground;
            iconColor = healthScore.A;
            break;
        case score >= 60 && score < 80:
            IconComponent = GoodScoreIcon;
            iconSize = iconSizes.small;
            backgroundColor = healthScore.GBackground;
            iconColor = healthScore.G;
            break;
        case score >= 80:
            IconComponent = VeryGoodScoreIcon;
            iconSize = iconSizes.medium;
            backgroundColor = healthScore.GBackground;
            iconColor = healthScore.G;
            break;
        default:
            return null;
    }

    if (!IconComponent || !iconColor) {
        return null; // Handle cases where IconComponent or iconColor is undefined
    }

    return (
        <LinearGradient
            colors={backgroundColor}
            style={containerStyle.container}
        >
            <View style={[styles.layoutIcon, iconStyle.iconContainer]}>
                <IconComponent
                    width={iconSize}
                    height={iconSize}
                    color={iconColor}
                    style={iconStyle.icon}
                />
            </View>
            <TextComponent
                fontSize={50}
                color={main.white}
                style={styles.score}
            >
                {score}
            </TextComponent>
            <TextComponent
                fontSize={17}
                color={healthScore.text}
                style={styles.text}
            >
                {t("HOME.HEALTH_CHECK_SCORE_TODAY")}
            </TextComponent>
        </LinearGradient>
    );
};
