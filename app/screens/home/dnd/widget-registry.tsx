import React from "react";

import { useHealthDataStore } from "@stores/health-data";
import type { WidgetId } from "@stores/home-layout";

import { AchievementsBox } from "../components/achievements-box";
import { ActivityRingsBox } from "../components/activity-rings-box";
import { AIChatPromptBox } from "../components/ai-chat-prompt-box";
import { BodyCompositionBox } from "../components/body-composition-box";
import { DiaryBox } from "../components/diary-box";
import { HeartRateBox } from "../components/heart-rate-box";
import { LevelBox } from "../components/level-box";
import { SleepMiniBox } from "../components/sleep-mini-box";
import { StreakBox } from "../components/streak-box";
import { VitalsBox } from "../components/vitals-box";
import { WaterBox } from "../components/water-box";
import { WeatherBox } from "../components/weather-box";

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

function ActivityRingsWidget({ width, height }: WidgetRenderProps) {
    const healthData = useHealthDataStore((state) => state.todayCache?.data);
    return (
        <ActivityRingsBox
            steps={healthData?.steps ?? null}
            calories={healthData?.activeEnergyBurned ?? null}
            activeMinutes={healthData?.activeMinutes ?? null}
            width={width}
            height={height}
        />
    );
}

function SleepMiniWidget({ width, height }: WidgetRenderProps) {
    const sleepSteps = useHealthDataStore(
        (state) =>
            state.historicalCache?.data?.sleepAnalysis?.sleepSteps ?? null,
    );
    const lastSleep =
        sleepSteps && sleepSteps.length > 0
            ? sleepSteps[sleepSteps.length - 1]
            : null;
    return <SleepMiniBox sleep={lastSleep} width={width} height={height} />;
}

/**
 * BodyComposition + Vitals are Withings-only data slices. The widgets
 * render with placeholder copy when the store has nothing — that's
 * intentional, mirroring how HeartRate / Weight behave. Hiding the
 * widgets entirely when Withings isn't connected is the home-layout
 * store's responsibility (out of scope for this registry).
 */
function BodyCompositionWidget({ width, height }: WidgetRenderProps) {
    const bodyComposition = useHealthDataStore(
        (state) =>
            state.todayCache?.data?.bodyComposition ??
            state.historicalCache?.data?.bodyComposition,
    );
    return (
        <BodyCompositionBox
            weightValues={bodyComposition?.weight}
            width={width}
            style={{ flex: 0, height }}
        />
    );
}

function VitalsWidget({ width, height }: WidgetRenderProps) {
    const vitals = useHealthDataStore(
        (state) =>
            state.todayCache?.data?.vitals ??
            state.historicalCache?.data?.vitals,
    );
    return (
        <VitalsBox vitals={vitals} width={width} style={{ flex: 0, height }} />
    );
}

export function renderWidget(
    id: WidgetId,
    props: WidgetRenderProps,
): React.ReactNode {
    switch (id) {
        case "AI_CHAT_PROMPT":
            return (
                <AIChatPromptBox width={props.width} height={props.height} />
            );
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
        case "DIARY":
            return <DiaryBox width={props.width} height={props.height} />;
        case "HEART_RATE":
            return <HeartRateWidget {...props} />;
        case "ACTIVITY_RINGS":
            return <ActivityRingsWidget {...props} />;
        case "WATER":
            return <WaterBox width={props.width} height={props.height} />;
        case "SLEEP_MINI":
            return <SleepMiniWidget {...props} />;
        case "BODY_COMPOSITION":
            return <BodyCompositionWidget {...props} />;
        case "VITALS":
            return <VitalsWidget {...props} />;
    }
}
