import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { HearthPulse } from "@app/assets/icons/heart-pulse";
import { DailyBarChart } from "@app/components/ui/chart/daily-bar-chart/index";
import { EmptyState } from "@app/components/ui/empty-state";
import { useColorTheme } from "@app/hooks/use-color-theme";
import { PageContainer } from "@app/layouts/page-container";
import { useHealthDataStore } from "@app/stores/health-data";

import { HourlyChart } from "./components/hourly-chart";
import { TodayRangeCard } from "./components/today-range-card";
import { BarDataItem, useHeartRateData } from "./hooks/use-heart-rate-data";

export function HeartScreen() {
    const { t } = useTranslation("full_trads");
    const colors = useColorTheme();

    //TODO: in implementation, this will be used to show selected bar info
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedBarInfo, setSelectedBarInfo] = useState<{
        value: number;
        date?: string;
        day: string;
    } | null>(null);

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // Use historical cached health data from store
    const healthData = useHealthDataStore(
        (state) => state.historicalCache?.data,
    );
    const heartRate = healthData?.heartRate || {
        lastHeartRateValue: null,
        values: [],
    };

    // Process heart rate data
    const { chartData, hourlyHeartRateData, todayStats } = useHeartRateData({
        heartRate,
        selectedDate,
    });

    const handleBarSelect = (selectedData: BarDataItem) => {
        setSelectedBarInfo({
            value: selectedData.value,
            date: selectedData.startDate,
            day: selectedData.day,
        });

        // Update selected date to fetch data for the selected day.
        // `selectedData.startDate` is a local-TZ "YYYY-MM-DD" string from
        // `safeFormatDate`; passing it straight to `new Date(...)` parses
        // it as UTC midnight (per ISO 8601), which silently shifts the day
        // by one on any UTC-negative device. Anchor the Date to local
        // midnight using the explicit Y/M/D constructor.
        if (selectedData.startDate) {
            const parts = selectedData.startDate
                .split("-")
                .map((p) => parseInt(p, 10));
            if (parts.length === 3 && parts.every((n) => !Number.isNaN(n))) {
                const [y, m, d] = parts;
                setSelectedDate(new Date(y, m - 1, d));
            } else {
                setSelectedDate(new Date(selectedData.startDate));
            }
        }
    };

    const referenceLines = useMemo(
        () => [
            {
                value: 70,
                label: ">70",
                lineColor: colors.orange[200],
                labelColor: colors.orange[200],
            },
            {
                value: 100,
                label: ">100",
                lineColor: colors.orange[500],
                labelColor: colors.orange[500],
            },
        ],
        [colors.orange],
    );

    const dynamicColors = useMemo(
        () => ({
            belowFirstReference: colors.white[700],
            aboveFirstReference: colors.red[500],
        }),
        [colors.red, colors.white],
    );

    // Compute a key for DailyBarChart to force remount on data changes
    const dailyBarChartKey =
        chartData.length > 0
            ? `${chartData.length}-${chartData[chartData.length - 1].startDate}`
            : "empty";

    return (
        <PageContainer variant="details" title={t("BPM.TITLE")} settings={[]}>
            <DailyBarChart
                key={dailyBarChartKey}
                data={chartData}
                onSelect={handleBarSelect}
                referenceLines={referenceLines}
                height={150}
                dynamicColors={dynamicColors}
            />

            {hourlyHeartRateData.length > 0 ? (
                <>
                    <HourlyChart data={hourlyHeartRateData} />

                    {todayStats && (
                        <View style={{ marginTop: 20 }}>
                            <TodayRangeCard
                                todayMin={todayStats.todayMin}
                                todayMax={todayStats.todayMax}
                                todayAverage={todayStats.todayAverage}
                            />
                        </View>
                    )}
                </>
            ) : (
                <EmptyState
                    icon={<HearthPulse width={48} height={48} />}
                    title={t("BPM.NO_DATA_AVAILABLE")}
                    message={t("BPM.WEAR_WATCH_MESSAGE")}
                />
            )}
        </PageContainer>
    );
}
