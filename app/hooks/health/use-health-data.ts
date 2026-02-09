import { useEffect } from "react";
import { Platform } from "react-native";

import { useHealthDataStore } from "@app/stores/health-data";
import type { HealthData } from "@app/types/health-data-types";

const useHealthDataNative =
    Platform.select({
        ios: () => require("./use-health-data.ios").default,
        android: () => require("./use-health-data.android").default,
    }) || (() => () => null);

export const useHealthData = ({
    startDate,
    endDate,
}: {
    startDate: string | Date;
    endDate: string | Date;
}): HealthData => {
    const startDateStr =
        typeof startDate === "string" ? startDate : startDate.toISOString();
    const endDateStr =
        typeof endDate === "string" ? endDate : endDate.toISOString();

    const { cache, shouldRefetch, setCache } = useHealthDataStore();

    const nativeHook = useHealthDataNative();
    const nativeData = nativeHook({ startDate, endDate });

    useEffect(() => {
        const needsRefetch = shouldRefetch(startDateStr, endDateStr);

        if (nativeData && needsRefetch) {
            setCache({
                data: nativeData,
                lastFetch: new Date().toISOString(),
                dateRange: {
                    startDate: startDateStr,
                    endDate: endDateStr,
                },
            });
        }
    }, [nativeData, startDateStr, endDateStr, shouldRefetch, setCache]);

    const shouldUseCache = cache && !shouldRefetch(startDateStr, endDateStr);

    return (
        (shouldUseCache ? cache.data : nativeData) || {
            heartRate: { lastHeartRateValue: null, values: [] },
            sleepAnalysis: { totalSleepValue: null, sleepSteps: [] },
            steps: null,
            flights: null,
            distance: null,
            activeEnergyBurned: null,
            workouts: null,
            activeMinutes: null,
        }
    );
};
