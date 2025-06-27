import { useMemo, useState } from "react";

import { DailyBarChart } from "@app/components/ui/chart/daily-bar-chart";
import { ToggleSwitch } from "@app/components/ui/toogle-switch";
import useHealthData from "@app/hooks/health/use-health-data";
import { PageContainer } from "@app/layouts/page-container";
import { format, subDays, subMonths, subYears } from "date-fns";

type PeriodType = "day" | "week" | "month" | "year";
const periods: { value: PeriodType; label: string }[] = [
    { value: "day", label: "D" },
    { value: "week", label: "W" },
    { value: "month", label: "M" },
    { value: "year", label: "Y" },
] as const;

export function StepsScreen() {
    const [selectedBarInfo, setSelectedBarInfo] = useState<{
        value: number;
        date?: string;
        day: string;
    } | null>(null);
    const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("day");

    const startDate = useMemo(() => {
        switch (selectedPeriod) {
            case "week":
                return subDays(new Date(), 7);
            case "month":
                return subMonths(new Date(), 1);
            case "year":
                return subYears(new Date(), 1);
            default:
                return new Date();
        }
    }, [selectedPeriod]);

    const { steps, flights, distance } = useHealthData({
        startDate: startDate,
        endDate: new Date(),
    });

    const chartData = useMemo(() => {
        if (!steps || steps.length === 0) {
            return [];
        }

        return steps.map((step, index) => ({
            id: `step-${step.startDate}-${index}`,
            day: format(new Date(step.startDate), "dd"),
            value: step.value,
            color: "#5B7BFB",
            startDate: step.startDate,
        }));
    }, [steps]);

    const handleBarSelect = (selectedData: any) => {
        setSelectedBarInfo({
            value: selectedData.value,
            date: selectedData.startDate,
            day: selectedData.day,
        });
    };

    return (
        <PageContainer>
            <ToggleSwitch
                data={periods}
                selectedValue={selectedPeriod}
                onChange={(setPeriod) => {
                    setSelectedPeriod(setPeriod as PeriodType);
                }}
            />

            <DailyBarChart
                data={chartData}
                onSelect={handleBarSelect}
                referenceLines={[
                    { value: 5000, label: "5k" },
                    { value: 10000, label: "10k" },
                ]}
                height={150}
            />
        </PageContainer>
    );
}
