import { useMemo, useState } from "react";

import { DailyBarChart } from "@app/components/ui/chart/daily-bar-chart";
import { DailyBarDataItem } from "@app/components/ui/chart/shared";
import { SleepStagesChart } from "@app/components/ui/chart/sleep-stages-chart";
import { useHealthData } from "@app/hooks/health/use-health-data";
import { PageContainer } from "@app/layouts/page-container";
import { SleepAnalysis } from "@app/types/health-data-types";
import { safeFormatDate } from "@app/utils/date";

export function SleepScreen() {
    const { sleepAnalysis } = useHealthData({
        startDate: new Date(),
        endDate: new Date(),
    });

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
            const day = safeFormatDate(dayDate);

            // Convert duration from seconds to hours for display
            const durationInHours = sleep.duration ? sleep.duration / 3600 : 0;

            return {
                day,
                value: durationInHours,
                startDate: sleep.startDate,
                color: "#6B8CFF", // Blue color for sleep
            };
        });
    }, [sleepAnalysis.sleepSteps]);

    const handleSelectDay = (selectedData: DailyBarDataItem) => {
        // Find the corresponding sleep data by matching the date
        const sleep = sleepAnalysis.sleepSteps?.find(
            (s) => safeFormatDate(new Date(s.endDate)) === selectedData.day,
        );

        if (sleep) {
            setSelectedSleep(sleep);
        }
    };

    return (
        <PageContainer variant="details" title="Sleep">
            <DailyBarChart data={chartData} onSelect={handleSelectDay} />

            {selectedSleep && <SleepStagesChart sleepData={selectedSleep} />}
        </PageContainer>
    );
}
