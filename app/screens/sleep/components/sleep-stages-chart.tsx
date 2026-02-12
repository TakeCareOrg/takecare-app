import { format } from "date-fns";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { Box } from "@app/components/ui/box";
import {
    StagesChart,
    type StagesChartData,
} from "@app/components/ui/chart/stages-chart";
import { Text } from "@app/components/ui/text";
import { useColorTheme } from "@app/hooks/use-color-theme";
import { SleepAnalysis, SleepStage } from "@app/types/health-data-types";

interface SleepStagesChartProps {
    sleepData: SleepAnalysis;
}

const STAGE_COLORS: Record<SleepStage["type"], string> = {
    unknown: "#666666",
    awake: "#FF6B35",
    sleeping: "#4A90E2",
    out_of_bed: "#FF9500",
    light: "#6B8CFF",
    deep: "#1E40AF",
    rem: "#B4A7D6",
};

const STAGE_LABELS: Record<SleepStage["type"], string> = {
    unknown: "Unknown",
    awake: "Awake",
    sleeping: "Sleeping",
    out_of_bed: "Out of Bed",
    light: "Light",
    deep: "Deep",
    rem: "REM",
};

const STAGE_VERTICAL_POSITION: Record<SleepStage["type"], number> = {
    deep: 0.05,
    light: 0.25,
    rem: 0.45,
    sleeping: 0.35,
    awake: 0.8,
    out_of_bed: 0.9,
    unknown: 0.5,
};

// Average ranges for 21-25 years old
const STAGE_AVERAGE_RANGES: Record<SleepStage["type"], string> = {
    unknown: "N/A",
    awake: "20-40min",
    sleeping: "6h-8h",
    out_of_bed: "5-15min",
    light: "3h00-3h45",
    deep: "40-50min",
    rem: "1h20-2h00",
};

const CHART_HEIGHT = 200;

