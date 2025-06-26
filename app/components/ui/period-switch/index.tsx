import { TouchableOpacity, View } from "react-native";
import { Text } from "@app/components/ui/text";
import { useState } from "react";

type PeriodType = "D" | "W" | "M" | "Y";

export const PeriodSwitch = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("D");

    const handlePeriodChange = (period: PeriodType) => {
        setSelectedPeriod(period);
    };

    const renderOption = (period: PeriodType) => {
        const isSelected = selectedPeriod === period;
        return (
            <TouchableOpacity 
                style={{
                    flex: 1,
                    height: '100%',
                    backgroundColor: isSelected ? "#f2f2f2" : "transparent",
                    borderRadius: isSelected ? 10 : 0,
                    alignItems: "center",
                    justifyContent: "center",
                    
                }}
                onPress={() => handlePeriodChange(period)}
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
    };

    const renderDivider = () => (
        <View style={{ width: 1, height: '50%', backgroundColor: "#444" }} />
    );

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
            {renderOption("D")}
            {renderDivider()}
            {renderOption("W")}
            {renderDivider()}
            {renderOption("M")}
            {renderDivider()}
            {renderOption("Y")}
        </View>
    );
};