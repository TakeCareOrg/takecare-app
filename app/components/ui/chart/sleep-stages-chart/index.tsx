import { format } from "date-fns";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { GridLines } from "@app/components/ui/chart/shared/grid-lines";
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

// Vertical position for each stage type (0 = bottom, 1 = top)
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
    const { stageRectangles, connectionLines, stats, timeLabels, gridLines } =
        useMemo(() => {
            if (!sleepData || !sleepData.duration) {
                return {
                    stageRectangles: [],
                    connectionLines: [],
                    stats: [],
                    timeLabels: [],
                    gridLines: [],
                };
            }

            const startTime = new Date(sleepData.startDate);
            const totalDuration = sleepData.duration;

            // Use stages from sleepData if available
            let stages: SleepStage[] =
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

            // Merge adjacent stages of the same type, even if separated by micro-stages
            const mergedStages: SleepStage[] = [];
            const MICRO_STAGE_THRESHOLD = 1.0; // Stages smaller than 1% are considered micro

            for (let i = 0; i < stages.length; i++) {
                const currentStage = stages[i];

                if (mergedStages.length > 0) {
                    const prevStage = mergedStages[mergedStages.length - 1];

                    // Calculate gap in milliseconds
                    const prevEndTime = new Date(prevStage.endTime).getTime();
                    const currentStartTime = new Date(
                        currentStage.startTime,
                    ).getTime();
                    const gapMs = currentStartTime - prevEndTime;

                    // Check if strictly adjacent (no gap)
                    if (
                        prevStage.type === currentStage.type &&
                        Math.abs(gapMs) < 1000
                    ) {
                        prevStage.endTime = currentStage.endTime;
                        prevStage.duration =
                            (new Date(prevStage.endTime).getTime() -
                                new Date(prevStage.startTime).getTime()) /
                            1000;
                        continue;
                    }

                    // Check if we can merge over a micro-stage
                    // Look at the previous previous stage to see if it's the same type as current
                    if (mergedStages.length >= 2) {
                        const prevPrevStage =
                            mergedStages[mergedStages.length - 2];
                        const prevWidthPercent =
                            (prevStage.duration / totalDuration) * 100;

                        // If the previous stage is a micro-stage and prev-prev has same type as current
                        if (
                            prevWidthPercent < MICRO_STAGE_THRESHOLD &&
                            prevPrevStage.type === currentStage.type
                        ) {
                            // Remove the micro-stage and merge with prev-prev
                            mergedStages.pop(); // Remove micro-stage
                            prevPrevStage.endTime = currentStage.endTime;
                            prevPrevStage.duration =
                                (new Date(prevPrevStage.endTime).getTime() -
                                    new Date(
                                        prevPrevStage.startTime,
                                    ).getTime()) /
                                1000;
                            continue;
                        }
                    }
                }

                // Add as new stage
                mergedStages.push({ ...currentStage });
            }

            stages = mergedStages;

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

            // Create rectangles for each stage
            const rectangles = stages.map((stage, index) => {
                const stageStartSeconds =
                    (new Date(stage.startTime).getTime() -
                        startTime.getTime()) /
                    1000;

                // Calculate horizontal position and width (as percentages)
                const leftPercent = (stageStartSeconds / totalDuration) * 100;
                const widthPercent = (stage.duration / totalDuration) * 100;

                // Get vertical position based on stage type
                const verticalPosition = STAGE_VERTICAL_POSITION[stage.type];

                // Determine which corners should have radius based on adjacent stages
                const prevStage = index > 0 ? stages[index - 1] : null;
                const nextStage =
                    index < stages.length - 1 ? stages[index + 1] : null;

                const prevPosition = prevStage
                    ? STAGE_VERTICAL_POSITION[prevStage.type]
                    : null;

                const nextPosition = nextStage
                    ? STAGE_VERTICAL_POSITION[nextStage.type]
                    : null;

                // Determine radius for each corner independently
                // TopLeft: no prev OR current is higher than prev
                const radiusTopLeft =
                    !prevPosition || verticalPosition > prevPosition;

                // BottomLeft: no prev OR current is lower than prev
                const radiusBottomLeft =
                    !prevPosition || verticalPosition < prevPosition;

                // TopRight: no next OR current is higher than next
                const radiusTopRight =
                    !nextPosition || verticalPosition > nextPosition;

                // BottomRight: no next OR current is lower than next
                const radiusBottomRight =
                    !nextPosition || verticalPosition < nextPosition;

                return {
                    id: `${stage.type}-${index}`,
                    type: stage.type,
                    leftPercent,
                    widthPercent,
                    verticalPosition,
                    duration: stage.duration,
                    radiusTopLeft,
                    radiusBottomLeft,
                    radiusTopRight,
                    radiusBottomRight,
                };
            });

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

            // Create grid lines (horizontal lines) - representing sleep depth
            const gridLinesData = [
                { value: 0, label: "Deep" },
                { value: 50, label: "" },
                { value: 100, label: "Awake" },
            ];

            // Create connection lines on both sides of each rectangle
            const connectionLines = [];
            const RECT_HEIGHT = 20; // Height of stage rectangles
            const LINE_WIDTH = 0.5; // Fixed width for connection lines in percentage
            const MIN_STAGE_WIDTH_FOR_LINES = 1.0; // Don't show lines for stages thinner than 1%

            for (let i = 0; i < rectangles.length; i++) {
                const currentRect = rectangles[i];

                // LEFT side connection (from previous stage)
                if (i > 0) {
                    const prevRect = rectangles[i - 1];

                    // Skip connection lines if either stage is too thin
                    if (
                        prevRect.widthPercent < MIN_STAGE_WIDTH_FOR_LINES ||
                        currentRect.widthPercent < MIN_STAGE_WIDTH_FOR_LINES
                    ) {
                        continue;
                    }

                    // Center the line between the two rectangles
                    const gapStart =
                        prevRect.leftPercent + prevRect.widthPercent;
                    const gapEnd = currentRect.leftPercent;
                    const lineLeft = (gapStart + gapEnd) / 2 - LINE_WIDTH / 2;
                    const lineWidth = LINE_WIDTH;

                    if (lineWidth > 0) {
                        const prevBottom =
                            prevRect.verticalPosition * CHART_HEIGHT;
                        const prevMiddle = prevBottom + RECT_HEIGHT / 2;

                        const currentBottom =
                            currentRect.verticalPosition * CHART_HEIGHT;
                        const currentMiddle = currentBottom + RECT_HEIGHT / 2;

                        // Determine direction: if current stage is higher, direction is "top"
                        const isGoingUp =
                            currentRect.verticalPosition >
                            prevRect.verticalPosition;

                        let bottomPosition, lineHeight;
                        if (isGoingUp) {
                            // Going up: from prev middle to current middle
                            bottomPosition = prevMiddle;
                            lineHeight = currentMiddle - prevMiddle;
                        } else {
                            // Going down: from current middle to prev middle
                            bottomPosition = currentMiddle;
                            lineHeight = prevMiddle - currentMiddle;
                        }

                        connectionLines.push({
                            id: `line-left-${i}`,
                            leftPercent: lineLeft,
                            widthPercent: lineWidth,
                            bottomPosition,
                            height: lineHeight,
                            startColor: STAGE_COLORS[prevRect.type],
                            endColor: STAGE_COLORS[currentRect.type],
                            isAscending:
                                currentRect.verticalPosition >
                                prevRect.verticalPosition,
                        });
                    }
                }

                // RIGHT side connection (to next stage)
                if (i < rectangles.length - 1) {
                    const nextRect = rectangles[i + 1];

                    // Skip connection lines if either stage is too thin
                    if (
                        currentRect.widthPercent < MIN_STAGE_WIDTH_FOR_LINES ||
                        nextRect.widthPercent < MIN_STAGE_WIDTH_FOR_LINES
                    ) {
                        continue;
                    }

                    // Center the line between the two rectangles
                    const gapStart =
                        currentRect.leftPercent + currentRect.widthPercent;
                    const gapEnd = nextRect.leftPercent;
                    const lineLeft = (gapStart + gapEnd) / 2 - LINE_WIDTH / 2;
                    const lineWidth = LINE_WIDTH;

                    if (lineWidth > 0) {
                        const currentBottom =
                            currentRect.verticalPosition * CHART_HEIGHT;
                        const currentMiddle = currentBottom + RECT_HEIGHT / 2;

                        const nextBottom =
                            nextRect.verticalPosition * CHART_HEIGHT;
                        const nextMiddle = nextBottom + RECT_HEIGHT / 2;

                        // Determine direction: if next stage is higher, direction is "top"
                        const isGoingUp =
                            nextRect.verticalPosition >
                            currentRect.verticalPosition;

                        let bottomPosition, lineHeight;
                        if (isGoingUp) {
                            // Going up: from current middle to next middle
                            bottomPosition = currentMiddle;
                            lineHeight = nextMiddle - currentMiddle;
                        } else {
                            // Going down: from next middle to current middle
                            bottomPosition = nextMiddle;
                            lineHeight = currentMiddle - nextMiddle;
                        }

                        connectionLines.push({
                            id: `line-right-${i}`,
                            leftPercent: lineLeft,
                            widthPercent: lineWidth,
                            bottomPosition,
                            height: lineHeight,
                            startColor: STAGE_COLORS[currentRect.type],
                            endColor: STAGE_COLORS[nextRect.type],
                            isAscending:
                                nextRect.verticalPosition >
                                currentRect.verticalPosition,
                        });
                    }
                }
            }

            return {
                stageRectangles: rectangles,
                connectionLines,
                stats: statsWithPercentage,
                timeLabels: labels,
                gridLines: gridLinesData,
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
    if (!stageRectangles || stageRectangles.length === 0) {
        const totalDuration = sleepData.duration;
        const hours = Math.floor(totalDuration / 3600);
        const minutes = Math.floor((totalDuration % 3600) / 60);

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
                    stageRectangles || stageRectangle
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

            {/* Chart with sleep stages */}
            <View style={styles.chartContainer}>
                <View style={styles.chartWrapper}>
                    {/* Grid lines */}
                    <GridLines
                        gridLines={gridLines}
                        chartHeight={CHART_HEIGHT}
                        maxValue={100}
                        minValue={0}
                        showLabels={true}
                    />

                    {/* Connection lines - outside stagesContainer */}
                    {connectionLines.map((line) => (
                        <LinearGradient
                            key={line.id}
                            colors={
                                line.isAscending
                                    ? [line.endColor, line.startColor]
                                    : [line.startColor, line.endColor]
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={{
                                position: "absolute",
                                left: `${line.leftPercent}%`,
                                width: `${line.widthPercent}%`,
                                bottom: line.bottomPosition,
                                height: line.height,
                                opacity: 0.2,
                                zIndex: 1,
                            }}
                        />
                    ))}

                    {/* Sleep stage rectangles */}
                    <View style={styles.stagesContainer}>
                        {/* Stage rectangles */}
                        {stageRectangles.map((rect) => {
                            // Calculate bottom position based on vertical position
                            const bottomPosition =
                                rect.verticalPosition * CHART_HEIGHT;

                            return (
                                <View
                                    key={rect.id}
                                    style={[
                                        styles.stageRectangle,
                                        {
                                            left: `${rect.leftPercent}%`,
                                            width: `${rect.widthPercent}%`,
                                            bottom: bottomPosition,
                                            backgroundColor:
                                                STAGE_COLORS[rect.type],
                                            borderTopLeftRadius:
                                                rect.radiusTopLeft ? 10 : 0,
                                            borderTopRightRadius:
                                                rect.radiusTopRight ? 10 : 0,
                                            borderBottomLeftRadius:
                                                rect.radiusBottomLeft ? 10 : 0,
                                            borderBottomRightRadius:
                                                rect.radiusBottomRight ? 10 : 0,
                                        },
                                    ]}
                                />
                            );
                        })}
                    </View>
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
        marginTop: 20,
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
    chartWrapper: {
        height: CHART_HEIGHT,
        backgroundColor: "#0A0A0A",
        borderRadius: 8,
        position: "relative",
        marginBottom: 8,
        overflow: "visible",
    },
    stagesContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    stageRectangle: {
        position: "absolute",
        height: 20,
        opacity: 0.9,
        zIndex: 2,
    },
    connectionLine: {
        position: "absolute",
        opacity: 0.8,
        zIndex: 1,
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
