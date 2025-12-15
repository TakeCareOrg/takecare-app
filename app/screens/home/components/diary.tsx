import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { DiaryIcon } from "@assets/icons/DiaryIcon";
import { margin, padding } from "@utils/styles";

export function Diary() {
    const { t } = useTranslation("full_trads");
    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: "#7588D0",
                    ...padding(10),
                },
            ]}
        >
            <Text
                style={[
                    styles.text,
                    {
                        fontSize: 18,
                        color: "#FFFFFF",
                    },
                ]}
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
    text: {
        textAlign: "left",
        lineHeight: 25,
        letterSpacing: 1,
        position: "absolute",
        top: 40,
        left: 15,
    },
});
