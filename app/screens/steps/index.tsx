import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { DailyBarChart } from "@app/components/ui/chart/daily-bar-chart";
import { Text } from "@app/components/ui/text";
import useHealthData from "@app/hooks/health/use-health-data";
import { PageContainer } from "@app/layouts/page-container";
import { format, subYears } from "date-fns";

type PeriodType = "day" | "week" | "month" | "year";

interface Period {
    value: PeriodType;
    label: string;
}

interface PeriodOptionProps {
    period: Period;
    isSelected: boolean;
    onPress: (period: PeriodType) => void;
}

const periods: Period[] = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
];

const PeriodOption = ({ period, isSelected, onPress }: PeriodOptionProps) => (
    <TouchableOpacity
        style={{
            flex: 1,
            height: "100%",
            backgroundColor: isSelected ? "#f2f2f2" : "transparent",
            borderRadius: isSelected ? 10 : 0,
            alignItems: "center",
            justifyContent: "center",
        }}
        onPress={() => onPress(period.value)}
    >
        <Text
            style={{
                color: isSelected ? "#000" : "#fff",
                fontWeight: "600",
                fontSize: 16,
            }}
        >
            {period.label}
        </Text>
    </TouchableOpacity>
);

const Divider = () => (
    <View style={{ width: 1, height: "50%", backgroundColor: "#444" }} />
);

export function StepsScreen() {
    // Récupérer TOUTES les données disponibles
    const endDate = format(new Date(), "yyyy-MM-dd");
    // Commencer il y a 5 ans (ou plus si nécessaire) pour avoir toutes les données
    const startDate = format(subYears(new Date(), 5), "yyyy-MM-dd");

    const { steps, flights, distance } = useHealthData({
        startDate,
        endDate,
    });

    console.log("Steps data:", steps);
    console.log("Flights data:", flights);
    console.log("Distance data:", distance);
    console.log(`Total steps entries: ${steps.length}`);
    console.log(`Total flights entries: ${flights.length}`);
    console.log(`Total distance entries: ${distance.length}`);

    // Créer les données pour le graphique avec TOUTES les données de steps
    const chartData = steps.map((step) => ({
        day: format(new Date(step.startDate), "dd"), // Jour du mois
        value: step.value,
        color: "#5B7BFB", // Couleur des barres
    }));

    const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("day");

    const handlePeriodChange = (period: PeriodType) => {
        setSelectedPeriod(period);
    };

    return (
        <PageContainer>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 4,
                    backgroundColor: "#181818",
                    borderRadius: 10,
                    height: 40,
                }}
            >
                {periods.map((period, index) => (
                    <>
                        <PeriodOption
                            key={period.value}
                            period={period}
                            isSelected={selectedPeriod === period.value}
                            onPress={handlePeriodChange}
                        />
                        {index < periods.length - 1 && (
                            <Divider key={`divider-${index}`} />
                        )}
                    </>
                ))}
            </View>
            {steps.length > 0 && (
                <DailyBarChart
                    data={chartData}
                    referenceLines={[
                        { value: 5000, label: "5k" },
                        { value: 10000, label: "10k" },
                    ]}
                    height={200}
                />
            )}
        </PageContainer>
    );
}
