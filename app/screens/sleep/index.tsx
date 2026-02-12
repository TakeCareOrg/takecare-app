import { useMemo, useState } from "react";

import { DailyBarChart } from "@app/components/ui/chart/daily-bar-chart";
import { DailyBarDataItem } from "@app/components/ui/chart/shared";
import { PageContainer } from "@app/layouts/page-container";
import { useHealthDataStore } from "@app/stores/health-data";
import { SleepAnalysis } from "@app/types/health-data-types";

import { SleepRate } from "./components/sleep-rate";
import { SleepScores } from "./components/sleep-scores";
import { SleepStagesChart } from "./components/sleep-stages-chart";

export function SleepScreen() {
    // Use historical cached health data from store
    const healthData = useHealthDataStore(
        (state) => state.historicalCache?.data,
    );
    const sleepAnalysis = healthData?.sleepAnalysis || {
        totalSleepValue: null,
        sleepSteps: [],
    };

    const [selectedSleep, setSelectedSleep] = useState<SleepAnalysis | null>(
        null,
    );
    // Transform sleep data to DailyBarChart format
    const chartData = useMemo<DailyBarDataItem[]>(() => {
        if (
            !sleepAnalysis.sleepSteps ||
            sleepAnalysis.sleepSteps.length === 0
        ) {
            return [];
        }

        return sleepAnalysis.sleepSteps.map((sleep) => {
            // Use endDate as the "day" since that's when you woke up
            const dayDate = new Date(sleep.endDate);
            const dayNumber = String(dayDate.getDate()).padStart(2, "0");

            // Convert duration from seconds to hours for display
            const durationInHours = sleep.duration ? sleep.duration / 3600 : 0;

            return {
                day: dayNumber,
                value: durationInHours,
                startDate: sleep.startDate,
                color: "#6B8CFF", // Blue color for sleep
            };
        });
    }, [sleepAnalysis.sleepSteps]);

    const handleSelectDay = (selectedData: DailyBarDataItem) => {
        // Find the corresponding sleep data by matching the startDate
        const sleep = sleepAnalysis.sleepSteps?.find(
            (s) => s.startDate === selectedData.startDate,
        );

        if (sleep) {
            setSelectedSleep(sleep);
        }
    };

    return (
        <PageContainer variant="details" title="Sleep">
            <DailyBarChart data={chartData} onSelect={handleSelectDay} />
            <SleepRate />
            {selectedSleep && <SleepStagesChart sleepData={selectedSleep} />}

            <SleepScores />
        </PageContainer>
    );
}
