import AppleHealthKit, {
    HealthValue,
    HealthKitPermissions,
    HealthInputOptions,
} from "react-native-health";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { track } from "@amplitude/analytics-react-native";

export const useIosHealthData = () => {
    const [hasPermissions, setHasPermissions] = useState(false);
    const [steps, setSteps] = useState(0);
    const [heartRate, setHeartRate] = useState([] as HealthValue[]);
    const [sleep, setSleep] = useState([] as HealthValue[]);
    const [loadingHeartRate, setLoadingHeartRate] = useState(true);
    const [loadingSleep, setLoadingSleep] = useState(true);

    /* Permission options */
    const applePermission = AppleHealthKit.Constants.Permissions;
    const permissions = {
        permissions: {
            read: [
                applePermission.HeartRate,
                applePermission.Steps,
                applePermission.SleepAnalysis,
            ],
            write: [AppleHealthKit.Constants.Permissions.Steps],
        },
    } as HealthKitPermissions;

    const sleepOptions = {
        startDate: new Date(2023, 0, 0).toISOString(), // required
        // endDate: new Date(new Date().setHours(24 * 60 * 60 * 1000)).toISOString(), // required
        endDate: new Date().toISOString(), // required
        limit: 100, // optional; default no limit
    };
    const hearthRateOptions = {
        unit: "bpm", // optional; default 'bpm'
        startDate: new Date(2023, 0, 0).toISOString(), // required
        endDate: new Date().toISOString(), // optional; default now
        ascending: false, // optional; default false
        limit: 100, // optional; default no limit
    };

    useEffect(() => {
        if (Platform.OS !== "ios") {
            setHasPermissions(false);
            return;
        }
        track("Got data", { data: "ios" });
        AppleHealthKit.initHealthKit(permissions, (error: string) => {
            /* Called after we receive a response from the system */
            if (error) {
                setHasPermissions(false);
                console.log("[ERROR] Cannot grant permissions!");
                return;
            }
            setHasPermissions(true);
        });
    }, []);

    const HeartRate = (options: object) => {
        AppleHealthKit.getHeartRateSamples(
            options,
            (err: string, results: Array<HealthValue>) => {
                if (err) {
                    console.log("[ERROR] Cannot get heart rate samples!");
                    return;
                }

                setHeartRate(results);
                setLoadingHeartRate(false);
            }
        );
    };

    useEffect(() => {
        if (!hasPermissions) return;

        const options: HealthInputOptions = {
            // date: new Date(2024, 3, 30).toISOString(),
            date: new Date().toISOString(),
            includeManuallyAdded: false,
        };

        AppleHealthKit.getStepCount(
            options,
            (err: string, results: HealthValue) => {
                if (err) {
                    console.log("[ERROR] Cannot get step count!");
                    return;
                }
                setSteps(results.value);
            }
        );

        HeartRate(hearthRateOptions);

        AppleHealthKit.getSleepSamples(
            sleepOptions,
            (err: string, results: Array<HealthValue>) => {
                if (err) {
                    console.log("[ERROR] Cannot get sleep samples!", err);
                    return;
                }
                setSleep(results);
                setLoadingSleep(false);
            }
        );
    }, [hasPermissions]);

    return {
        steps,
        heartRate,
        loadingHeartRate,
        loadingSleep,
        sleep,
        hasPermissions,
    };
};
