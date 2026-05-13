import React from "react";

import { BasesHealthValue } from "@app/types/health-data-types";
import { useHealthDataStore } from "@stores/health-data";
import type { WidgetId } from "@stores/home-layout";

import { AboutYou } from "../components/about-you";
import { AchievementsBox } from "../components/achievements-box";
import { HeartRateBox } from "../components/heart-rate-box";
import { LevelBox } from "../components/level-box";
import { StreakBox } from "../components/streak-box";
import { WeatherBox } from "../components/weather-box";
import { WeightBox } from "../components/weight-box";

export type WidgetRenderProps = {
    width: number;
    height: number;
};

function HeartRateWidget({ width, height }: WidgetRenderProps) {
    const heartRate = useHealthDataStore(
        (state) => state.todayCache?.data?.heartRate,
    );
    const value = heartRate?.lastHeartRateValue ?? null;
    return (
        <HeartRateBox value={value} width={width} style={{ flex: 0, height }} />
    );
}

function AboutYouWidget({ width, height }: WidgetRenderProps) {
    const healthData = useHealthDataStore((state) => state.todayCache?.data);
    const sleepValue = healthData?.sleepAnalysis?.totalSleepValue ?? null;
    const stepsRaw = healthData?.steps ?? null;
    const stepCount =
        stepsRaw?.reduce(
            (sum: number, step: BasesHealthValue) => sum + (step.value || 0),
            0,
        ) ?? null;

    return (
        <AboutYou
            sleepValue={sleepValue}
            steps={stepCount}
            width={width}
            height={height}
        />
    );
}

export function renderWidget(
    id: WidgetId,
    props: WidgetRenderProps,
): React.ReactNode {
    switch (id) {
        case "LEVEL":
            return <LevelBox width={props.width} height={props.height} />;
        case "ACHIEVEMENTS":
            return (
                <AchievementsBox width={props.width} height={props.height} />
            );
        case "STREAK":
            return <StreakBox width={props.width} height={props.height} />;
        case "WEATHER":
            return <WeatherBox width={props.width} height={props.height} />;
        case "WEIGHT":
            return (
                <WeightBox
                    width={props.width}
                    style={{ height: props.height }}
                />
            );
        case "HEART_RATE":
            return <HeartRateWidget {...props} />;
        case "ABOUT_YOU":
            return <AboutYouWidget {...props} />;
    }
}
