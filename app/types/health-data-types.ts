export type HeartRateValue = {
    value: number;
    startDate: string;
    endDate: string;
};

export type SleepAnalysis = {
    value: string;
    startDate: string;
    endDate: string;
    duration?: number;
};

export type BasesHealthValue = {
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
    sleepAnalysis: {
        totalSleepValue: SleepAnalysis | null;
        sleepSteps: SleepAnalysis[];
    };
    stepCount: number | null;
    steps: BasesHealthValue[] | null;
    flights: BasesHealthValue[] | null;
    distance: BasesHealthValue[] | null;
}
