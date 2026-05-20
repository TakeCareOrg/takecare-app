import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
    DimensionValue,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";

import { DiaryIcon } from "@assets/icons/DiaryIcon";
import { GradientBox } from "@components/ui/gradient-box";
import { Text } from "@components/ui/text";
import { useColorTheme } from "@hooks/use-color-theme";

export function DiaryBox({
    width,
    height,
    style,
}: {
    width?: DimensionValue;
    height?: DimensionValue;
    style?: StyleProp<ViewStyle>;
}) {
    const { t } = useTranslation("full_trads");
    const navigation = useNavigation();
    const colors = useColorTheme();

    return (
        <GradientBox
            width={width}
            height={typeof height === "number" ? height : undefined}
            style={style}
            gradient={[colors.blue[200], colors.blue[500]]}
            onPress={() => {
                navigation.navigate("Chat");
            }}
        >
            <View style={styles.content}>
                <Text
                    fontSize={16}
                    color={colors.white}
                    weight="700"
                    style={styles.text}
                    numberOfLines={3}
                >
                    {t("HOME_PAGE.DIARY.MENTAL_HEALTH")}
                </Text>
                <View style={styles.iconWrapper}>
                    <DiaryIcon width={56} height={56} />
                </View>
            </View>
        </GradientBox>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        position: "relative",
    },
    text: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        lineHeight: 22,
        letterSpacing: 0.3,
    },
    iconWrapper: {
        position: "absolute",
        bottom: 0,
        right: 0,
    },
});
