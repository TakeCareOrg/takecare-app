import { useState, useMemo } from "react";
import { View } from "react-native";
import { format, subYears } from "date-fns";

import { DailyBarChart } from "@app/components/ui/chart/daily-bar-chart";
import { Text } from "@app/components/ui/text";
import useHealthData from "@app/hooks/health/use-health-data";
import { PageContainer } from "@app/layouts/page-container";
import { PeriodSwitch } from "@app/components/ui/period-switch";

export function StepsScreen() {
    // State pour stocker les informations de la barre sélectionnée
    const [selectedBarInfo, setSelectedBarInfo] = useState<{
        value: number;
        date?: string;
        day: string;
    } | null>(null);

    // Récupérer TOUTES les données disponibles
    const endDate = format(new Date(), "yyyy-MM-dd");
    const startDate = format(subYears(new Date(), 5), "yyyy-MM-dd");

    const { steps, flights, distance } = useHealthData({
        startDate,
        endDate,
    });

    // Memoized chart data with unique keys
    const chartData = useMemo(() => {
        return steps.map((step, index) => ({
            id: `step-${step.startDate}-${index}`,
            day: format(new Date(step.startDate), "dd"),
            value: step.value,
            color: "#5B7BFB",
            startDate: step.startDate,
        }));
    }, [steps]);

    // Handler pour la sélection d'une barre - SIMPLIFIÉ
    const handleBarSelect = (selectedData: any, index: number) => {
        
        setSelectedBarInfo({
            value: selectedData.value,
            date: selectedData.startDate,
            day: selectedData.day,
        });
    };

    return (
        <PageContainer> 
            {/* For debug  */}
            {selectedBarInfo && (
                <View
                    style={{
                        backgroundColor: "#1a1a1a",
                        padding: 16,
                        borderRadius: 12,
                        marginVertical: 16,
                    }}
                >
                    <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
                        Informations sélectionnées
                    </Text>
                    <Text style={{ color: "#888", fontSize: 14, marginTop: 8 }}>
                        Date: {selectedBarInfo.date ? format(new Date(selectedBarInfo.date), "dd/MM/yyyy") : "N/A"}
                    </Text>
                    <Text style={{ color: "#5B7BFB", fontSize: 16, fontWeight: "600", marginTop: 4 }}>
                        Steps: {selectedBarInfo.value.toLocaleString()}
                    </Text>
                </View>
            )}
            
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
