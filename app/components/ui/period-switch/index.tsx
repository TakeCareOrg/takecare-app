import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { Text } from "@app/components/ui/text";

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
    { value: "day", label: "D" },
    { value: "week", label: "W" },
    { value: "month", label: "M" },
    { value: "year", label: "Y" },
] as const;

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

export const PeriodSwitch = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("day");

    const handlePeriodChange = (period: PeriodType) => {
        setSelectedPeriod(period);
    };

    return (
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
                    {index < periods.length - 1 && <Divider key={`divider-${index}`} />}
                </>
            ))}
        </View>
    );
};
