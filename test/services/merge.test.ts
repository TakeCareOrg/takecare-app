import { mergeWithingsPriority } from "@app/services/health/merge";
import type { HealthData } from "@app/types/health-data-types";
import type { WithingsDataResponse } from "@app/types/withings-types";

/**
 * Unit tests for the HC ↔ Withings merge. Pure function, no React /
 * native dependencies — safe to test in isolation.
 *
 * The contract being verified:
 *
 *   - Withings wins when it has data for a slice; HC is the fallback.
 *   - bodyComposition + vitals: Withings wins when its slice has at
 *     least one sample, HC is the fallback (5.1.0+: HC also populates
 *     these slots from Samsung Health / Google Fit / Fitbit).
 *   - When Withings is missing (null), the HC envelope is returned
 *     untouched.
 */

const sample = (value: number) => ({
    value,
    startDate: "2026-05-12T10:00:00Z",
    endDate: "2026-05-12T10:00:00Z",
});

const hcBase: HealthData = {
    heartRate: {
        lastHeartRateValue: { value: 70, startDate: "", endDate: "" },
        values: [sample(70), sample(72)],
    },
    sleepAnalysis: {
        totalSleepValue: null,
        sleepSteps: [
            {
                value: "ASLEEP",
                startDate: "2026-05-12T22:00:00Z",
                endDate: "2026-05-13T06:00:00Z",
                duration: 28_800,
            },
        ],
    },
    stepCount: 5000,
    steps: [sample(2000), sample(3000)],
    flights: [sample(2)],
    distance: [sample(3000)],
    activeEnergyBurned: [sample(200)],
    workouts: null,
    activeMinutes: null,
};

describe("mergeWithingsPriority", () => {
    it("returns null when HC data is missing", () => {
        expect(mergeWithingsPriority(null, null)).toBeNull();
        expect(mergeWithingsPriority(undefined, null)).toBeNull();
    });

    it("returns HC unchanged when Withings is missing", () => {
        const merged = mergeWithingsPriority(hcBase, null);
        expect(merged).toBe(hcBase);
    });

    it("overrides Steps with Withings values when both are present", () => {
        const withings: WithingsDataResponse = {
            connected: true,
            steps: [sample(8000)],
        };
        const merged = mergeWithingsPriority(hcBase, withings)!;
        expect(merged.steps).toEqual(withings.steps);
        // HC steps must be entirely replaced, not merged.
        expect(merged.steps?.[0].value).toBe(8000);
    });

    it("falls back to HC steps when Withings sends an empty array", () => {
        const withings: WithingsDataResponse = {
            connected: true,
            steps: [],
        };
        const merged = mergeWithingsPriority(hcBase, withings)!;
        expect(merged.steps).toEqual(hcBase.steps);
    });

    it("forwards Withings-only slices (bodyComposition / vitals) without HC fallback", () => {
        const withings: WithingsDataResponse = {
            connected: true,
            bodyComposition: {
                weight: [sample(72)],
                bmi: [sample(22)],
            },
            vitals: {
                spo2: [sample(97)],
                bloodPressure: {
                    systolic: [sample(120)],
                    diastolic: [sample(80)],
                },
            },
        };
        const merged = mergeWithingsPriority(hcBase, withings)!;
        expect(merged.bodyComposition?.weight?.[0].value).toBe(72);
        expect(
            merged.vitals?.bloodPressure?.systolic[0].value,
        ).toBe(120);
        // Sanity: HC slices untouched.
        expect(merged.heartRate).toBe(hcBase.heartRate);
    });

    it("uses Withings heart rate when it has samples", () => {
        const withings: WithingsDataResponse = {
            connected: true,
            heartRate: {
                lastHeartRateValue: { value: 85, startDate: "", endDate: "" },
                values: [sample(85)],
            },
        };
        const merged = mergeWithingsPriority(hcBase, withings)!;
        expect(merged.heartRate.lastHeartRateValue?.value).toBe(85);
    });

    it("clears bodyComposition / vitals on next merge when Withings stops sending them AND HC has none", () => {
        const withingsWithBody: WithingsDataResponse = {
            connected: true,
            bodyComposition: {
                weight: [sample(72)],
            },
        };
        const withFirst = mergeWithingsPriority(hcBase, withingsWithBody)!;
        expect(withFirst.bodyComposition?.weight?.[0].value).toBe(72);

        // Next merge — Withings has no body composition and HC doesn't
        // either (the default `hcBase`). We expect bodyComposition to be
        // undefined (no fallback source available).
        const withingsEmpty: WithingsDataResponse = { connected: true };
        const withSecond = mergeWithingsPriority(hcBase, withingsEmpty)!;
        expect(withSecond.bodyComposition).toBeUndefined();
    });

    it("falls back to HC bodyComposition when Withings is connected but has no body data", () => {
        // Scenario: user has connected Withings (watch only, no scale)
        // BUT Samsung Health pushes weight measurements into HC. We
        // want the weight from HC to surface, not Withings's `undefined`
        // to win.
        const hcWithBody: HealthData = {
            ...hcBase,
            bodyComposition: { weight: [sample(72)] },
        };
        const withings: WithingsDataResponse = { connected: true };
        const merged = mergeWithingsPriority(hcWithBody, withings)!;
        expect(merged.bodyComposition?.weight?.[0].value).toBe(72);
    });

    it("falls back to HC vitals when Withings has none but HC does", () => {
        const hcWithVitals: HealthData = {
            ...hcBase,
            vitals: { spo2: [sample(97)] },
        };
        const withings: WithingsDataResponse = { connected: true };
        const merged = mergeWithingsPriority(hcWithVitals, withings)!;
        expect(merged.vitals?.spo2?.[0].value).toBe(97);
    });

    it("Withings bodyComposition wins over HC's when both are present", () => {
        // Cohérence avec le contrat global "Withings prioritaire" :
        // si l'utilisateur a une balance Withings ET une balance Samsung,
        // c'est Withings qui gagne pour la cohérence avec les autres
        // métriques (HR, sleep) qui suivent la même règle.
        const hcWithBody: HealthData = {
            ...hcBase,
            bodyComposition: { weight: [sample(72)] },
        };
        const withings: WithingsDataResponse = {
            connected: true,
            bodyComposition: { weight: [sample(70)] },
        };
        const merged = mergeWithingsPriority(hcWithBody, withings)!;
        expect(merged.bodyComposition?.weight?.[0].value).toBe(70);
    });
});
