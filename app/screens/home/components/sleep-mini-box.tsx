import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
    DimensionValue,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";

import {
    StagesChart,
    type StagesChartData,
} from "@app/components/ui/chart/stages-chart";
import { Chip } from "@app/components/ui/chip";
import { Text } from "@app/components/ui/text";
import { useColorTheme } from "@app/hooks/use-color-theme";
import { SleepAnalysis } from "@app/types/health-data-types";
import { Box } from "@components/ui/box";

import {
    getStageColors,
    STAGE_VERTICAL_POSITION,
} from "../../sleep/utils/sleep-stage-config";

const CHART_HEIGHT = 80;
const RECT_HEIGHT = 10;
const LABEL_COUNT = 5;

export function SleepMiniBox({
    sleep,
    width,
    height,
    style,
}: {
    sleep: SleepAnalysis | null;
    width?: DimensionValue;
    height?: DimensionValue;
    style?: StyleProp<ViewStyle>;
}) {
    const { t } = useTranslation("full_trads");
    const navigation = useNavigation();
    const colors = useColorTheme();
    const stageColors = useMemo(() => getStageColors(colors), [colors]);

    const formattedDate = useMemo(() => {
        if (!sleep?.startDate) return t("HOME_PAGE.SLEEP");
        return format(new Date(sleep.startDate), "EEEE dd MMMM");
    }, [sleep, t]);

    const duration = useMemo(() => {
        if (!sleep?.duration) return null;
        const hours = Math.floor(sleep.duration / 3600);
        const minutes = Math.floor((sleep.duration % 3600) / 60);
        return `${hours}h${minutes.toString().padStart(2, "0")}min`;
    }, [sleep]);

    const { chartData, timeLabels } = useMemo(() => {
        if (!sleep?.duration || !sleep.startDate || !sleep.endDate) {
            return { chartData: null, timeLabels: [] as string[] };
        }
        const startTime = new Date(sleep.startDate);
        const labels: string[] = [];
        for (let i = 0; i < LABEL_COUNT; i++) {
            const time = new Date(
                startTime.getTime() +
                    (sleep.duration * 1000 * i) / (LABEL_COUNT - 1),
            );
            labels.push(format(time, "H:mm"));
        }
        const data: StagesChartData = {
            startDate: sleep.startDate,
            endDate: sleep.endDate,
            duration: sleep.duration,
            stages: sleep.stages ?? [],
        };
        return { chartData: data, timeLabels: labels };
    }, [sleep]);

    const hasStages = Boolean(
        chartData && sleep?.stages && sleep.stages.length > 0,
    );

    return (
        <Box
            title={formattedDate}
            width={width}
            height={typeof height === "number" ? height : undefined}
            headerContent={
                duration ? <Chip text={duration} color="blue" /> : undefined
            }
            style={style}
            onPress={() => {
                navigation.navigate("Sleep");
            }}
        >
            {hasStages && chartData ? (
                <StagesChart
                    data={chartData}
                    stageColors={stageColors}
                    stageVerticalPositions={STAGE_VERTICAL_POSITION}
                    timeLabels={timeLabels}
                    chartHeight={CHART_HEIGHT}
                    rectHeight={RECT_HEIGHT}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text fontSize={13} weight="600" color={colors.secondary}>
                        {t("HOME_PAGE.NO_SLEEP_RECORDED")}
                    </Text>
                </View>
            )}
        </Box>
    );
}

const styles = StyleSheet.create({
    emptyContainer: {
        height: CHART_HEIGHT,
        alignItems: "center",
        justifyContent: "center",
    },
});
