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

// Health Connect record types for Android
export interface HealthConnectBaseRecord {
    startTime: string;
    endTime: string;
}

export interface StepsRecord extends HealthConnectBaseRecord {
    count: number;
}

export interface DistanceRecord extends HealthConnectBaseRecord {
    distance:
        | number
        | {
              inMeters?: number;
              inKilometers?: number;
          };
}

export interface FloorsClimbedRecord extends HealthConnectBaseRecord {
    floors?: number;
    count?: number;
    floorsClimbed?: number;
}

export interface EnergyRecord extends HealthConnectBaseRecord {
    energy:
        | number
        | {
              inCalories?: number;
              inKilocalories?: number;
              inJoules?: number;
              inKilojoules?: number;
          };
}

export interface HealthConnectResponse<T> {
    records: T[];
}

export interface HealthData {
    heartRate: {
        lastHeartRateValue: BasesHealthValue | null;
        values: HeartRateValue[];
    };
    bloodGlucose: number;
    sleepAnalysis: {
        totalSleepValue: SleepAnalysis | null;
        sleepSteps: SleepAnalysis[];
    };
    stepCount?: number;
    steps: BasesHealthValue[] | null;
    flights: BasesHealthValue[] | null;
    distance: BasesHealthValue[] | null;
    activeEnergyBurned: BasesHealthValue[] | null;
}
