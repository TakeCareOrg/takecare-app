export type HeartRateValue = {
    value: number;
    startDate: string;
    endDate: string;
};

export interface HealthData {
    heartRate: {
        lastHeartRateValue: any;
        values: Array<{ value: number; startDate: string; endDate: string }>;
    };
    bloodGlucose: number;
    sleepAnalysis: string;
    steps: Array<{ value: number; startDate: string; endDate: string }>;
    flights: Array<{ value: number; startDate: string; endDate: string }>;
    distance: Array<{ value: number; startDate: string; endDate: string }>;
}
