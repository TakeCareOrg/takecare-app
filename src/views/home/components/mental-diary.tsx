import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import { DiaryIcon } from "../../../../assets/icons/DiaryIcon";
import { useColors } from "../../../styles/Colors";
import ContainerStyle from "../../../styles/container-style";
import { DiaryStyle } from "../../../styles/diary-style";
import { padding } from "../../../styles/global-style";
import { RootStackParamList } from "../../../types/router.types";
import { TextComponent } from "../../../ui/text-component";

export const MentalDiary = () => {
    const { diary, main } = useColors();
    const styles = DiaryStyle();
    const containerStyle = ContainerStyle();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { t } = useTranslation();

    return (
        <LinearGradient
            colors={diary}
            style={[
                containerStyle.container,
                {
                    ...padding(10),
                },
            ]}
            onTouchStart={() => () => navigation.navigate("chat")}
        >
            <TextComponent fontSize={18} color={main.white} style={styles.text}>
                {t("HOME.MENTAL_HEALTH")}
            </TextComponent>
            <View
                style={{
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                }}
            >
                <DiaryIcon width={60} height={60} />
            </View>
        </LinearGradient>
    );
};
