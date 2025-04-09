import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "react-i18next";
import {
    Alert,
    Linking,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import ImagePicker, { Image } from "react-native-image-crop-picker";
import {
    check,
    Permission,
    PERMISSIONS,
    request,
    RESULTS,
} from "react-native-permissions";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AllergiesIcon } from "../../../assets/icons/profile/AllergiesIcon";
import { CalendarIcon } from "../../../assets/icons/profile/CalendarIcon";
import { CigarreteIcon } from "../../../assets/icons/profile/CigarreteIcon";
import { GenderIcon } from "../../../assets/icons/profile/GenderIcon";
import { HeartIcon } from "../../../assets/icons/profile/HeartIcon";
import { MedicalCaseIcon } from "../../../assets/icons/profile/MedicalCaseIcon";
import { PillsIcon } from "../../../assets/icons/profile/PillsIcon";
import { RuleIcon } from "../../../assets/icons/profile/RuleIcon";
import { ScaleIcon } from "../../../assets/icons/profile/ScaleIcon";
import { SurgeryIcon } from "../../../assets/icons/profile/SurgeryIcon";
import { WeightsIcon } from "../../../assets/icons/profile/WeightsIcon";
import { WineGlaceIcon } from "../../../assets/icons/profile/WineGlaceIcon";
import { useAuth } from "../../contexts/auth-context";
import { useColors } from "../../styles/Colors";
import { TextComponent } from "../../ui/text-component";
import { textUtils } from "../../utils/text-utils";
import NavBar from "./components/navbar";
import { RootStackParamList } from "../../types/router.types";

interface ContainerProps {
    children: React.ReactNode;
    title?: string;
}

const Container = ({ children, title }: ContainerProps) => {
    const { main } = useColors();

    return (
        <View
            style={{
                ...styles.dataContainer,
                backgroundColor: main.container,
            }}
        >
            {title && (
                <TextComponent style={{ marginBottom: 16 }} color={main.grey}>
                    {title}
                </TextComponent>
            )}
            {children}
        </View>
    );
};

interface ItemProps {
    icon: React.ReactNode;
    title: string;
    onPress: () => void;
    color?: string;
    value?: string | number | boolean;
    textColor?: string;
}

const Item = ({ icon, title, onPress, color, value, textColor }: ItemProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 4,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    columnGap: 8,
                }}
            >
                <View style={{ minWidth: 15, alignItems: "center" }}>
                    {icon}
                </View>
                <TextComponent
                    textWeight="bold"
                    style={{ color: color ?? textColor }}
                >
                    {title}
                </TextComponent>
            </View>

            {value ? (
                <TextComponent
                    textWeight="bold"
                    style={{ color: color ?? textColor }}
                >
                    {value}
                </TextComponent>
            ) : (
                <Feather
                    name="chevron-right"
                    size={16}
                    color={color ?? textColor}
                />
            )}
        </TouchableOpacity>
    );
};

