import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Platform, View } from "react-native";
import { HealthValue } from "react-native-health";
// import useHealthData from "../../../hooks/use-health-data";
import { useIosHealthData } from "../../../hooks/use-ios-health-data";
import { useColors } from "../../../styles/Colors";
import OneValueBarChart from "../../../ui/charts/one-value-bar-chart";
import SleepBar from "../../../ui/charts/sleep-bar";
import { Container } from "../../../ui/container/index";

export const AboutYou: React.FC = () => {
    const { hasPermissions, sleep, steps, loadingSleep } = useIosHealthData();

    const { main } = useColors();
    // const healthData = useHealthData();
    const { t } = useTranslation();
    const sleepTarget = {
        min: { hours: 7, minutes: 0 },
        max: { hours: 10, minutes: 0 },
    };

    interface SleepSegment {
        startDate: Date;
        endDate: Date;
        value: string | number;
    }

    const rawData: HealthValue[] = useMemo(() => {
        if (!hasPermissions && !loadingSleep) return [];
        console.log("stepssdd", sleep);
        return sleep;
    }, [hasPermissions, sleep, loadingSleep]);

    const parseSleepData = (data: HealthValue[]) => {
        return data.map((item) => ({
            startDate: new Date(item.startDate),
            endDate: new Date(item.endDate),
            value: item.value,
        }));
    };

    const calculateSleepDurations = (
        segments: SleepSegment[],
    ): { [key: string]: number } => {
        return segments.reduce((acc, segment) => {
            const duration =
                (segment.endDate.getTime() - segment.startDate.getTime()) /
                (1000 * 60); // Convertir en minutes
            if (acc[segment.value]) {
                acc[segment.value] += duration;
            } else {
                acc[segment.value] = duration;
            }
            return acc;
        }, {} as { [key: string]: number });
    };

    const groupSegmentsByDay = (
        segments: SleepSegment[],
    ): { [key: string]: SleepSegment[] } => {
        return segments.reduce((acc, segment) => {
            const dateKey = segment.startDate.toISOString().split("T")[0]; // Utiliser la date comme clé
            if (acc[dateKey]) {
                acc[dateKey].push(segment);
            } else {
                acc[dateKey] = [segment];
            }
            return acc;
        }, {} as { [key: string]: SleepSegment[] });
    };

    const sleepSegments = parseSleepData(rawData);
    const sleepSegmentsByDay = groupSegmentsByDay(sleepSegments);

    // Définir un type plus spécifique pour totalSleep
    interface SleepDurationByDate {
        date: string;
        CORE?: number;
        AWAKE?: number;
        REM?: number;
        DEEP?: number;
        INBED?: number;
        [key: string]: string | number | undefined;
    }

    const totalSleep: SleepDurationByDate[] = [];

    for (const [date, segments] of Object.entries(sleepSegmentsByDay)) {
        const durations = calculateSleepDurations(segments);

        // displaySleepDurations(durations);
        totalSleep.push({ date: date, ...durations });
    }

    const todaySleptTime = useMemo(() => {
        if (loadingSleep) return { hours: 0, minutes: 0 };

        const sleepData = totalSleep[0];

        if (!sleepData) return { hours: 7, minutes: 0 };

        // Utiliser des valeurs par défaut de 0 pour les propriétés potentiellement undefined
        const coreTime = sleepData.CORE || 0;
        const awakeTime = sleepData.AWAKE || 0;
        const remTime = sleepData.REM || 0;
        const deepTime = sleepData.DEEP || 0;
        const inBedTime = sleepData.INBED || 0;

        // Calculer le temps total (minutes) en additionant tous les types de sommeil,
        // ou utiliser INBED comme fallback si disponible
        const today = coreTime + awakeTime + remTime + deepTime || inBedTime;

        const hours = Math.floor(today / 60);
        const minutes = Math.floor(today % 60);

        return { hours, minutes };
    }, [totalSleep, loadingSleep]);

    return (
        <Container
            title={t("HOME.ABOUT_YOU")}
            preset={"little"}
            height={"auto"}
        >
            <View style={{ rowGap: 12 }}>
                <SleepBar
                    sleepedTime={todaySleptTime}
                    sleepTarget={sleepTarget}
                />
            </View>
        </Container>
    );
};
