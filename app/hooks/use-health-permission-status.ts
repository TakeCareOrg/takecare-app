import {
    HealthKitCategoryType,
    HealthKitModule,
    HealthKitQuantityType,
} from "@takecareorg/takecare-healthkit";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";

export type HealthPermissionStatus = "loading" | "granted" | "missing";

/**
 * List of types we consider "core" for TakeCare. The Android Health
 * Connect permission UI is per-record-type, so checking a handful is
 * enough to know whether the user accepted *anything* meaningful.
 */
const CORE_TYPES: string[] = [
    HealthKitQuantityType.STEPS,
    HealthKitQuantityType.HEART_RATE,
    HealthKitQuantityType.ACTIVE_ENERGY_BURNED,
    HealthKitQuantityType.DISTANCE_WALKING_RUNNING,
    HealthKitCategoryType.SLEEP_ANALYSIS,
];

/**
 * Polls the native module's `checkAuthorizationStatus(type)` for the
 * core record types and reports a single high-level state.
 *
 * - `"loading"` until the first poll completes.
 * - `"granted"` if *any* core type is `sharingAuthorized` — that's
 *   enough to show real data; partial grants are handled by the
 *   "Manage permissions" entry in Connected Devices.
 * - `"missing"` if every core type is `notDetermined` or
 *   `sharingDenied` — that's our trigger for the onboarding modal.
 *
 * On iOS the hook is a no-op (returns `"granted"` immediately) because
 * HealthKit shows its own dialog on the first read attempt. Only
 * Android's Health Connect needs the manual nudge.
 */
export function useHealthPermissionStatus(): {
    status: HealthPermissionStatus;
    refresh: () => void;
} {
    const [status, setStatus] = useState<HealthPermissionStatus>(() =>
        Platform.OS === "android" ? "loading" : "granted",
    );
    const inFlight = useRef(false);

    const check = useCallback(async () => {
        if (Platform.OS !== "android") return;
        if (inFlight.current) return;
        inFlight.current = true;
        try {
            const results = await Promise.all(
                CORE_TYPES.map((type) =>
                    HealthKitModule.checkAuthorizationStatus(type).catch(
                        () => "notDetermined",
                    ),
                ),
            );
            const anyGranted = results.some((r) => r === "sharingAuthorized");
            setStatus(anyGranted ? "granted" : "missing");
        } finally {
            inFlight.current = false;
        }
    }, []);

    useEffect(() => {
        check();
        const sub = AppState.addEventListener("change", (nextState) => {
            if (nextState === "active") check();
        });
        return () => sub.remove();
    }, [check]);

    return { status, refresh: check };
}