export const ProfileScreen = () => {
    // States
    const { main } = useColors();
    const { user, updateUserData, signOut } = useAuth();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { t } = useTranslation();

    const generalContainer = [
        {
            icon: <Feather name="user" size={16} color={main.primary} />,
            title: "Profile Details",
            onPress: () => {},
        },
        {
            icon: <Feather name="lock" size={16} color={main.primary} />,
            title: "Login and security",
            onPress: () => {},
        },
        {
            icon: <Feather name="bell" size={16} color={main.primary} />,
            title: "Notifications",
            onPress: () => {},
        },
        {
            icon: (
                <Ionicons name="watch-outline" size={16} color={main.primary} />
            ),
            title: "Manage devices connections",
            onPress: () => {},
        },
    ];

    const healthDataContainer = [
        {
            icon: <CalendarIcon />,
            title: t("PROFILE.UPDATE_USER.AGE"),
            value: user?.health?.age ?? undefined,
            key: "age",
        },
        {
            icon: <GenderIcon />,
            title: t("PROFILE.UPDATE_USER.GENDER"),
            value:
                textUtils.capitalize(user?.health?.gender || "") ?? undefined,
            key: "gender",
        },
        {
            icon: <ScaleIcon />,
            title: t("PROFILE.UPDATE_USER.WEIGHT"),
            value: `${user?.health?.weight?.toFixed(0)} ${
                user?.health?.weight_unit
            }`,
            key: "weight",
        },
        {
            icon: <RuleIcon />,
            title: t("PROFILE.UPDATE_USER.HEIGHT"),
            value: `${user?.health?.height?.toFixed(0)} ${
                user?.health?.height_unit
            }`,
            key: "height",
        },
        {
            icon: <WineGlaceIcon />,
            title: t("PROFILE.UPDATE_USER.ALCOHOL"),
            value:
                textUtils.capitalize(user?.health?.alcohol || "") ?? undefined,
            key: "alcohol",
        },
        {
            icon: <CigarreteIcon />,
            title: t("PROFILE.UPDATE_USER.SMOKING"),
            value:
                textUtils.capitalize(user?.health?.smoking || "") ?? undefined,
            key: "smoking",
        },
        {
            icon: <MedicalCaseIcon />,
            // title: "Professionnal Help",
            title: t("PROFILE.UPDATE_USER.PROFESSIONAL_HELP"),
            key: "professional_help",
        },
        {
            icon: <HeartIcon />,
            title: t("PROFILE.UPDATE_USER.CHRONIC_ILLNESS"),
            key: "chronic_illness",
        },
        {
            icon: <PillsIcon />,
            title: t("PROFILE.UPDATE_USER.MEDICATION_TREATMENT"),
            key: "medication_treatment",
        },
        {
            icon: <AllergiesIcon />,
            title: t("PROFILE.UPDATE_USER.ALLERGIES"),
            key: "allergies",
        },
        {
            icon: <WeightsIcon />,
            title: t("PROFILE.UPDATE_USER.PRACTICE_SPORTS"),
            key: "practice_sports",
        },
        {
            icon: <SurgeryIcon color={main.primary} />,
            title: t("PROFILE.UPDATE_USER.SURGERY_BEFORE"),
            key: "surgery_before",
        },
    ];

    const supportContainer = [
        {
            icon: <Feather name="help-circle" size={16} color={main.primary} />,
            title: "FAQs",
            onPress: () => {},
        },
        {
            icon: <Feather name="info" size={16} color={main.primary} />,
            title: "Support",
            onPress: () => {},
        },
        {
            icon: <Feather name="log-out" size={16} color={main.red} />,
            title: "Log Out",
            onPress: () => signOut(),
            color: main.red,
        },
    ];

    const requestPermission = async () => {
        const permission: Permission = Platform.select({
            android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
            ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
        })!;

        try {
            const result = await check(permission);
            if (result === RESULTS.GRANTED) {
                return true;
            } else {
                const newResult = await request(permission);
                return newResult === RESULTS.GRANTED;
            }
        } catch (error) {
            console.error("Permission request error: ", error);
            return false;
        }
    };

    const openImagePicker = async () => {
        const hasPermission = await requestPermission();
        if (hasPermission) {
            ImagePicker.openPicker({
                width: 400,
                height: 400,
                cropping: true,
                includeBase64: true,
            })
                .then((image: Image) => {
                    updateUserData({
                        avatar: { base64: image.data, mime: image.mime },
                    });
                })
                .catch((error) => {
                    console.log("Image picker error: ", error);
                });
        } else {
            Alert.alert(
                "Permission Required",
                "Please grant gallery access to pick images.",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Open Settings",
                        onPress: () => Linking.openSettings(),
                    },
                ],
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ padding: 16 }}>
                <NavBar title="My Profile" onAvatarPress={openImagePicker} />

                <ScrollView
                    contentContainerStyle={{ rowGap: 32, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                >
                    <Container title="Profile">
                        {generalContainer.map((item, index) => (
                            <Item
                                key={index}
                                {...item}
                                onPress={() => item.onPress()}
                                textColor={main.primary}
                            />
                        ))}
                    </Container>
                    <Container title="Settings">
                        {healthDataContainer.map((item, index) => {
                            const { key: itemKey, ...rest } = item;
                            return (
                                <Item
                                    key={index}
                                    {...rest}
                                    onPress={() =>
                                        navigation.navigate(
                                            "UpdateUserScreen",
                                            {
                                                dataKey: itemKey,
                                            },
                                        )
                                    }
                                    textColor={main.primary}
                                />
                            );
                        })}
                    </Container>
                    <Container>
                        {supportContainer.map((item, index) => (
                            <Item
                                key={index}
                                {...item}
                                onPress={() => item.onPress()}
                                textColor={main.primary}
                            />
                        ))}
                    </Container>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    dataContainer: {
        padding: 16,
        borderRadius: 8,
    },
});
