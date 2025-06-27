import React from "react";
import { Platform, SafeAreaView, ScrollView, View } from "react-native";

import { useColorTheme } from "@hooks/use-color-theme";
import { useResponsive } from "@hooks/use-reponsive";

import { useUserStore } from "@app/stores/users";
import { useTranslation } from "react-i18next";

import { NavBar } from "./navbar";

type PageContainerProps = {
    children: React.ReactNode;
    showNavBar?: boolean;
    scrollEnabled?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export function PageContainer({
    children,
    showNavBar = true,
    scrollEnabled = true,
}: PageContainerProps) {
    const { t } = useTranslation("full_trads");
    const colors = useColorTheme();
    const resposivePadding = useResponsive({
        smallScreenValue: 12,
        largeScreenValue: 16,
        threshold: 700,
    });

    const user = useUserStore((state) => state.user);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <View
                style={{
                    flex: 1,
                    paddingHorizontal: resposivePadding,
                    backgroundColor: colors.background,
                }}
                pointerEvents="box-none"
            >
                {showNavBar && (
                    <NavBar
                        title={t("COMMON.NAVBAR_TITLE", {
                            name: user?.first_name,
                        })}
                    />
                )}

                {scrollEnabled ? (
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            flexGrow: 1,
                            paddingBottom: showNavBar ? 80 : 0, // Adjust bottom padding if NavBar is shown
                        }}
                    >
                        {children}
                    </ScrollView>
                ) : (
                    <View
                        style={{
                            flexGrow: 1,
                            paddingBottom: showNavBar ? 80 : 0, // Adjust bottom padding if NavBar is shown
                        }}
                    >
                        {children}
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}
