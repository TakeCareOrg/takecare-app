import { useEffect, useMemo, useState } from "react";

import { HealthData } from "@app/types/health-data-types";
import AppleHealthKit, {
    HealthInputOptions,
    HealthKitPermissions,
} from "react-native-health";

const permissions: HealthKitPermissions = {
    permissions: {
        read: [
            AppleHealthKit.Constants.Permissions.HeartRate,
            AppleHealthKit.Constants.Permissions.BloodGlucose,
            AppleHealthKit.Constants.Permissions.SleepAnalysis,
            AppleHealthKit.Constants.Permissions.Steps,
            AppleHealthKit.Constants.Permissions.FlightsClimbed,
            AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
        ],
        write: [],
    },
};

const useHealthData = ({
    startDate,
    endDate,
}: {
    startDate: string | Date;
    endDate: string | Date;
}): HealthData => {
    const [hasPermissions, setHasPermission] = useState(false);
    const [heartRate, setHeartRate] = useState<HealthData["heartRate"]>({
        lastHeartRateValue: null,
        values: [],
    });
    const [bloodGlucose, setBloodGlucose] =
        useState<HealthData["bloodGlucose"]>(0);
    const [sleepAnalysis, setSleepAnalysis] =
        useState<HealthData["sleepAnalysis"]>("");

    // Changer les types pour être des tableaux au lieu de nombres
    const [steps, setSteps] = useState<
        Array<{ value: number; startDate: string; endDate: string }>
    >([]);
    const [flights, setFlights] = useState<
        Array<{ value: number; startDate: string; endDate: string }>
    >([]);
    const [distance, setDistance] = useState<
        Array<{ value: number; startDate: string; endDate: string }>
    >([]);

    const startDateCopy = new Date(startDate).setHours(0, 0, 0, 0);
    const endDateCopy = new Date(endDate).setHours(23, 59, 59, 999);

    const dateOptions = useMemo(() => {
        return {
            startDate: new Date(startDateCopy).toISOString(),
            endDate: new Date(endDateCopy).toISOString(),
        };
    }, [startDateCopy, endDateCopy]);

    useEffect(() => {
        AppleHealthKit.isAvailable((err, isAvailable) => {
            if (err || !isAvailable) {
                console.error("Apple Health not available or error:", err);
                return;
            }

            AppleHealthKit.initHealthKit(permissions, (initError) => {
                if (initError) {
                    console.error("HealthKit init error:", initError);
                    return;
                }
                setHasPermission(true);
            });
        });
    }, []);

    useEffect(() => {
        if (!hasPermissions) return;

        const options: HealthInputOptions = {
            startDate: dateOptions.startDate,
            endDate: dateOptions.endDate,
            // includeManuallyAdded: false,
        };

        AppleHealthKit.getHeartRateSamples(options, (err, results) => {
            if (err) {
                console.error("Error fetching heart rate samples:", err);
                return;
            }

            const sortedResults = results
                .sort((a, b) => {
                    return (
                        new Date(a.startDate).getTime() -
                        new Date(b.startDate).getTime()
                    );
                })
                .map((sample) => ({
                    value: sample.value,
                    startDate: sample.startDate,
                    endDate: sample.endDate,
                }));

            setHeartRate({
                lastHeartRateValue: sortedResults[0] || null,
                values: sortedResults,
            });
        });

        AppleHealthKit.getDailyStepCountSamples(options, (err, results) => {
            if (err) {
                console.error("Error fetching daily step count samples:", err);
                return;
            }

            const sortedResults = results
                .sort(
                    (a, b) =>
                        new Date(a.startDate).getTime() -
                        new Date(b.startDate).getTime(),
                )
                .map((sample) => ({
                    value: sample.value,
                    startDate: sample.startDate,
                    endDate: sample.endDate,
                }));

            setSteps(sortedResults);
        });

        AppleHealthKit.getDailyFlightsClimbedSamples(
            options,
            (err, results) => {
                if (err) {
                    console.error(
                        "Error fetching daily flights climbed samples:",
                        err,
                    );
                    return;
                }

                const sortedResults = results
                    .sort(
                        (a, b) =>
                            new Date(a.startDate).getTime() -
                            new Date(b.startDate).getTime(),
                    )
                    .map((sample) => ({
                        value: sample.value,
                        startDate: sample.startDate,
                        endDate: sample.endDate,
                    }));

                setFlights(sortedResults);
            },
        );

        AppleHealthKit.getDailyDistanceWalkingRunningSamples(
            options,
            (err, results) => {
                if (err) {
                    console.error(
                        "Error fetching daily distance walking/running samples:",
                        err,
                    );
                    return;
                }

                const sortedResults = results
                    .sort(
                        (a, b) =>
                            new Date(a.startDate).getTime() -
                            new Date(b.startDate).getTime(),
                    )
                    .map((sample) => ({
                        value: sample.value,
                        startDate: sample.startDate,
                        endDate: sample.endDate,
                    }));

                setDistance(sortedResults);
            },
        );
    }, [hasPermissions, dateOptions.startDate, dateOptions.endDate]);

    return {
        heartRate,
        bloodGlucose,
        sleepAnalysis,
        steps,
        flights,
        distance,
    };
};

export default useHealthData;
