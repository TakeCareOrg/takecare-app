import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Platform, useWindowDimensions } from "react-native";
import Animated, {
    useAnimatedRef,
    useAnimatedScrollHandler,
    useSharedValue,
} from "react-native-reanimated";

import { useHealthPermissionStatus } from "@app/hooks/use-health-permission-status";
import { syncHealthData } from "@app/services/health-sync";
import { useUiSessionStore } from "@app/stores/ui-session";
import { PageContainer } from "@layouts/page-container";

import { HealthOnboardingModal } from "./components/health-onboarding-modal";
import { DraggableGrid } from "./dnd/DraggableGrid";

export function HomeScreen() {
    const { t } = useTranslation("full_trads");
    const { width } = useWindowDimensions();

    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollY = useSharedValue(0);

    const { status } = useHealthPermissionStatus();
    const dismissed = useUiSessionStore((s) => s.healthOnboardingDismissed);

    // Trigger an immediate re-sync when permissions transition from
    // "missing" to "granted" — typically the user just came back from
    // Health Connect's permission screen. Without this nudge the user
    // would wait up to 60 s for the next poll tick.
    const previousStatus = useRef(status);
    useEffect(() => {
        if (previousStatus.current === "missing" && status === "granted") {
            syncHealthData();
        }
        previousStatus.current = status;
    }, [status]);

    const shouldShowModal =
        Platform.OS === "android" && status === "missing" && !dismissed;

    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    return (
        <PageContainer
            variant="home"
            title={t("COMMON.NAVBAR_TITLE")}
            scrollRef={scrollRef}
            onScroll={scrollHandler}
        >
            <DraggableGrid
                screenWidth={width}
                scrollRef={scrollRef}
                scrollY={scrollY}
            />
            <HealthOnboardingModal visible={shouldShowModal} />
        </PageContainer>
    );
}
