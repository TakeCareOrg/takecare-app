export type HeartRateValue = {
    value: number;
    startDate: string;
    endDate: string;
};

export interface HealthData {
    heartRate: {
        lastHeartRateValue: HeartRateValue | null;
        values: HeartRateValue[];
    };
    bloodGlucose: number;
    sleepAnalysis: string;
    steps: number;
    flights: number;
    distance: number;
}
