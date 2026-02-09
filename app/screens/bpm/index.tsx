import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { DailyBarChart } from "@app/components/ui/chart/daily-bar-chart/index";
import { useHealthData } from "@app/hooks/health/use-health-data";
import { useColorTheme } from "@app/hooks/use-color-theme";
import { PageContainer } from "@app/layouts/page-container";

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

    // Memoize dates to prevent infinite loop
    const dateRange = useMemo(
        () => ({
            startDate: new Date(1995, 0, 1),
            endDate: new Date(),
        }),
        [],
    );

    // Get all available health data
    const { heartRate } = useHealthData(dateRange);

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

        // Update selected date to fetch data for the selected day
        if (selectedData.startDate) {
            const newDate = new Date(selectedData.startDate);
            setSelectedDate(newDate);
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
                disableSnapping={false}
                referenceLines={referenceLines}
                height={150}
                fillMissingDays={true}
                dynamicColors={dynamicColors}
            />

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
        </PageContainer>
    );
}
