/**
 * App-side mirror of the backend `WithingsHealthSlice` DTO. Kept in
 * sync manually with `takecare-backend/src/types/withings.ts` — both
 * sides intentionally use the same field names as the app's existing
 * `HealthData` type so the merge in `health-sync.ts` is a shallow
 * spread.
 */
import type {
    BasesHealthValue,
    BodyCompositionSlice,
    HeartRateValue,
    SleepAnalysis,
    SleepStage,
    VitalsSlice,
} from "@app/types/health-data-types";

export type WithingsConnectionState = {
    connected: boolean;
    connectedAt: string | null;
    lastSyncedAt: string | null;
    subscribedApplis: number[];
    isConnecting: boolean;
    error: string | null;
};

export interface WithingsStatusResponse {
    connected: boolean;
    connected_at?: string;
    last_synced_at?: string;
    subscribed_applis?: number[];
}

export interface WithingsOAuthInitResponse {
    authorize_url: string;
    state: string;
}

/**
 * Backend `GET /withings/data` response. Mirrors the shape the app
 * expects so the merge layer can spread it onto `HealthData` directly.
 */
export interface WithingsDataResponse {
    connected: boolean;
    heartRate?: {
        lastHeartRateValue: HeartRateValue | null;
        values: HeartRateValue[];
    };
    sleepAnalysis?: {
        totalSleepValue: WithingsSleepSession | null;
        sleepSteps: WithingsSleepSession[];
    };
    steps?: BasesHealthValue[];
    distance?: BasesHealthValue[];
    activeEnergyBurned?: BasesHealthValue[];
    bodyComposition?: BodyCompositionSlice;
    vitals?: VitalsSlice;
}

/**
 * Withings sleep session shape. Aligns with the app's `SleepAnalysis`
 * type (with a `score` extension that HC sessions don't have).
 */
export interface WithingsSleepSession extends Omit<
    SleepAnalysis,
    "value" | "duration"
> {
    value: "ASLEEP";
    duration: number;
    score?: number;
    stages?: SleepStage[];
}
