import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { GridLines } from "@app/components/ui/chart/shared/grid-lines";
import { Text } from "@app/components/ui/text";
import { useColorTheme } from "@app/hooks/use-color-theme";

export interface Stage {
    type: string;
    startTime: string;
    endTime: string;
    duration: number;
}

export interface StagesChartData {
    startDate: string;
    endDate: string;
    duration: number;
    stages: Stage[];
}

interface StagesChartProps {
    data: StagesChartData;
    stageColors: Record<string, string>;
    stageVerticalPositions: Record<string, number>;
    timeLabels: string[];
    chartHeight?: number;
    rectHeight?: number;
}

const DEFAULT_CHART_HEIGHT = 200;
const DEFAULT_RECT_HEIGHT = 20;

export const StagesChart: React.FC<StagesChartProps> = ({
    data,
    stageColors,
    stageVerticalPositions,
    timeLabels,
    chartHeight = DEFAULT_CHART_HEIGHT,
    rectHeight = DEFAULT_RECT_HEIGHT,
}) => {
    const colors = useColorTheme();

    const { stageRectangles, connectionLines, gridLines } = useMemo(() => {
        if (!data || !data.duration) {
            return {
                stageRectangles: [],
                connectionLines: [],
                gridLines: [],
            };
        }

        const startTime = new Date(data.startDate);
        const totalDuration = data.duration;

        let stages: Stage[] =
            data.stages && data.stages.length > 0
                ? data.stages
                : [
                      {
                          type: "unknown",
                          startTime: data.startDate,
                          endTime: data.endDate,
                          duration: totalDuration,
                      },
                  ];

        // Merge adjacent stages of the same type, even if separated by micro-stages
        const mergedStages: Stage[] = [];
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
                if (mergedStages.length >= 2) {
                    const prevPrevStage = mergedStages[mergedStages.length - 2];
                    const prevWidthPercent =
                        (prevStage.duration / totalDuration) * 100;

                    if (
                        prevWidthPercent < MICRO_STAGE_THRESHOLD &&
                        prevPrevStage.type === currentStage.type
                    ) {
                        mergedStages.pop();
                        prevPrevStage.endTime = currentStage.endTime;
                        prevPrevStage.duration =
                            (new Date(prevPrevStage.endTime).getTime() -
                                new Date(prevPrevStage.startTime).getTime()) /
                            1000;
                        continue;
                    }
                }
            }

            mergedStages.push({ ...currentStage });
        }

        stages = mergedStages;

        // Create rectangles for each stage
        const rectangles = stages.map((stage, index) => {
            const stageStartSeconds =
                (new Date(stage.startTime).getTime() - startTime.getTime()) /
                1000;

            const leftPercent = (stageStartSeconds / totalDuration) * 100;
            const widthPercent = (stage.duration / totalDuration) * 100;
            const verticalPosition = stageVerticalPositions[stage.type] ?? 0.5;

            const prevStage = index > 0 ? stages[index - 1] : null;
            const nextStage =
                index < stages.length - 1 ? stages[index + 1] : null;

            const prevPosition = prevStage
                ? (stageVerticalPositions[prevStage.type] ?? 0.5)
                : null;
            const nextPosition = nextStage
                ? (stageVerticalPositions[nextStage.type] ?? 0.5)
                : null;

            const radiusTopLeft =
                !prevPosition || verticalPosition > prevPosition;
            const radiusBottomLeft =
                !prevPosition || verticalPosition < prevPosition;
            const radiusTopRight =
                !nextPosition || verticalPosition > nextPosition;
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

        // Create connection lines
        const connectionLines = [];
        const RECT_HEIGHT = rectHeight;
        const LINE_WIDTH = 0.5;
        const MIN_STAGE_WIDTH_FOR_LINES = 0.3;

        for (let i = 0; i < rectangles.length; i++) {
            const currentRect = rectangles[i];

            if (i > 0) {
                const prevRect = rectangles[i - 1];

                if (
                    prevRect.widthPercent < MIN_STAGE_WIDTH_FOR_LINES ||
                    currentRect.widthPercent < MIN_STAGE_WIDTH_FOR_LINES
                ) {
                    continue;
                }

                const gapStart = prevRect.leftPercent + prevRect.widthPercent;
                const gapEnd = currentRect.leftPercent;
                const lineLeft = (gapStart + gapEnd) / 2 - LINE_WIDTH / 2;
                const lineWidth = LINE_WIDTH;

                if (lineWidth > 0) {
                    const prevBottom = prevRect.verticalPosition * chartHeight;
                    const prevMiddle = prevBottom + RECT_HEIGHT / 2;

                    const currentBottom =
                        currentRect.verticalPosition * chartHeight;
                    const currentMiddle = currentBottom + RECT_HEIGHT / 2;

                    const isGoingUp =
                        currentRect.verticalPosition >
                        prevRect.verticalPosition;

                    let bottomPosition, lineHeight;
                    if (isGoingUp) {
                        bottomPosition = prevMiddle;
                        lineHeight = currentMiddle - prevMiddle;
                    } else {
                        bottomPosition = currentMiddle;
                        lineHeight = prevMiddle - currentMiddle;
                    }

                    connectionLines.push({
                        id: `line-left-${i}`,
                        leftPercent: lineLeft,
                        widthPercent: lineWidth,
                        bottomPosition,
                        height: lineHeight,
                        startColor: stageColors[prevRect.type] ?? "#666666",
                        endColor: stageColors[currentRect.type] ?? "#666666",
                        isAscending:
                            currentRect.verticalPosition >
                            prevRect.verticalPosition,
                    });
                }
            }

            if (i < rectangles.length - 1) {
                const nextRect = rectangles[i + 1];

                if (
                    currentRect.widthPercent < MIN_STAGE_WIDTH_FOR_LINES ||
                    nextRect.widthPercent < MIN_STAGE_WIDTH_FOR_LINES
                ) {
                    continue;
                }

                const gapStart =
                    currentRect.leftPercent + currentRect.widthPercent;
                const gapEnd = nextRect.leftPercent;
                const lineLeft = (gapStart + gapEnd) / 2 - LINE_WIDTH / 2;
                const lineWidth = LINE_WIDTH;

                if (lineWidth > 0) {
                    const currentBottom =
                        currentRect.verticalPosition * chartHeight;
                    const currentMiddle = currentBottom + RECT_HEIGHT / 2;

                    const nextBottom = nextRect.verticalPosition * chartHeight;
                    const nextMiddle = nextBottom + RECT_HEIGHT / 2;

                    const isGoingUp =
                        nextRect.verticalPosition >
                        currentRect.verticalPosition;

                    let bottomPosition, lineHeight;
                    if (isGoingUp) {
                        bottomPosition = currentMiddle;
                        lineHeight = nextMiddle - currentMiddle;
                    } else {
                        bottomPosition = nextMiddle;
                        lineHeight = currentMiddle - nextMiddle;
                    }

                    connectionLines.push({
                        id: `line-right-${i}`,
                        leftPercent: lineLeft,
                        widthPercent: lineWidth,
                        bottomPosition,
                        height: lineHeight,
                        startColor: stageColors[currentRect.type] ?? "#666666",
                        endColor: stageColors[nextRect.type] ?? "#666666",
                        isAscending:
                            nextRect.verticalPosition >
                            currentRect.verticalPosition,
                    });
                }
            }
        }

        // Create grid lines at each stage level
        const uniquePositions = Array.from(
            new Set(rectangles.map((rect) => rect.verticalPosition)),
        ).sort((a, b) => a - b);

        const gridLines = uniquePositions.map((position, index) => ({
            value: position * 100,
            opacity: index === 0 ? 0.3 : 0.2,
            color: index === 0 ? colors.text : undefined,
        }));

        return {
            stageRectangles: rectangles,
            connectionLines,
            gridLines,
        };
    }, [
        data,
        stageVerticalPositions,
        chartHeight,
        rectHeight,
        stageColors,
        colors.text,
    ]);

    if (!data || !data.duration || stageRectangles.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text fontSize={14} color={colors.secondary}>
                    No data available
                </Text>
            </View>
        );
    }

    // Get the lowest stage position (first in sorted array)
    const lowestPosition = gridLines.length > 0 ? gridLines[0].value / 100 : 0;
    const timeLabelsBottom = lowestPosition * chartHeight - 20; // 20px below the line

    return (
        <View style={styles.container}>
            <View style={[styles.chartWrapper, { height: chartHeight }]}>
                {/* Grid lines */}
                <GridLines
                    gridLines={gridLines}
                    chartHeight={chartHeight}
                    maxValue={100}
                    minValue={0}
                    showLabels={false}
                />

                {/* Connection lines */}
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

                {/* Stage rectangles */}
                <View style={styles.stagesContainer}>
                    {stageRectangles.map((rect) => {
                        const bottomPosition =
                            rect.verticalPosition * chartHeight;

                        return (
                            <View
                                key={rect.id}
                                style={[
                                    styles.stageRectangle,
                                    {
                                        left: `${rect.leftPercent}%`,
                                        width: `${rect.widthPercent}%`,
                                        bottom: bottomPosition,
                                        height: rectHeight,
                                        backgroundColor:
                                            stageColors[rect.type] ?? "#666666",
                                        borderTopLeftRadius: rect.radiusTopLeft
                                            ? 10
                                            : 0,
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

                {/* Time labels */}
                <View
                    style={[
                        styles.timeLabelsContainer,
                        { bottom: timeLabelsBottom },
                    ]}
                >
                    {timeLabels.map((label, index) => (
                        <Text
                            key={index}
                            color={colors.secondary}
                            fontSize={12}
                        >
                            {label}
                        </Text>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 32,
        paddingHorizontal: 16,
    },
    emptyContainer: {
        padding: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    chartWrapper: {
        borderRadius: 8,
        position: "relative",
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
        opacity: 0.9,
        zIndex: 2,
    },
    timeLabelsContainer: {
        position: "absolute",
        left: 4,
        right: 4,
        flexDirection: "row",
        justifyContent: "space-between",
        zIndex: 3,
    },
});
