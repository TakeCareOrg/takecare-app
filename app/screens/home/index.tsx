import { useTranslation } from "react-i18next";
import { useWindowDimensions } from "react-native";
import Animated, {
    useAnimatedRef,
    useAnimatedScrollHandler,
    useSharedValue,
} from "react-native-reanimated";

import { PageContainer } from "@layouts/page-container";

import { DraggableGrid } from "./dnd/DraggableGrid";

export function HomeScreen() {
    const { t } = useTranslation("full_trads");
    const { width } = useWindowDimensions();

    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollY = useSharedValue(0);

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
        </PageContainer>
    );
}
