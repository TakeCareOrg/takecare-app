import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";

import { useColorTheme } from "@hooks/use-color-theme";

const mockUser = {
    name: "Jean",
    email: "jean@coding.fr",
    avatar: "https://images.unsplash.com/photo-1751229881841-79778db35e13?q=80&w=2951&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    health: {
        age: 28,
        gender: "Homme",
        weight: 65,
        weight_unit: "kg",
        height: 183,
        height_unit: "cm",
        alcohol: "Occasionnellement",
        smoking: "Non-fumeur",
        professional_help: false,
        chronic_illness: "Aucune",
        medication_treatment: "Aucun",
        allergies: "Pollen",
        practice_sports: "Oui",
        surgery_before: false,
    },
};

interface ContainerProps {
    children: React.ReactNode;
    title?: string;
    themeColors: any;
}

const Container = ({ children, title, themeColors }: ContainerProps) => {
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
                    {
                        backgroundColor: themeColors.cardBackground,
                    },
                ]}
            >
                {children}
            </View>
        </View>
    );
};

interface ItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    onPress: () => void;
    value?: string | number | boolean;
    color?: string;
    isLast?: boolean;
    themeColors: any;
}

function isDate(value: any): value is Date {
    return Object.prototype.toString.call(value) === "[object Date]";
}

const Item = ({
    icon,
    title,
    onPress,
    value,
    color = "#007AFF",
    isLast = false,
    themeColors,
}: ItemProps) => {
    const { t } = useTranslation();

    const displayValue = () => {
        if (value === undefined || value === null) return null;
        if (typeof value === "boolean")
            return value ? t("PROFILE.VALUES.YES") : t("PROFILE.VALUES.NO");
        if (isDate(value)) {
            return value.toLocaleString("fr-FR");
        }
        return value.toString();
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.itemContainer,
                !isLast && {
                    ...styles.itemBorder,
                    borderBottomColor: themeColors.isDark
                        ? "rgba(255, 255, 255, 0.1)"
                        : themeColors.border,
                },
            ]}
            activeOpacity={0.7}
        >
            <View style={styles.itemLeft}>
                <View
                    style={[
                        styles.iconContainer,
                        {
                            backgroundColor: themeColors.isDark
                                ? `${color}25`
                                : `${color}15`,
                        },
                    ]}
                >
                    <Ionicons name={icon} size={20} color={color} />
                </View>
                <Text style={[styles.itemTitle, { color: themeColors.text }]}>
                    {title}
                </Text>
            </View>
            <View style={styles.itemRight}>
                {displayValue() ? (
                    <Text
                        style={[
                            styles.itemValue,
                            {
                                color: themeColors.isDark
                                    ? "rgba(255, 255, 255, 0.9)"
                                    : themeColors.secondaryText,
                            },
                        ]}
                    >
                        {displayValue()}
                    </Text>
                ) : null}
                <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={
                        themeColors.isDark
                            ? "rgba(255, 255, 255, 0.6)"
                            : themeColors.secondaryText
                    }
                />
            </View>
        </TouchableOpacity>
    );
};

