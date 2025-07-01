import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { IntervalBarChart, IntervalType, IntervalBarDataItem } from './interval-bar-chart';
import { ToggleSwitch } from '@app/components/ui/toogle-switch';

export const DetailedBarChart: React.FC = () => {
    const [selectedInterval, setSelectedInterval] = useState<IntervalType>('hours');
    const [selectedData, setSelectedData] = useState<IntervalBarDataItem | null>(null);

    // Sample data for each interval type
    const sampleData = {
        hours: [
            { label: '06', value: 45, intervalKey: '6' },
            { label: '07', value: 62, intervalKey: '7' },
            { label: '08', value: 78, intervalKey: '8' },
            { label: '09', value: 85, intervalKey: '9' },
            { label: '10', value: 72, intervalKey: '10' },
            { label: '11', value: 68, intervalKey: '11' },
            { label: '12', value: 55, intervalKey: '12' },
            { label: '13', value: 48, intervalKey: '13' },
            { label: '14', value: 52, intervalKey: '14' },
            { label: '15', value: 65, intervalKey: '15' },
            { label: '16', value: 73, intervalKey: '16' },
            { label: '17', value: 82, intervalKey: '17' },
            { label: '18', value: 76, intervalKey: '18' },
            { label: '19', value: 58, intervalKey: '19' },
            { label: '20', value: 42, intervalKey: '20' },
            { label: '21', value: 35, intervalKey: '21' },
            { label: '22', value: 28, intervalKey: '22' },
        ],
        weekdays: [
            { label: 'Mon', value: 65, intervalKey: 'monday' },
            { label: 'Tue', value: 72, intervalKey: 'tuesday' },
            { label: 'Wed', value: 58, intervalKey: 'wednesday' },
            { label: 'Thu', value: 81, intervalKey: 'thursday' },
            { label: 'Fri', value: 75, intervalKey: 'friday' },
            { label: 'Sat', value: 45, intervalKey: 'saturday' },
            { label: 'Sun', value: 38, intervalKey: 'sunday' },
        ],
        months: [
            { label: 'Jan', value: 42, intervalKey: 'january' },
            { label: 'Feb', value: 38, intervalKey: 'february' },
            { label: 'Mar', value: 55, intervalKey: 'march' },
            { label: 'Apr', value: 68, intervalKey: 'april' },
            { label: 'May', value: 75, intervalKey: 'may' },
            { label: 'Jun', value: 82, intervalKey: 'june' },
            { label: 'Jul', value: 88, intervalKey: 'july' },
            { label: 'Aug', value: 85, intervalKey: 'august' },
            { label: 'Sep', value: 78, intervalKey: 'september' },
            { label: 'Oct', value: 65, intervalKey: 'october' },
            { label: 'Nov', value: 52, intervalKey: 'november' },
            { label: 'Dec', value: 45, intervalKey: 'december' },
        ],
    };

    const handleBarSelect = (data: IntervalBarDataItem, index: number) => {
        setSelectedData(data);
        console.log(`Selected ${selectedInterval}:`, data);
    };

    return (
        <View style={styles.container}>
            
            <View style={{ marginBottom: 16 }}>
                <ToggleSwitch
                    data={[
                        { value: 'hours', label: 'Hours' },
                        { value: 'weekdays', label: 'Days' },
                        { value: 'months', label: 'Months' }
                    ]}
                    selectedValue={selectedInterval}
                    onChange={(value) => setSelectedInterval(value as IntervalType)}
                />
            </View>

            <IntervalBarChart
                data={sampleData[selectedInterval]}
                intervalType={selectedInterval}
                height={250}
                onSelect={handleBarSelect}
                referenceLines={[
                    { value: 50, label: 'Target' },
                    { value: 80, label: 'Goal' }
                ]}
                dynamicColors={{
                    belowFirstReference: '#FF6B6B',
                    aboveFirstReference: '#4ECDC4',
                    aboveSecondReference: '#45B7D1'
                }}
                buffer={10}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
        color: '#333',
    },
    selectedInfo: {
        backgroundColor: '#F5F5F5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    selectedText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
});
