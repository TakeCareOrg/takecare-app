import { format } from "date-fns";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

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

export const SleepStagesChart: React.FC<SleepStagesChartProps> = ({
    sleepData,
}) => {
    const { chartData, stats, timeLabels } = useMemo(() => {
        if (!sleepData || !sleepData.duration) {
            return { chartData: [], stats: {}, timeLabels: [] };
        }

        const startTime = new Date(sleepData.startDate);
        const totalDuration = sleepData.duration;

        // Use stages from sleepData if available, otherwise create a simple session
        const processedStages: SleepStage[] =
            sleepData.stages && sleepData.stages.length > 0
                ? sleepData.stages
                : [
                      {
                          type: "light",
                          startTime: sleepData.startDate,
                          endTime: sleepData.endDate,
                          duration: totalDuration,
                      },
                  ];

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

        processedStages.forEach((stage) => {
            stageStats[stage.type] += stage.duration;
        });

        const statsWithPercentage = Object.entries(stageStats)
            .filter(([_, duration]) => duration > 0) // Only show stages with duration
            .map(([type, duration]) => ({
                type: type as SleepStage["type"],
                duration,
                percentage: Math.round((duration / totalDuration) * 100),
            }));

        // Create time labels (every 2 hours)
        const labels: string[] = [];
        const labelCount = 4;
        for (let i = 0; i <= labelCount; i++) {
            const time = new Date(
                startTime.getTime() + (totalDuration * 1000 * i) / labelCount,
            );
            labels.push(format(time, "H:mm"));
        }

        return {
            chartData: processedStages,
            stats: statsWithPercentage,
            timeLabels: labels,
        };
    }, [sleepData]);

    if (!sleepData || !sleepData.duration) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No sleep data available</Text>
            </View>
        );
    }

    // If no stages available (watch not worn), show a message
    if (!chartData || chartData.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.date}>
                        {format(new Date(sleepData.startDate), "EEEE dd MMMM")}
                    </Text>
                    <View style={styles.durationContainer}>
                        <Text style={styles.duration}>
                            {hours}h{minutes}min
                        </Text>
                        <Text style={styles.timeRange}>
                            {format(new Date(sleepData.startDate), "HH:mm")} -{" "}
                            {format(new Date(sleepData.endDate), "HH:mm")}
                        </Text>
                    </View>
                </View>
                <View style={styles.emptyContainer}>
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
            </View>
        );
    }

    const totalDuration = sleepData.duration;
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.date}>
                    {format(new Date(sleepData.startDate), "EEEE dd MMMM")}
                </Text>
                <View style={styles.durationContainer}>
                    <Text style={styles.duration}>
                        {hours}h{minutes}min
                    </Text>
                    <Text style={styles.timeRange}>
                        {format(new Date(sleepData.startDate), "HH:mm")} -{" "}
                        {format(new Date(sleepData.endDate), "HH:mm")}
                    </Text>
                </View>
            </View>

            {/* Chart */}
            <View style={styles.chartContainer}>
                <View style={styles.chart}>
                    {chartData.map((stage, index) => {
                        const widthPercentage =
                            (stage.duration / totalDuration) * 100;
                        return (
                            <View
                                key={`${stage.type}-${index}`}
                                style={[
                                    styles.stageBar,
                                    {
                                        width: `${widthPercentage}%`,
                                        backgroundColor:
                                            STAGE_COLORS[stage.type],
                                    },
                                ]}
                            />
                        );
                    })}
                </View>

                {/* Time labels */}
                <View style={styles.timeLabelsContainer}>
                    {timeLabels.map((label, index) => (
                        <Text key={index} style={styles.timeLabel}>
                            {label}
                        </Text>
                    ))}
                </View>
            </View>

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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1A1A1A",
        borderRadius: 16,
        padding: 20,
    },
    emptyContainer: {
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
        flexDirection: "row",
        alignItems: "baseline",
        gap: 8,
    },
    duration: {
        color: "#FFF",
        fontSize: 32,
        fontWeight: "700",
    },
    timeRange: {
        color: "#888",
        fontSize: 14,
    },
    chartContainer: {
        marginBottom: 32,
    },
    chart: {
        flexDirection: "row",
        height: 200,
        backgroundColor: "#0A0A0A",
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 8,
    },
    stageBar: {
        height: "100%",
    },
    timeLabelsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 4,
    },
    timeLabel: {
        color: "#666",
        fontSize: 12,
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
