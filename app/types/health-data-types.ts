export type HeartRateValue = {
    value: number;
    startDate: string;
    endDate: string;
};

export interface SleepStage {
    type:
        | "unknown"
        | "awake"
        | "sleeping"
        | "out_of_bed"
        | "light"
        | "deep"
        | "rem";
    startTime: string;
    endTime: string;
    duration: number; // in seconds
}

export type SleepAnalysis = {
    value: string;
    startDate: string;
    endDate: string;
    duration?: number;
    stages?: SleepStage[];
};

export type BasesHealthValue = {
    value: number;
    startDate: string;
    endDate: string;
};

export type WorkoutData = {
    workoutActivityType: number;
    workoutActivityName: string;
    duration: number;
    startDate: string;
    endDate: string;
    totalEnergyBurned?: number;
    totalDistance?: number;
    location?: "indoor" | "outdoor";
    metadata?: Record<string, string>;
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

export type ExerciseSessionRecord = HealthConnectBaseRecord;

export interface HealthConnectResponse<T> {
    records: T[];
}

/**
 * Withings exposes a few categories that Health Connect doesn't surface
 * (or surfaces less cleanly): full body composition from a smart scale,
 * blood pressure from a BP cuff, SpO2 + HRV from their watches. They're
 * grouped here so the rest of the app can treat them as first-class
 * `HealthData` slices once the user connects Withings.
 */
export interface BodyCompositionSlice {
    weight?: BasesHealthValue[];
    fatMass?: BasesHealthValue[];
    muscleMass?: BasesHealthValue[];
    bmi?: BasesHealthValue[];
}

export interface VitalsSlice {
    spo2?: BasesHealthValue[];
    hrv?: BasesHealthValue[];
    bloodPressure?: {
        systolic: BasesHealthValue[];
        diastolic: BasesHealthValue[];
    };
}

export interface HealthData {
    heartRate: {
        lastHeartRateValue: BasesHealthValue | null;
        values: HeartRateValue[];
    };
    sleepAnalysis: {
        totalSleepValue: SleepAnalysis | null;
        sleepSteps: SleepAnalysis[];
    };
    stepCount?: number;
    steps: BasesHealthValue[] | null;
    flights: BasesHealthValue[] | null;
    distance: BasesHealthValue[] | null;
    activeEnergyBurned: BasesHealthValue[] | null;
    workouts: WorkoutData[] | null;
    activeMinutes: BasesHealthValue[] | null;
    /** Withings-only — undefined when the user hasn't connected Withings. */
    bodyComposition?: BodyCompositionSlice;
    /** Withings-only — undefined when the user hasn't connected Withings. */
    vitals?: VitalsSlice;
}
