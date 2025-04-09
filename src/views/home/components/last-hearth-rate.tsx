import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { BPMIcon } from "../../../../assets/icons/BPMIcon";
import { ResponsiveContext } from "../../../contexts/responsive-context";
import { useIosHealthData } from "../../../hooks/use-ios-health-data";
import { useColors } from "../../../styles/Colors";
import { Container } from "../../../ui/container";
import { TextComponent } from "../../../ui/text-component";

export const LastHearthRate: React.FC = () => {
    const { heartRate } = useIosHealthData();
    const { pastels, BPM } = useColors();
    const { screenWidth } = useContext(ResponsiveContext);
    const { t } = useTranslation();

    return (
        <Container
            title={t("HOME.HEART_RATE")}
            preset={"little"}
            tagContent={
                heartRate[0]?.value
                    ? t("HOME.HEART.NORMAL_BPM")
                    : t("HOME.HEART.NO_DATA")
            }
            tagFontSize={7}
            tagBackgroundColor={pastels.redBackground}
            tagColor={pastels.redText}
            height={"auto"}
            width={screenWidth / 2 - 25}
        >
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "baseline",
                }}
            >
                <TextComponent fontSize={40}>
                    {heartRate[0]?.value ? (
                        Number(heartRate[0]?.value || 0).toFixed(0)
                    ) : (
                        <TextComponent fontSize={24}>
                            {/* Not Available */}
                            {t("HOME.HEART.NOT_AVAILABLE")}
                        </TextComponent>
                    )}
                </TextComponent>
                {heartRate[0]?.value ? (
                    <TextComponent fontSize={12}> bpm </TextComponent>
                ) : null}
            </View>
            <View
                style={{
                    display: "flex",
                    alignItems: "flex-end",
                }}
            >
                <BPMIcon
                    color={BPM.primary}
                    colorSecondary={BPM.secondary}
                    width={62}
                    height={62}
                />
            </View>
        </Container>
    );
};