export const ProfileScreen = () => {
    const [user, setUser] = useState(mockUser);
    const themeColors = useColorTheme();
    const { t } = useTranslation();

    const handleImagePicker = async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                t("PROFILE.PERMISSION_REQUIRED"),
                t("PROFILE.PERMISSION_MESSAGE"),
                [
                    { text: t("COMMON.CANCEL"), style: "cancel" },
                    { text: t("PROFILE.SETTINGS"), onPress: () => {} },
                ],
            );
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled && result.assets[0]) {
            setUser((prev) => ({
                ...prev,
                avatar: result.assets[0].uri,
            }));
        }
    };

    const handleUpdateField = (field: string, value: any) => {
        Alert.alert(t("PROFILE.MODIFY"), t("PROFILE.MODIFY_FIELD", { field }), [
            { text: t("COMMON.CANCEL"), style: "cancel" },
            {
                text: t("PROFILE.MODIFY"),
                onPress: () => {},
            },
        ]);
    };

    const handleSignOut = () => {
        Alert.alert(t("PROFILE.SIGN_OUT"), t("PROFILE.SIGN_OUT_CONFIRM"), [
            { text: t("COMMON.CANCEL"), style: "cancel" },
            {
                text: t("PROFILE.SIGN_OUT"),
                style: "destructive",
                onPress: () => {},
            },
        ]);
    };

    const generalItems: Array<{
        icon: keyof typeof Ionicons.glyphMap;
        title: string;
        onPress: () => void;
    }> = [
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

    const healthItems: Array<{
        icon: keyof typeof Ionicons.glyphMap;
        title: string;
        value: string | number | boolean;
        onPress: () => void;
    }> = [
        {
            icon: "calendar-outline",
            title: t("PROFILE.HEALTH_ITEMS.AGE"),
            value: user.health.age,
            onPress: () =>
                handleUpdateField(
                    t("PROFILE.HEALTH_ITEMS.AGE"),
                    user.health.age,
                ),
        },
        {
            icon: "person-outline",
            title: t("PROFILE.HEALTH_ITEMS.GENDER"),
            value: user.health.gender,
            onPress: () =>
                handleUpdateField(
                    t("PROFILE.HEALTH_ITEMS.GENDER"),
                    user.health.gender,
                ),
        },
        {
            icon: "scale-outline",
            title: t("PROFILE.HEALTH_ITEMS.WEIGHT"),
            value: `${user.health.weight} ${user.health.weight_unit}`,
            onPress: () =>
                handleUpdateField(
                    t("PROFILE.HEALTH_ITEMS.WEIGHT"),
                    user.health.weight,
                ),
        },
        {
            icon: "resize-outline",
            title: t("PROFILE.HEALTH_ITEMS.HEIGHT"),
            value: `${user.health.height} ${user.health.height_unit}`,
            onPress: () =>
                handleUpdateField(
                    t("PROFILE.HEALTH_ITEMS.HEIGHT"),
                    user.health.height,
                ),
        },
        {
            icon: "wine-outline",
            title: t("PROFILE.HEALTH_ITEMS.ALCOHOL"),
            value: user.health.alcohol,
            onPress: () =>
                handleUpdateField(
                    t("PROFILE.HEALTH_ITEMS.ALCOHOL"),
                    user.health.alcohol,
                ),
        },
        {
            icon: "ban-outline",
            title: t("PROFILE.HEALTH_ITEMS.SMOKING"),
            value: user.health.smoking,
            onPress: () =>
                handleUpdateField(
                    t("PROFILE.HEALTH_ITEMS.SMOKING"),
                    user.health.smoking,
                ),
        },
        {
            icon: "medical-outline",
            title: t("PROFILE.HEALTH_ITEMS.PROFESSIONAL_HELP"),
            value: user.health.professional_help,
            onPress: () =>
                handleUpdateField(
                    t("PROFILE.HEALTH_ITEMS.PROFESSIONAL_HELP"),
                    user.health.professional_help,
                ),
        },
        {
            icon: "heart-outline",
            title: t("PROFILE.HEALTH_ITEMS.CHRONIC_ILLNESS"),
            value: user.health.chronic_illness,
            onPress: () =>
                handleUpdateField(
                    t("PROFILE.HEALTH_ITEMS.CHRONIC_ILLNESS"),
                    user.health.chronic_illness,
                ),
        },
        {
            icon: "medical-outline",
            title: t("PROFILE.HEALTH_ITEMS.MEDICATION_TREATMENT"),
            value: user.health.medication_treatment,
            onPress: () =>
                handleUpdateField(
                    t("PROFILE.HEALTH_ITEMS.MEDICATION_TREATMENT"),
                    user.health.medication_treatment,
                ),
        },
        {
            icon: "leaf-outline",
            title: t("PROFILE.HEALTH_ITEMS.ALLERGIES"),
            value: user.health.allergies,
            onPress: () =>
                handleUpdateField(
                    t("PROFILE.HEALTH_ITEMS.ALLERGIES"),
                    user.health.allergies,
                ),
        },
        {
            icon: "barbell-outline",
            title: t("PROFILE.HEALTH_ITEMS.SPORTS"),
            value: user.health.practice_sports,
            onPress: () =>
                handleUpdateField(
                    t("PROFILE.HEALTH_ITEMS.SPORTS"),
                    user.health.practice_sports,
                ),
        },
        {
            icon: "cut-outline",
            title: t("PROFILE.HEALTH_ITEMS.PREVIOUS_SURGERY"),
            value: user.health.surgery_before,
            onPress: () =>
                handleUpdateField(
                    t("PROFILE.HEALTH_ITEMS.PREVIOUS_SURGERY"),
                    user.health.surgery_before,
                ),
        },
    ];

    const supportItems: Array<{
        icon: keyof typeof Ionicons.glyphMap;
        title: string;
        onPress: () => void;
        color?: string;
    }> = [
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

    const gradientColors: [string, string] = themeColors.isDark
        ? ["#1a1a2e", "#16213e"]
        : ["#667eea", "#764ba2"];

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: themeColors.background },
            ]}
        >
            <LinearGradient
                colors={gradientColors}
                style={[
                    styles.header,
                    themeColors.isDark && {
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.3,
                        shadowRadius: 12,
                        elevation: 12,
                    },
                ]}
            >
                <Text style={styles.headerTitle}>{t("PROFILE.TITLE")}</Text>
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
                    onPress={handleImagePicker}
                    activeOpacity={0.8}
                >
                    <Image
                        source={{ uri: user.avatar }}
                        style={[
                            styles.avatar,
                            themeColors.isDark && {
                                borderColor: "rgba(255, 255, 255, 0.3)",
                                borderWidth: 3,
                            },
                        ]}
                    />
                    <View
                        style={[
                            styles.editBadge,
                            themeColors.isDark && {
                                backgroundColor: "#007AFF",
                                shadowColor: "#007AFF",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.5,
                                shadowRadius: 4,
                            },
                        ]}
                    >
                        <Ionicons name="camera" size={12} color="white" />
                    </View>
                </TouchableOpacity>
                <Text
                    style={[
                        styles.userName,
                        themeColors.isDark && {
                            textShadowColor: "rgba(0, 0, 0, 0.3)",
                            textShadowOffset: { width: 0, height: 1 },
                            textShadowRadius: 2,
                        },
                    ]}
                >
                    {user.name}
                </Text>
                <Text
                    style={[
                        styles.userEmail,
                        themeColors.isDark && {
                            color: "rgba(255, 255, 255, 0.7)",
                            textShadowColor: "rgba(0, 0, 0, 0.2)",
                            textShadowOffset: { width: 0, height: 1 },
                            textShadowRadius: 1,
                        },
                    ]}
                >
                    {user.email}
                </Text>
            </LinearGradient>
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Container
                    title={t("PROFILE.SECTIONS.GENERAL")}
                    themeColors={themeColors}
                >
                    {generalItems.map((item, index) => (
                        <Item
                            key={index}
                            {...item}
                            themeColors={themeColors}
                            isLast={index === generalItems.length - 1}
                        />
                    ))}
                </Container>
                <Container
                    title={t("PROFILE.SECTIONS.HEALTH_DATA")}
                    themeColors={themeColors}
                >
                    {healthItems.map((item, index) => (
                        <Item
                            key={index}
                            {...item}
                            themeColors={themeColors}
                            isLast={index === healthItems.length - 1}
                        />
                    ))}
                </Container>
                <Container
                    title={t("PROFILE.SECTIONS.SUPPORT")}
                    themeColors={themeColors}
                >
                    {supportItems.map((item, index) => (
                        <Item
                            key={index}
                            {...item}
                            themeColors={themeColors}
                            isLast={index === supportItems.length - 1}
                        />
                    ))}
                </Container>
            </ScrollView>
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
        fontWeight: "700",
        color: "white",
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
        borderWidth: 4,
        borderColor: "white",
    },
    editBadge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#007AFF",
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "white",
    },
    userName: {
        fontSize: 24,
        fontWeight: "600",
        color: "white",
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.8)",
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
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
    },
    itemBorder: {
        borderBottomWidth: 0.5,
    },
    itemLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: "500",
        flex: 1,
    },
    itemRight: {
        flexDirection: "row",
        alignItems: "center",
    },
    itemValue: {
        fontSize: 15,
        marginRight: 8,
        fontWeight: "500",
    },
});