export const SleepStagesChart: React.FC<SleepStagesChartProps> = ({
    sleepData,
}) => {
    const colors = useColorTheme();

    const { chartData, timeLabels, stats } = useMemo(() => {
        if (!sleepData || !sleepData.duration) {
            return {
                chartData: null,
                timeLabels: [],
                stats: [],
            };
        }

        const startTime = new Date(sleepData.startDate);
        const totalDuration = sleepData.duration;

        // Prepare chart data
        const data: StagesChartData = {
            startDate: sleepData.startDate,
            endDate: sleepData.endDate,
            duration: sleepData.duration,
            stages:
                sleepData.stages && sleepData.stages.length > 0
                    ? sleepData.stages
                    : [],
        };

        // Create time labels
        const labels: string[] = [];
        const labelCount = 5;
        for (let i = 0; i < labelCount; i++) {
            const time = new Date(
                startTime.getTime() +
                    (totalDuration * 1000 * i) / (labelCount - 1),
            );
            labels.push(format(time, "H:mm"));
        }

        // Calculate statistics
        const stageStats: Record<SleepStage["type"], number> = {
            unknown: 0,
            awake: 0,
            sleeping: 0,
            out_of_bed: 0,
            rem: 0,
            light: 0,
            deep: 0,
        };

        const stages =
            sleepData.stages && sleepData.stages.length > 0
                ? sleepData.stages
                : [];

        stages.forEach((stage) => {
            stageStats[stage.type] += stage.duration;
        });

        const statsWithPercentage = Object.entries(stageStats)
            .filter(([_, duration]) => duration > 0)
            .map(([type, duration]) => ({
                type: type as SleepStage["type"],
                duration,
                percentage: Math.round((duration / totalDuration) * 100),
            }));

        return {
            chartData: data,
            timeLabels: labels,
            stats: statsWithPercentage,
        };
    }, [sleepData]);

    if (!sleepData || !sleepData.duration) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No sleep data available</Text>
            </View>
        );
    }

    const totalDuration = sleepData.duration;
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);

    // If no stages available (watch not worn), show a message
    const hasStages =
        sleepData.stages && sleepData.stages.length > 0 && stats.length > 0;

    // Calculate actual sleep time (excluding awake and out_of_bed)
    const actualSleepTime = hasStages
        ? (() => {
              const totalSeconds = stats
                  .filter((s) => s.type !== "awake" && s.type !== "out_of_bed")
                  .reduce((sum, s) => sum + s.duration, 0);
              const sleepHours = Math.floor(totalSeconds / 3600);
              const sleepMinutes = Math.floor((totalSeconds % 3600) / 60);
              return `${sleepHours}h${sleepMinutes}min`;
          })()
        : "N/A";

    const formatedTodayDate = format(
        new Date(sleepData.startDate),
        "EEEE dd MMMM",
    );
    return (
        <Box title={formatedTodayDate} style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.durationContainer}>
                    <Text weight="700" fontSize={16}>
                        {hours}h{minutes}min
                    </Text>
                    <View style={styles.durationInformation}>
                        <Text fontSize={10} color={colors.secondary}>
                            Time in bed{" "}
                        </Text>
                        <Text fontSize={10} color={colors.secondary}>
                            {format(new Date(sleepData.startDate), "HH:mm")} -{" "}
                            {format(new Date(sleepData.endDate), "HH:mm")}
                        </Text>
                    </View>
                    <View style={styles.durationInformation}>
                        <Text fontSize={10} color={colors.secondary}>
                            Actual sleep time{" "}
                        </Text>
                        <Text fontSize={10} color={colors.secondary}>
                            {actualSleepTime}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Chart */}
            {hasStages && chartData ? (
                <>
                    <StagesChart
                        data={chartData}
                        stageColors={STAGE_COLORS}
                        stageVerticalPositions={STAGE_VERTICAL_POSITION}
                        timeLabels={timeLabels}
                        chartHeight={CHART_HEIGHT}
                    />

                    {/* Sleep stages legend */}
                    <View style={styles.legendContainer}>
                        <View style={styles.legendHeader}>
                            <Text
                                style={styles.legendTitle}
                                weight="700"
                                color={colors.secondary}
                            >
                                Sleep stages
                            </Text>
                            <Text
                                style={styles.legendAverageTitle}
                                weight="700"
                                color={colors.secondary}
                            >
                                Average 21-25 years old range
                            </Text>
                        </View>
                        {stats.map((stat) => (
                            <View key={stat.type} style={styles.legendItem}>
                                <View style={styles.legendLeftSection}>
                                    <View
                                        style={[
                                            styles.legendBarFill,
                                            {
                                                width: `${stat.percentage}%`,
                                                backgroundColor:
                                                    STAGE_COLORS[stat.type],
                                            },
                                        ]}
                                    >
                                        <Text
                                            weight="700"
                                            style={{
                                                textShadowColor: colors.black,
                                                textShadowOffset: {
                                                    width: 0,
                                                    height: 0,
                                                },
                                                textShadowRadius: 4,
                                            }}
                                        >
                                            {stat.percentage}%
                                        </Text>
                                    </View>
                                    <View style={styles.legendInfo}>
                                        <Text
                                            style={styles.legendLabel}
                                            weight="700"
                                        >
                                            {STAGE_LABELS[stat.type]}
                                        </Text>
                                        <Text
                                            style={styles.legendValue}
                                            weight="700"
                                        >
                                            {Math.floor(stat.duration / 60)}min
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.legendAverageValue}>
                                    {STAGE_AVERAGE_RANGES[stat.type]}
                                </Text>
                            </View>
                        ))}
                    </View>
                </>
            ) : (
                <View style={styles.emptyChartContainer}>
                    <Text style={styles.emptyText}>
                        No detailed sleep stages available
                    </Text>
                    <Text
                        style={[
                            styles.emptyText,
                            { fontSize: 14, marginTop: 8 },
                        ]}
                    >
                        Sleep stages require wearing your watch during sleep
                    </Text>
                </View>
            )}
        </Box>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
    emptyContainer: {
        padding: 40,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1A1A1A",
        borderRadius: 16,
        marginTop: 20,
    },
    emptyChartContainer: {
        padding: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyText: {
        color: "#666",
        fontSize: 16,
    },
    header: {
        marginBottom: 24,
    },
    date: {
        color: "#FFF",
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 8,
    },
    durationContainer: {
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        position: "absolute",
        right: 0,
        top: -30,
    },
    durationInformation: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 4,
        alignItems: "center",
    },
    legendContainer: {
        gap: 15,
    },
    legendHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    legendTitle: {
        color: "#888",
        fontSize: 14,
    },
    legendAverageTitle: {
        color: "#888",
        fontSize: 14,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    legendLeftSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flex: 1,
    },
    legendBarFill: {
        height: 22,
        justifyContent: "center",
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 4,
        minWidth: 60,
    },
    legendInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    legendLabel: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "500",
    },
    legendValue: {
        color: "#FFF",
        fontSize: 14,
        fontWeight: "600",
    },
    legendAverageValue: {
        color: "#888",
        fontSize: 14,
        minWidth: 80,
        textAlign: "right",
    },
});
