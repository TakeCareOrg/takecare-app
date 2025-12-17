import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Animated,
    Easing,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
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
                    user?.first_name
                        ? t("COMMON.NAVBAR_TITLE", {
                              name: user?.first_name,
                          })
                        : title
                }
            />
        );
    }

    return (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
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
                            style={styles.menuButton}
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
                                        styles.popup,
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
                                                    styles.menuItem,
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
                ...styles.container,
                backgroundColor: colors.background,
            }}
            edges={["top", "bottom"]}
        >
            <View
                style={{
                    ...styles.contentWrapper,
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
                        contentContainerStyle={styles.scrollContent}
                    >
                        {children}
                    </ScrollView>
                ) : (
                    <View style={styles.staticContent}>{children}</View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentWrapper: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 15,
        marginBottom: 15,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    backButton: {
        marginRight: 15,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 80,
    },
    staticContent: {
        flexGrow: 1,
        paddingBottom: 80,
    },
    menuButton: {
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    popup: {
        position: "absolute",
        borderRadius: 10,
        top: 60,
        right: 15,
        borderWidth: 1,
    },
    menuItem: {
        minWidth: 150,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
});
