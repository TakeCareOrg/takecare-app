import type {
    BodyCompositionSlice,
    HealthData,
    VitalsSlice,
} from "@app/types/health-data-types";
import type { WidgetId } from "@stores/home-layout";

/**
 * State shape passed from the Home grid component. Mirrors what
 * `useHealthDataStore` exposes — we keep the dep minimal here so the
 * helper stays trivially testable and doesn't tie the visibility rules
 * to the full Zustand store API.
 */
export interface HealthDataSnapshot {
    todayCache: { data?: HealthData } | null;
    historicalCache: { data?: HealthData } | null;
}

/**
 * Decide whether a widget should be rendered on the Home grid given
 * the current health-data state.
 *
 * Most widgets are unconditional (level, achievements, weather, etc. —
 * they have their own data sources or hard-coded copy). The two
 * conditional ones are `BODY_COMPOSITION` and `VITALS`: they're only
 * useful when HC or Withings has actually produced at least one
 * sample on the relevant types. Without data they'd show "No data"
 * which we deliberately want to avoid — see plan §"Empty widget" /
 * "Cacher complètement".
 */
export function isWidgetAvailable(
    id: WidgetId,
    state: HealthDataSnapshot,
): boolean {
    switch (id) {
        case "BODY_COMPOSITION": {
            return (
                hasAnyBodyComp(state.todayCache?.data?.bodyComposition) ||
                hasAnyBodyComp(state.historicalCache?.data?.bodyComposition)
            );
        }
        case "VITALS": {
            return (
                hasAnyVitals(state.todayCache?.data?.vitals) ||
                hasAnyVitals(state.historicalCache?.data?.vitals)
            );
        }
        default:
            // LEVEL, ACHIEVEMENTS, STREAK, DIARY, ACTIVITY_RINGS, WATER,
            // SLEEP_MINI, WEATHER, HEART_RATE — always available (own
            // data source or hard-coded copy; empty states handled
            // in-widget).
            return true;
    }
}

function hasAnyBodyComp(b: BodyCompositionSlice | undefined): boolean {
    if (!b) return false;
    return (
        (b.weight?.length ?? 0) > 0 ||
        (b.fatMass?.length ?? 0) > 0 ||
        (b.muscleMass?.length ?? 0) > 0 ||
        (b.bmi?.length ?? 0) > 0
    );
}

function hasAnyVitals(v: VitalsSlice | undefined): boolean {
    if (!v) return false;
    return (
        (v.spo2?.length ?? 0) > 0 ||
        (v.hrv?.length ?? 0) > 0 ||
        (v.bloodPressure?.systolic.length ?? 0) > 0
    );
}
