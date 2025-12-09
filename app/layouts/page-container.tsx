import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Animated,
    Easing,
    Modal,
    Pressable,
    ScrollView,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BackArrowIcon } from "@app/assets/icons/BackArrowIcon";
import { VerticalsDotsIcon } from "@app/assets/icons/VerticalsDotsIcons";
import { Setting } from "@app/types/settings";
import { useColorTheme } from "@hooks/use-color-theme";
import { useResponsive } from "@hooks/use-reponsive";
import { useUserStore } from "@stores/users";

import { Text } from "../components/ui/text";
import { NavBar } from "./navbar";
import { PageContainerStyles } from "./styles/styles";

type PageContainerProps = {
    children: React.ReactNode;
    scrollEnabled?: boolean;
    variant?: "home" | "details";
    title?: string;
    settings?: Setting[];
};

type HeaderProps = {
    variant: "home" | "details";
    title?: string;
    settings?: Setting[];
    user: ReturnType<typeof useUserStore.getState>["user"];
    colors: ReturnType<typeof useColorTheme>;
    navigation: {
        goBack: () => void;
    };
    menuVisible: boolean;
    setMenuVisible: (visible: boolean) => void;
    pressedIndex: number | null;
    setPressedIndex: (index: number | null) => void;
    scale: Animated.Value;
    toggleMenu: (to: number) => void;
    t: (key: string, options?: Record<string, unknown>) => string;
};

const Header = ({
    variant,
    title,
    settings,
    user,
    colors,
    navigation,
    menuVisible,
    pressedIndex,
    setPressedIndex,
    scale,
    toggleMenu,
    t,
}: HeaderProps) => {
    if (variant === "home") {
        return (
            <NavBar
                title={
                    title ||
                    t("COMMON.NAVBAR_TITLE", {
                        name: user?.first_name,
                    })
                }
            />
        );
    }

    return (
        <View style={PageContainerStyles.header}>
            <View style={PageContainerStyles.headerLeft}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={PageContainerStyles.backButton}
                >
                    <BackArrowIcon />
                </TouchableOpacity>
                {title && (
                    <Text weight="600" fontSize={21}>
                        {title}
                    </Text>
                )}
            </View>
            <View>
                {settings && (
                    <>
                        <TouchableOpacity
                            onPress={() => toggleMenu(1)}
                            style={PageContainerStyles.menuButton}
                        >
                            <VerticalsDotsIcon />
                        </TouchableOpacity>
                        <Modal
                            transparent
                            visible={menuVisible}
                            onRequestClose={() => toggleMenu(0)}
                        >
                            <SafeAreaView
                                style={{ flex: 1 }}
                                onTouchEnd={() => toggleMenu(0)}
                            >
                                <Animated.View
                                    style={[
                                        PageContainerStyles.popup,
                                        {
                                            transform: [{ scale }],
                                            backgroundColor: colors.box,
                                            borderColor: colors.border,
                                        },
                                    ]}
                                >
                                    {settings.map(
                                        (setting: Setting, index: number) => (
                                            <Pressable
                                                key={index}
                                                style={[
                                                    PageContainerStyles.menuItem,
                                                    pressedIndex === index && {
                                                        backgroundColor:
                                                            colors.hover,
                                                    },
                                                ]}
                                                onPress={() => {
                                                    setting.onPress();
                                                    toggleMenu(0);
                                                }}
                                                onPressIn={() =>
                                                    setPressedIndex(index)
                                                }
                                            >
                                                <Text>{setting.label}</Text>
                                            </Pressable>
                                        ),
                                    )}
                                </Animated.View>
                            </SafeAreaView>
                        </Modal>
                    </>
                )}
            </View>
        </View>
    );
};

export function PageContainer({
    children,
    scrollEnabled = true,
    variant = "home",
    title,
    settings,
}: PageContainerProps) {
    const { t } = useTranslation("full_trads");
    const colors = useColorTheme();
    const navigation = useNavigation();

    const responsivePadding = useResponsive({
        smallScreenValue: 12,
        largeScreenValue: 16,
        threshold: 700,
    });

    const user = useUserStore((state) => state.user);

    const [menuVisible, setMenuVisible] = useState(false);
    const [pressedIndex, setPressedIndex] = useState<number | null>(null);
    const scale = useRef(new Animated.Value(0)).current;

    const toggleMenu = (to: number) => {
        to === 1 && setMenuVisible(true);
        Animated.timing(scale, {
            toValue: to,
            duration: 100,
            useNativeDriver: true,
            easing: Easing.linear,
        }).start(() => {
            if (to === 0) {
                setMenuVisible(false);
                setPressedIndex(null);
            }
        });
    };

    return (
        <SafeAreaView
            style={{
                ...PageContainerStyles.container,
                backgroundColor: colors.background,
            }}
            edges={["top", "bottom"]}
        >
            <View
                style={{
                    ...PageContainerStyles.contentWrapper,
                    paddingHorizontal: responsivePadding,
                    backgroundColor: colors.background,
                }}
                pointerEvents="box-none"
            >
                <Header
                    variant={variant}
                    title={title}
                    settings={settings}
                    user={user}
                    colors={colors}
                    navigation={navigation}
                    menuVisible={menuVisible}
                    setMenuVisible={setMenuVisible}
                    pressedIndex={pressedIndex}
                    setPressedIndex={setPressedIndex}
                    scale={scale}
                    toggleMenu={toggleMenu}
                    t={t}
                />

                {scrollEnabled ? (
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={
                            PageContainerStyles.scrollContent
                        }
                    >
                        {children}
                    </ScrollView>
                ) : (
                    <View style={PageContainerStyles.staticContent}>
                        {children}
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}
