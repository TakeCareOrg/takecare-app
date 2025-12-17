import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { shortDateFormat } from "@app/utils/date";
import { Text } from "@components/ui/text";
import { UserHealthAttributions } from "@dtypes/base/users";
import { useColorTheme } from "@hooks/use-color-theme";
import { useAuthStore } from "@stores/auth";
import { useUserStore } from "@stores/users";

import { Item } from "./components/item";
import { UpdateUserHealthDataModal } from "./components/update-modal";

interface ContainerProps {
    children: React.ReactNode;
    title?: string;
}

const Container = ({ children, title }: ContainerProps) => {
    const themeColors = useColorTheme();

    return (
        <View style={styles.sectionContainer}>
            {title && (
                <Text
                    style={[styles.sectionTitle, { color: themeColors.text }]}
                >
                    {title}
                </Text>
            )}
            <View
                style={[
                    styles.itemsContainer,
                    { backgroundColor: themeColors.box },
                ]}
            >
                {children}
            </View>
        </View>
    );
};

export const ProfileScreen = () => {
    const themeColors = useColorTheme();
    const { t, i18n } = useTranslation("full_trads");
    const user = useUserStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [updateField, setUpdateField] = useState<string | null>(null);

    const handleUpdateField = (field: keyof UserHealthAttributions) => {
        setIsUpdateModalVisible(true);
        setUpdateField(field);
    };

    const handleSignOut = () => {
        Alert.alert(t("PROFILE.SIGN_OUT"), t("PROFILE.SIGN_OUT_CONFIRM"), [
            { text: t("COMMON.CANCEL"), style: "cancel" },
            {
                text: t("PROFILE.SIGN_OUT"),
                style: "destructive",
                onPress: () => {
                    logout();
                },
            },
        ]);
    };

    const generalItems: {
        icon: keyof typeof Ionicons.glyphMap;
        title: string;
        onPress: () => void;
    }[] = [
        {
            icon: "person-outline",
            title: t("PROFILE.GENERAL_ITEMS.PROFILE_DETAILS"),
            onPress: () => {},
        },
        {
            icon: "lock-closed-outline",
            title: t("PROFILE.GENERAL_ITEMS.LOGIN_SECURITY"),
            onPress: () => {},
        },
        {
            icon: "notifications-outline",
            title: t("PROFILE.GENERAL_ITEMS.NOTIFICATIONS"),
            onPress: () => {},
        },
        {
            icon: "watch-outline",
            title: t("PROFILE.GENERAL_ITEMS.CONNECTED_DEVICES"),
            onPress: () => {},
        },
    ];

    const healthItems: {
        icon: keyof typeof Ionicons.glyphMap;
        title: string;
        value:
            | UserHealthAttributions[keyof UserHealthAttributions]
            | boolean
            | null;
        onPress: () => void;
    }[] = [
        {
            icon: "calendar-outline",
            title: t("PROFILE.HEALTH_ITEMS.AGE"),
            value:
                new Date(user?.health?.birth_date || "").toLocaleDateString(
                    i18n.language,
                    shortDateFormat,
                ) || null,
            onPress: () => handleUpdateField("birth_date"),
        },
        {
            icon: "person-outline",
            title: t("PROFILE.HEALTH_ITEMS.GENDER"),
            value: user?.health?.gender
                ? t(`PROFILE.VALUES.${user?.health?.gender.toUpperCase()}`)
                : null,
            onPress: () => handleUpdateField("gender"),
        },
        {
            icon: "scale-outline",
            title: t("PROFILE.HEALTH_ITEMS.WEIGHT"),
            value: `${user?.health?.weight || ""} ${user?.health?.weight_unit || ""}`,
            onPress: () => handleUpdateField("weight"),
        },
        {
            icon: "resize-outline",
            title: t("PROFILE.HEALTH_ITEMS.HEIGHT"),
            value: `${user?.health?.height || ""} ${user?.health?.height_unit || ""}`,
            onPress: () => handleUpdateField("height"),
        },
        {
            icon: "wine-outline",
            title: t("PROFILE.HEALTH_ITEMS.ALCOHOL"),
            value: user?.health?.alcohol
                ? t(`PROFILE.VALUES.${user?.health?.alcohol.toUpperCase()}`)
                : null,
            onPress: () => handleUpdateField("alcohol"),
        },
        {
            icon: "ban-outline",
            title: t("PROFILE.HEALTH_ITEMS.SMOKING"),
            value: user?.health?.smoking
                ? t(`PROFILE.VALUES.${user?.health?.smoking.toUpperCase()}`)
                : null,
            onPress: () => handleUpdateField("smoking"),
        },
        {
            icon: "medical-outline",
            title: t("PROFILE.HEALTH_ITEMS.PROFESSIONAL_HELP"),
            value:
                user?.health?.professional_help?.length &&
                user?.health?.professional_help?.length > 0
                    ? true
                    : false,
            onPress: () => handleUpdateField("professional_help"),
        },
        {
            icon: "heart-outline",
            title: t("PROFILE.HEALTH_ITEMS.CHRONIC_ILLNESS"),
            value:
                user?.health?.chronic_illness?.length &&
                user?.health?.chronic_illness?.length > 0
                    ? true
                    : false,
            onPress: () => handleUpdateField("chronic_illness"),
        },
        {
            icon: "medical-outline",
            title: t("PROFILE.HEALTH_ITEMS.MEDICATION_TREATMENT"),
            value:
                user?.health?.medication_treatment?.length &&
                user?.health?.medication_treatment?.length > 0
                    ? true
                    : false,
            onPress: () => handleUpdateField("medication_treatment"),
        },
        {
            icon: "leaf-outline",
            title: t("PROFILE.HEALTH_ITEMS.ALLERGIES"),
            value:
                user?.health?.allergies?.length &&
                user?.health?.allergies?.length > 0
                    ? true
                    : false,
            onPress: () => handleUpdateField("allergies"),
        },
        {
            icon: "barbell-outline",
            title: t("PROFILE.HEALTH_ITEMS.SPORTS"),
            value:
                user?.health?.practice_sports?.length &&
                user?.health?.practice_sports?.length > 0
                    ? true
                    : false,
            onPress: () => handleUpdateField("practice_sports"),
        },
        {
            icon: "cut-outline",
            title: t("PROFILE.HEALTH_ITEMS.PREVIOUS_SURGERY"),
            value:
                user?.health?.surgery_before?.length &&
                user?.health?.surgery_before?.length > 0
                    ? true
                    : false,
            onPress: () => handleUpdateField("surgery_before"),
        },
    ];

    const supportItems: {
        icon: keyof typeof Ionicons.glyphMap;
        title: string;
        onPress: () => void;
        color?: string;
    }[] = [
        {
            icon: "help-circle-outline",
            title: t("PROFILE.SUPPORT_ITEMS.FAQ"),
            onPress: () => {},
        },
        {
            icon: "information-circle-outline",
            title: t("PROFILE.SUPPORT_ITEMS.SUPPORT"),
            onPress: () => {},
        },
        {
            icon: "log-out-outline",
            title: t("PROFILE.SUPPORT_ITEMS.SIGN_OUT"),
            onPress: handleSignOut,
            color: "#FF3B30",
        },
    ];

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: themeColors.background },
            ]}
        >
            <View
                style={[
                    styles.header,
                    {
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.3,
                        shadowRadius: 12,
                        elevation: 12,
                    },
                ]}
            >
                <TouchableOpacity
                    style={[
                        styles.avatarContainer,
                        themeColors.isDark && {
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.4,
                            shadowRadius: 8,
                        },
                    ]}
                    activeOpacity={0.8}
                >
                    <Image
                        source={{ uri: user?.avatar }}
                        style={[
                            styles.avatar,
                            { borderColor: themeColors.border },
                        ]}
                    />
                    <View
                        style={[
                            styles.editBadge,
                            {
                                backgroundColor: themeColors.isDark
                                    ? themeColors.raw.blue[400]
                                    : themeColors.raw.blue[200],
                                borderColor: themeColors.border,
                                shadowColor: themeColors.background,
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.2,
                                shadowRadius: 4,
                            },
                        ]}
                    >
                        <Ionicons
                            name="camera"
                            size={12}
                            color={themeColors.raw.white[500]}
                        />
                    </View>
                </TouchableOpacity>
                <Text style={[styles.userName]}>
                    {user?.first_name} {user?.last_name}
                </Text>
                <Text style={[styles.userEmail]}>{user?.email}</Text>
            </View>
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Container title={t("PROFILE.SECTIONS.GENERAL")}>
                    {generalItems.map((item, index) => (
                        <Item
                            key={index}
                            {...item}
                            isLast={index === generalItems.length - 1}
                        />
                    ))}
                </Container>
                <Container title={t("PROFILE.SECTIONS.HEALTH_DATA")}>
                    {healthItems.map((item, index) => (
                        <Item
                            key={index}
                            {...item}
                            isLast={index === healthItems.length - 1}
                        />
                    ))}
                </Container>
                <Container title={t("PROFILE.SECTIONS.SUPPORT")}>
                    {supportItems.map((item, index) => (
                        <Item
                            key={index}
                            {...item}
                            isLast={index === supportItems.length - 1}
                        />
                    ))}
                </Container>
            </ScrollView>
            {isUpdateModalVisible && updateField && (
                <UpdateUserHealthDataModal
                    isVisible={isUpdateModalVisible}
                    onClose={() => setIsUpdateModalVisible(false)}
                    field={updateField as keyof UserHealthAttributions}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 20,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "600",
        marginBottom: 20,
    },
    avatarContainer: {
        position: "relative",
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
    },
    editBadge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
    },
    userName: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 12,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionContainer: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
        marginLeft: 5,
    },
    itemsContainer: {
        borderRadius: 16,
        paddingHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
});
