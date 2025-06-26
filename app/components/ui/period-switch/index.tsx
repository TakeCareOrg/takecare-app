import { TouchableOpacity, View } from "react-native";
import { Text } from "@app/components/ui/text";
import { useState } from "react";

type PeriodType = "D" | "W" | "M" | "Y";

interface PeriodOptionProps {
    period: PeriodType;
    isSelected: boolean;
    onPress: (period: PeriodType) => void;
}

const PeriodOption = ({ period, isSelected, onPress }: PeriodOptionProps) => (
    <TouchableOpacity 
        style={{
            flex: 1,
            height: '100%',
            backgroundColor: isSelected ? "#f2f2f2" : "transparent",
            borderRadius: isSelected ? 10 : 0,
            alignItems: "center",
            justifyContent: "center",
        }}
        onPress={() => onPress(period)}
    >
        <Text 
            style={{ 
                color: isSelected ? "#000" : "#fff",
                fontWeight: "600",
                fontSize: 16,
            }}
        >
            {period}
        </Text>
    </TouchableOpacity>
);

const Divider = () => (
    <View style={{ width: 1, height: '50%', backgroundColor: "#444" }} />
);

export const PeriodSwitch = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("D");

    const handlePeriodChange = (period: PeriodType) => {
        setSelectedPeriod(period);
    };

    return (
        <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 4,
            backgroundColor: "#181818",
            borderRadius: 10,
            height: 40,
        }}>
            <PeriodOption 
                period="D" 
                isSelected={selectedPeriod === "D"} 
                onPress={handlePeriodChange} 
            />
            <Divider />
            <PeriodOption 
                period="W" 
                isSelected={selectedPeriod === "W"} 
                onPress={handlePeriodChange} 
            />
            <Divider />
            <PeriodOption 
                period="M" 
                isSelected={selectedPeriod === "M"} 
                onPress={handlePeriodChange} 
            />
            <Divider />
            <PeriodOption 
                period="Y" 
                isSelected={selectedPeriod === "Y"} 
                onPress={handlePeriodChange} 
            />
        </View>
    );
};