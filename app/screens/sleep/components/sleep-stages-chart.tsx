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
                            {hasStages
                                ? Math.round(
                                      (stats
                                          .filter(
                                              (s) =>
                                                  s.type !== "awake" &&
                                                  s.type !== "out_of_bed",
                                          )
                                          .reduce(
                                              (sum, s) => sum + s.duration,
                                              0,
                                          ) /
                                          3600) *
                                          10,
                                  ) / 10
                                : "N/A"}
                            h
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
                        <Text style={styles.legendTitle}>Sleep stages</Text>
                        {stats.map((stat) => (
                            <View key={stat.type} style={styles.legendItem}>
                                <View style={styles.legendRow}>
                                    <View
                                        style={[
                                            styles.legendIndicator,
                                            {
                                                backgroundColor:
                                                    STAGE_COLORS[stat.type],
                                            },
                                        ]}
                                    />
                                    <Text style={styles.legendLabel}>
                                        {STAGE_LABELS[stat.type]}
                                    </Text>
                                    <Text style={styles.legendValue}>
                                        {Math.floor(stat.duration / 60)}min
                                    </Text>
                                </View>
                                <View style={styles.legendBar}>
                                    <View
                                        style={[
                                            styles.legendBarFill,
                                            {
                                                width: `${stat.percentage}%`,
                                                backgroundColor:
                                                    STAGE_COLORS[stat.type],
                                            },
                                        ]}
                                    />
                                    <Text style={styles.legendPercentage}>
                                        {stat.percentage}%
                                    </Text>
                                </View>
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
        gap: 12,
    },
    legendTitle: {
        color: "#888",
        fontSize: 14,
        marginBottom: 4,
    },
    legendItem: {
        gap: 8,
    },
    legendRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    legendIndicator: {
        width: 12,
        height: 12,
        borderRadius: 3,
    },
    legendLabel: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "500",
        flex: 1,
    },
    legendValue: {
        color: "#888",
        fontSize: 14,
    },
    legendBar: {
        flexDirection: "row",
        alignItems: "center",
        height: 24,
        backgroundColor: "#0A0A0A",
        borderRadius: 4,
        overflow: "hidden",
    },
    legendBarFill: {
        height: "100%",
    },
    legendPercentage: {
        color: "#FFF",
        fontSize: 12,
        fontWeight: "600",
        position: "absolute",
        left: 8,
    },
});
