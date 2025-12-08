import { Ionicons } from "@expo/vector-icons";
import React from "react";
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

import { Text } from "@components/ui/text";
import { UserHealthAttributions } from "@dtypes/base/users";
import { useColorTheme } from "@hooks/use-color-theme";
import { useAuthStore } from "@stores/auth";
import { useUserStore } from "@stores/users";

import { Item } from "./components/item";

const MOCK_USER_DATA = {
    first_name: "Alfred",
    last_name: "Bridus",
    avatar: "https://img.freepik.com/photos-gratuite/homme-exterieur-regardant-camera-souriant-genere-par-ia_188544-151526.jpg",
    health: {
        age: 48,
        gender: "Homme",
        weight: 75,
        weight_unit: "kg",
        height: 180,
        height_unit: "cm",
        alcohol: "Occasionnellement",
        smoking: "Non-fumeur",
        professional_help: "Non",
        chronic_illness: "Aucune",
        medication_treatment: "Aucun",
        allergies: "Pollen",
        practice_sports: "3 fois par semaine",
        surgery_before: "Aucune",
    },
};

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
    const { t } = useTranslation("full_trads");
    const user = useUserStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    // const handleImagePicker = async () => {
    //     const { status } =
    //         await ImagePicker.requestMediaLibraryPermissionsAsync();
    //     if (status !== "granted") {
    //         Alert.alert(
    //             t("PROFILE.PERMISSION_REQUIRED"),
    //             t("PROFILE.PERMISSION_MESSAGE"),
    //             [
    //                 { text: t("COMMON.CANCEL"), style: "cancel" },
    //                 { text: t("PROFILE.SETTINGS"), onPress: () => {} },
    //             ],
    //         );
    //         return;
    //     }
    //     const result = await ImagePicker.launchImageLibraryAsync({
    //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //         allowsEditing: true,
    //         aspect: [1, 1],
    //         quality: 0.8,
    //     });
    //     if (!result.canceled && result.assets[0]) {
    //         setUser((prev) => ({
    //             ...prev,
    //             avatar: result.assets[0].uri,
    //         }));
    //     }
    // };
    const userData = {
        ...MOCK_USER_DATA,
        email: user?.email,
        first_name: user?.first_name || MOCK_USER_DATA.first_name,
        last_name: user?.last_name || MOCK_USER_DATA.last_name,
    };

    const handleUpdateField = (field: string, value: unknown) => {
        Alert.alert(
            t("PROFILE.MODIFY"),
            t("PROFILE.MODIFY_FIELD", { field, value: value?.toString() }),
            [
                { text: t("COMMON.CANCEL"), style: "cancel" },
                { text: t("PROFILE.MODIFY"), onPress: () => {} },
            ],
        );
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
        value: UserHealthAttributions[keyof UserHealthAttributions] | null;
        onPress: () => void;
    }[] = [
        {
            icon: "calendar-outline",
            title: t("PROFILE.HEALTH_ITEMS.AGE"),
            value: userData?.health?.age || null,
            onPress: () =>
                handleUpdateField(
                    t("PROFILE.HEALTH_ITEMS.AGE"),
                    userData?.health?.age || null,
                ),
        },
        {
            icon: "person-outline",
            title: t("PROFILE.HEALTH_ITEMS.GENDER"),
            value: userData?.health?.gender || null,
            onPress: () =>
                handleUpdateField(
                    t("PROFILE.HEALTH_ITEMS.GENDER"),
                    userData?.health?.gender || null,
                ),
        },
        {
            icon: "scale-outline",
            title: t("PROFILE.HEALTH_ITEMS.WEIGHT"),
            value: `${userData?.health?.weight || ""} ${userData?.health?.weight_unit || ""}`,
            onPress: () =>
                handleUpdateField(
                    t("PROFILE.HEALTH_ITEMS.WEIGHT"),
                    userData?.health?.weight || 0,
                ),
        },
        {
            icon: "resize-outline",
            title: t("PROFILE.HEALTH_ITEMS.HEIGHT"),
            value: `${userData?.health?.height || ""} ${userData?.health?.height_unit || ""}`,
            onPress: () =>
                handleUpdateField(
                    t("PROFILE.HEALTH_ITEMS.HEIGHT"),
                    userData?.health?.height || 0,
                ),
        },
        {
            icon: "wine-outline",
            title: t("PROFILE.HEALTH_ITEMS.ALCOHOL"),
            value: userData?.health?.alcohol || null,
            onPress: () =>
                handleUpdateField(
                    t("PROFILE.HEALTH_ITEMS.ALCOHOL"),
                    userData?.health?.alcohol || null,
                ),
        },
        {
            icon: "ban-outline",
            title: t("PROFILE.HEALTH_ITEMS.SMOKING"),
            value: userData?.health?.smoking || null,
            onPress: () =>
                handleUpdateField(
                    t("PROFILE.HEALTH_ITEMS.SMOKING"),
                    userData?.health?.smoking || null,
                ),
        },
        {
            icon: "medical-outline",
            title: t("PROFILE.HEALTH_ITEMS.PROFESSIONAL_HELP"),
            value: userData?.health?.professional_help || null,
            onPress: () =>
                handleUpdateField(
                    t("PROFILE.HEALTH_ITEMS.PROFESSIONAL_HELP"),
                    userData?.health?.professional_help || null,
                ),
        },
        {
            icon: "heart-outline",
            title: t("PROFILE.HEALTH_ITEMS.CHRONIC_ILLNESS"),
            value: userData?.health?.chronic_illness || null,
            onPress: () =>
                handleUpdateField(
                    t("PROFILE.HEALTH_ITEMS.CHRONIC_ILLNESS"),
                    userData?.health?.chronic_illness || null,
                ),
        },
        {
            icon: "medical-outline",
            title: t("PROFILE.HEALTH_ITEMS.MEDICATION_TREATMENT"),
            value: userData?.health?.medication_treatment || null,
            onPress: () =>
                handleUpdateField(
                    t("PROFILE.HEALTH_ITEMS.MEDICATION_TREATMENT"),
                    userData?.health?.medication_treatment || null,
                ),
        },
        {
            icon: "leaf-outline",
            title: t("PROFILE.HEALTH_ITEMS.ALLERGIES"),
            value: userData?.health?.allergies || null,
            onPress: () =>
                handleUpdateField(
                    t("PROFILE.HEALTH_ITEMS.ALLERGIES"),
                    userData?.health?.allergies || null,
                ),
        },
        {
            icon: "barbell-outline",
            title: t("PROFILE.HEALTH_ITEMS.SPORTS"),
            value: userData?.health?.practice_sports || null,
            onPress: () =>
                handleUpdateField(
                    t("PROFILE.HEALTH_ITEMS.SPORTS"),
                    userData?.health?.practice_sports || null,
                ),
        },
        {
            icon: "cut-outline",
            title: t("PROFILE.HEALTH_ITEMS.PREVIOUS_SURGERY"),
            value: userData?.health?.surgery_before || null,
            onPress: () =>
                handleUpdateField(
                    t("PROFILE.HEALTH_ITEMS.PREVIOUS_SURGERY"),
                    userData?.health?.surgery_before || null,
                ),
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
                        source={{ uri: userData?.avatar }}
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
                    {userData?.first_name} {userData?.last_name}
                </Text>
                <Text style={[styles.userEmail]}>{userData.email}</Text>
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
