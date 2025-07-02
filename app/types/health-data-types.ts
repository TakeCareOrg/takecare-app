export type HeartRateValue = {
    value: number;
    startDate: string;
    endDate: string;
};

export type BasesHealthValue = {
    value: number;
    startDate: string;
    endDate: string;
};

export interface HealthData {
    heartRate: {
        lastHeartRateValue: any;
        values: HeartRateValue[];
    };
    bloodGlucose: number;
    sleepAnalysis: string;
    steps: BasesHealthValue[] | null;
    flights: BasesHealthValue[] | null;
    distance: BasesHealthValue[] | null;
    activeEnergyBurned: BasesHealthValue[] | null;
}
