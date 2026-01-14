import { useTranslation } from "react-i18next";
import { Dimensions, StyleSheet, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { Text } from "@app/components/ui/text";
import { useColorTheme } from "@app/hooks/use-color-theme";
import { DiaryIcon } from "@assets/icons/DiaryIcon";
import { padding } from "@utils/styles";

export function Diary() {
    const { t } = useTranslation("full_trads");
    const colors = useColorTheme();
    const windowWidth = Dimensions.get("window").width;
    return (
        <LinearGradient
            colors={[colors.blue[100], colors.blue[400]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
                styles.container,
                {
                    ...padding(10),
                    width: windowWidth / 2 - 25,
                },
            ]}
        >
            <Text
                fontSize={18}
                color={colors.white}
                weight="700"
                style={[styles.text]}
            >
                {t("HOME_PAGE.DIARY.MENTAL_HEALTH")}
            </Text>
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
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1A1A1A",
        borderRadius: 15,
        ...padding(10, 15),
        height: 175,
        minHeight: 160,
        flex: 0,
        zIndex: -1,
    },
    text: {
        textAlign: "left",
        lineHeight: 25,
        letterSpacing: 1,
        position: "absolute",
        top: 40,
        left: 15,
    },
});
