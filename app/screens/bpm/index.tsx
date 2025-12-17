import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Box } from "@app/components/ui/box";
import { DailyBarChart } from "@app/components/ui/chart/daily-bar-chart/index";
import { BarDataItem } from "@app/components/ui/chart/daily-bar-chart/progress-bars";
import { LineChart } from "@app/components/ui/chart/line-chart";
import useHealthData from "@app/hooks/health/use-health-data";
import { useColorTheme } from "@app/hooks/use-color-theme";
import { PageContainer } from "@app/layouts/page-container";
import { safeFormatDate } from "@app/utils/date";
import { aggregateHeartRateByHour } from "@app/utils/heart-rate";

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

    // Get hourly heart rate data for the selected date
    const hourlyHeartRateData = useMemo(() => {
        if (!heartRate?.values || heartRate.values.length === 0) {
            return [];
        }

        const hourlyData = aggregateHeartRateByHour(
            heartRate.values,
            selectedDate,
        );

        // Filter out hours with no data (value = 0)
        const result = hourlyData
            .filter((data) => data.count > 0) // Only include hours with actual data
            .map((data) => ({
                value: data.value,
                min: data.min,
                max: data.max,
                timestamp: data.timestamp,
                label: data.label,
            }));

        return result;
    }, [heartRate, selectedDate]);

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

            <View style={{ marginTop: 20 }}>
                <Box title={t("BPM.GRAPH_TITLE")}>
                    <LineChart
                        data={hourlyHeartRateData}
                        height={200}
                        lineColor={colors.red[500]}
                        showGrid={true}
                        gridLineColor={colors.white[800]}
                        fillGradientColors={[colors.red[500], colors.blue[300]]}
                    />
                </Box>
            </View>
        </PageContainer>
    );
}
