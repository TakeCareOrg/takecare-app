import { useState, useMemo } from "react";
import { View, TouchableOpacity } from "react-native";
import { format, subYears } from "date-fns";

import { DailyBarChart } from "@app/components/ui/chart/daily-bar-chart";
import { Text } from "@app/components/ui/text";
import useHealthData from "@app/hooks/health/use-health-data";
import { PageContainer } from "@app/layouts/page-container";
import { PeriodSwitch } from "@app/components/ui/period-switch";

export function StepsScreen() {
    const [selectedBarInfo, setSelectedBarInfo] = useState<{
        value: number;
        date?: string;
        day: string;
    } | null>(null);

    const endDate = format(new Date(), "yyyy-MM-dd");
    const startDate = format(subYears(new Date(), 5), "yyyy-MM-dd");

    const { steps, flights, distance } = useHealthData({
        startDate,
        endDate,
    });

    const chartData = useMemo(() => {
        return steps.map((step: { startDate: string | number | Date; value: any; }, index: any) => ({
            id: `step-${step.startDate}-${index}`,
            day: format(new Date(step.startDate), "dd"),
            value: step.value,
            color: "#5B7BFB",
            startDate: step.startDate,
        }));
    }, [steps]);

    const handleBarSelect = (selectedData: any, index: number) => {        
        setSelectedBarInfo({
            value: selectedData.value,
            date: selectedData.startDate,
            day: selectedData.day,
        });
    };

    return (
        <PageContainer> 
            
            {steps.length > 0 && (
                <DailyBarChart
                    data={chartData}
                    onSelect={handleBarSelect}
                    referenceLines={[
                        { value: 5000, label: "5k" },
                        { value: 10000, label: "10k" },
                    ]}
                    height={150}
                />
            )}
        </PageContainer>
    );
}
