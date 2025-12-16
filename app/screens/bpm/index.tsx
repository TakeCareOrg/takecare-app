import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { DailyBarChart } from "@app/components/ui/chart/daily-bar-chart/index";
import { BarDataItem } from "@app/components/ui/chart/daily-bar-chart/progress-bars";
import useHealthData from "@app/hooks/health/use-health-data";
import { useColorTheme } from "@app/hooks/use-color-theme";
import { PageContainer } from "@app/layouts/page-container";
import { safeFormatDate } from "@app/utils/date";

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

    const chartData = useMemo(() => {
        if (!heartRate?.values || heartRate.values.length === 0) {
            return [];
        }

        // Group by day and calculate average
        const dailyHeartRateMap = new Map<
            string,
            { total: number; count: number; date: Date }
        >();

        heartRate.values.forEach((rate) => {
            if (!rate.startDate) return;
            const date = new Date(rate.startDate);
            const dayKey = safeFormatDate(date);
            const current = dailyHeartRateMap.get(dayKey) || {
                total: 0,
                count: 0,
                date,
            };

            dailyHeartRateMap.set(dayKey, {
                total: current.total + rate.value,
                count: current.count + 1,
                date: current.date,
            });
        });

        // Convert to chart format with average values
        return Array.from(dailyHeartRateMap.entries())
            .map(([dateStr, { total, count, date }]) => ({
                id: `heartRate-${dateStr}`,
                day: date.getDate().toString(),
                value: Math.round(total / count),
                startDate: date.toISOString(),
            }))
            .sort(
                (a, b) =>
                    new Date(a.startDate).getTime() -
                    new Date(b.startDate).getTime(),
            );
    }, [heartRate]);

    const handleBarSelect = (selectedData: BarDataItem) => {
        setSelectedBarInfo({
            value: selectedData.value,
            date: selectedData.startDate,
            day: selectedData.day,
        });

        // Update selected date to fetch data for the selected day
        if (selectedData.startDate) {
            setSelectedDate(new Date(selectedData.startDate));
        }
    };

    const referenceLines = useMemo(
        () => [
            {
                value: 70,
                label: ">70",
                lineColor: colors.raw.orange[200],
                labelColor: colors.raw.orange[200],
            },
            {
                value: 150,
                label: ">150",
                lineColor: colors.raw.orange[500],
                labelColor: colors.raw.orange[500],
            },
        ],
        [colors.raw.orange],
    );

    const dynamicColors = useMemo(
        () => ({
            belowFirstReference: colors.raw.white[700],
            aboveFirstReference: colors.raw.red[500],
        }),
        [colors.raw.red, colors.raw.white],
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
        </PageContainer>
    );
}
