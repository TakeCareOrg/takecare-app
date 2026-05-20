import type {
    BodyCompositionSlice,
    HealthData,
    VitalsSlice,
} from "@app/types/health-data-types";
import type { WithingsDataResponse } from "@app/types/withings-types";

/**
 * Merge a Health Connect `HealthData` envelope with a Withings slice,
 * giving Withings priority for any overlapping types.
 *
 * Priority is applied **per slice** (whole steps array, whole sleep
 * sessions list, etc.) rather than per sample — simpler, and avoids
 * subtle anomalies like "HC sample at 14:32, Withings sample at 14:35"
 * sitting next to each other in the same chart from two different
 * sources.
 *
 * `bodyComposition` and `vitals` used to be forwarded unconditionally
 * from the Withings slice (because HC didn't populate them). Since the
 * 5.1.0 lib bump, HC also feeds those slots — so we now fall back to
 * `hc.bodyComposition` / `hc.vitals` whenever Withings's own slice is
 * absent or empty. Without this fallback, connecting Withings would
 * paradoxically *hide* HC-sourced body data when the user owns a
 * Samsung scale but no Withings scale.
 *
 * Lives in its own module (rather than co-located in `health-sync.ts`)
 * so unit tests can import it without pulling in the AppState / native
 * module side effects that the sync orchestrator owns.
 */
export const mergeWithingsPriority = (
    hc: HealthData | null | undefined,
    withings: WithingsDataResponse | null,
): HealthData | null => {
    if (!hc) return null;
    if (!withings) return hc;

    const hrFromWithings =
        (withings.heartRate?.values?.length ?? 0) > 0
            ? withings.heartRate
            : null;
    const sleepFromWithings =
        (withings.sleepAnalysis?.sleepSteps?.length ?? 0) > 0
            ? withings.sleepAnalysis
            : null;
    const stepsFromWithings =
        (withings.steps?.length ?? 0) > 0 ? withings.steps : null;
    const distanceFromWithings =
        (withings.distance?.length ?? 0) > 0 ? withings.distance : null;
    const energyFromWithings =
        (withings.activeEnergyBurned?.length ?? 0) > 0
            ? withings.activeEnergyBurned
            : null;

    return {
        ...hc,
        heartRate: hrFromWithings ?? hc.heartRate,
        sleepAnalysis: sleepFromWithings ?? hc.sleepAnalysis,
        steps: stepsFromWithings ?? hc.steps,
        distance: distanceFromWithings ?? hc.distance,
        activeEnergyBurned: energyFromWithings ?? hc.activeEnergyBurned,
        bodyComposition: hasAnyBodyComp(withings.bodyComposition)
            ? withings.bodyComposition
            : hc.bodyComposition,
        vitals: hasAnyVitals(withings.vitals) ? withings.vitals : hc.vitals,
    };
};

/**
 * `bodyComposition` from Withings can be an object with all sub-arrays
 * undefined when the user has only a watch (no scale). The `??` operator
 * isn't enough — we need to look one level deeper.
 */
const hasAnyBodyComp = (
    b: BodyCompositionSlice | undefined,
): b is BodyCompositionSlice =>
    !!b &&
    ((b.weight?.length ?? 0) > 0 ||
        (b.fatMass?.length ?? 0) > 0 ||
        (b.muscleMass?.length ?? 0) > 0 ||
        (b.bmi?.length ?? 0) > 0);

const hasAnyVitals = (v: VitalsSlice | undefined): v is VitalsSlice =>
    !!v &&
    ((v.spo2?.length ?? 0) > 0 ||
        (v.hrv?.length ?? 0) > 0 ||
        (v.bloodPressure?.systolic.length ?? 0) > 0);
