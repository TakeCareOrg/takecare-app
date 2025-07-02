import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { ToggleSwitch } from "@app/components/ui/toogle-switch";

import {
    IntervalBarChart,
    IntervalBarDataItem,
    IntervalType,
} from "../../../components/ui/chart/interval-bar-chart";

export function DetailedBarChart() {
    const [selectedInterval, setSelectedInterval] =
        useState<IntervalType>("hours");
    const [selectedData, setSelectedData] =
        useState<IntervalBarDataItem | null>(null);

    // Sample data for each interval type
    const sampleData = {
        hours: [
            { label: "00", value: 12, intervalKey: "0" },
            { label: "01", value: 8, intervalKey: "1" },
            { label: "02", value: 5, intervalKey: "2" },
            { label: "03", value: 3, intervalKey: "3" },
            { label: "04", value: 2, intervalKey: "4" },
            { label: "05", value: 15, intervalKey: "5" },
            { label: "06", value: 45, intervalKey: "6" },
            { label: "07", value: 62, intervalKey: "7" },
            { label: "08", value: 78, intervalKey: "8" },
            { label: "09", value: 85, intervalKey: "9" },
            { label: "10", value: 72, intervalKey: "10" },
            { label: "11", value: 68, intervalKey: "11" },
            { label: "12", value: 55, intervalKey: "12" },
            { label: "13", value: 48, intervalKey: "13" },
            { label: "14", value: 52, intervalKey: "14" },
            { label: "15", value: 65, intervalKey: "15" },
            { label: "16", value: 73, intervalKey: "16" },
            { label: "17", value: 82, intervalKey: "17" },
            { label: "18", value: 76, intervalKey: "18" },
            { label: "19", value: 58, intervalKey: "19" },
            { label: "20", value: 42, intervalKey: "20" },
            { label: "21", value: 35, intervalKey: "21" },
            { label: "22", value: 28, intervalKey: "22" },
            { label: "23", value: 18, intervalKey: "23" },
        ],
        weekdays: [
            { label: "Mon", value: 65, intervalKey: "monday" },
            { label: "Tue", value: 72, intervalKey: "tuesday" },
            { label: "Wed", value: 58, intervalKey: "wednesday" },
            { label: "Thu", value: 81, intervalKey: "thursday" },
            { label: "Fri", value: 75, intervalKey: "friday" },
            { label: "Sat", value: 45, intervalKey: "saturday" },
            { label: "Sun", value: 38, intervalKey: "sunday" },
        ],
        months: [
            { label: "Jan", value: 42, intervalKey: "january" },
            { label: "Feb", value: 38, intervalKey: "february" },
            { label: "Mar", value: 55, intervalKey: "march" },
            { label: "Apr", value: 68, intervalKey: "april" },
            { label: "May", value: 75, intervalKey: "may" },
            { label: "Jun", value: 82, intervalKey: "june" },
            { label: "Jul", value: 88, intervalKey: "july" },
            { label: "Aug", value: 85, intervalKey: "august" },
            { label: "Sep", value: 78, intervalKey: "september" },
            { label: "Oct", value: 65, intervalKey: "october" },
            { label: "Nov", value: 52, intervalKey: "november" },
            { label: "Dec", value: 45, intervalKey: "december" },
        ],
        years: [
            { label: "2020", value: 500, intervalKey: "2020" },
            { label: "2021", value: 600, intervalKey: "2021" },
            { label: "2022", value: 700, intervalKey: "2022" },
            { label: "2023", value: 800, intervalKey: "2023" },
            { label: "2024", value: 900, intervalKey: "2024" },
        ],
    };

    const handleBarSelect = (data: IntervalBarDataItem, index: number) => {
        setSelectedData(data);
    };

    return (
        <>
            <View style={{ marginBottom: 16 }}>
                <ToggleSwitch
                    data={[
                        { value: "hours", label: "Day" },
                        { value: "weekdays", label: "Weekly" },
                        { value: "months", label: "Montly" },
                        { value: "years", label: "Yearly" },
                    ]}
                    selectedValue={selectedInterval}
                    onChange={(value) =>
                        setSelectedInterval(value as IntervalType)
                    }
                />
            </View>
            <IntervalBarChart
                data={sampleData[selectedInterval]}
                intervalType={selectedInterval}
                height={120}
                onSelect={handleBarSelect}
                referenceLines={[
                    { value: 50, label: "Target" },
                    { value: 80, label: "Goal" },
                ]}
                dynamicColors={{
                    belowFirstReference: "#8A8A8A",
                    aboveFirstReference: "#16D356",
                }}
                buffer={10}
                compactMode={selectedInterval === "hours"} // Enable compact mode for hours
            />
        </>
    );
}
