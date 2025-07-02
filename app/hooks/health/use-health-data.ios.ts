import { useEffect, useMemo, useState } from "react";
import AppleHealthKit, {
    HealthInputOptions,
    HealthKitPermissions,
} from "react-native-health";

import { HealthData, SleepAnalysis } from "@app/types/health-data-types";

const permissions: HealthKitPermissions = {
    permissions: {
        read: [
            AppleHealthKit.Constants.Permissions.HeartRate,
            AppleHealthKit.Constants.Permissions.BloodGlucose,
            AppleHealthKit.Constants.Permissions.SleepAnalysis,
            AppleHealthKit.Constants.Permissions.Steps,
            AppleHealthKit.Constants.Permissions.FlightsClimbed,
            AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
            AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
            AppleHealthKit.Constants.Permissions.Steps,
            AppleHealthKit.Constants.Permissions.StepCount,
            AppleHealthKit.Constants.Permissions.FlightsClimbed,
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

    //TODO: will be implemented in the future
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [bloodGlucose, setBloodGlucose] =
        useState<HealthData["bloodGlucose"]>(0);
    const [sleepAnalysis, setSleepAnalysis] = useState<
        HealthData["sleepAnalysis"]
    >({
        totalSleepValue: null,
        sleepSteps: [],
    });
    const [stepCount, setStepCount] = useState<HealthData["stepCount"]>(0);
    const [steps, setSteps] = useState<HealthData["steps"]>(null);
    const [flights, setFlights] = useState<HealthData["flights"]>(null);
    const [distance, setDistance] = useState<HealthData["distance"]>(null);
    const [activeEnergyBurned, setActiveEnergyBurned] =
        useState<HealthData["activeEnergyBurned"]>(null);

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
                // console.error("Apple Health not available or error:", err);
                return;
            }

            AppleHealthKit.initHealthKit(permissions, (initError) => {
                if (initError) {
                    // console.error("HealthKit init error:", initError);
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
                // console.error("Error fetching heart rate samples:", err);
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
                    return;
                }

                const sortedResults = results
                    .sort(
                        (a, b) =>
                            new Date(a.startDate).getTime() -
                            new Date(b.startDate).getTime(),
                    )
                    .map((sample, index) => {
                        return {
                            value: sample.value,
                            startDate: sample.startDate,
                            endDate: sample.endDate,
                        };
                    });

                setFlights(sortedResults);
            },
        );

        AppleHealthKit.getDailyDistanceWalkingRunningSamples(
            options,
            (err, results) => {
                if (err) {
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

        AppleHealthKit.getStepCount(options, (err, results) => {
            if (err) {
                // console.error("Error fetching step count:", err);
                return;
            }
            setStepCount(results.value || 0);
        });

        AppleHealthKit.getActiveEnergyBurned(options, (err, results) => {
            if (err) {
                return;
            }

            const sortedResults = results
                .sort(
                    (a, b) =>
                        new Date(a.startDate).getTime() -
                        new Date(b.startDate).getTime(),
                )
                .map((sample, index) => {
                    // Check if value needs conversion
                    let processedValue = sample.value;
                    if (sample.value > 10000) {
                        // If value is too large, it might be in joules, convert to calories
                        processedValue = sample.value / 4184; // 1 cal = 4184 joules
                    }

                    return {
                        value: processedValue,
                        startDate: sample.startDate,
                        endDate: sample.endDate,
                    };
                });

            setActiveEnergyBurned(sortedResults);
        });

        AppleHealthKit.getSleepSamples(options, (err, results) => {
            if (err) {
                return;
            }

            const sortedResults = results.sort((a, b) => {
                return (
                    new Date(a.startDate).getTime() -
                    new Date(b.startDate).getTime()
                );
            });

            const sleepSteps: SleepAnalysis[] = sortedResults.map((sample) => ({
                value: sample.value.toString(),
                startDate: sample.startDate,
                endDate: sample.endDate,
            }));

            let totalSleepValue: SleepAnalysis | null = null;

            if (sortedResults.length > 0) {
                const startSleep = sortedResults[0].startDate;
                const endSleep =
                    sortedResults[sortedResults.length - 1].endDate;

                const startTime = new Date(startSleep).getTime();
                const endTime = new Date(endSleep).getTime();
                const totalDuration = Math.round((endTime - startTime) / 1000);

                totalSleepValue = {
                    value: "TOTAL_SLEEP",
                    startDate: startSleep,
                    endDate: endSleep,
                    duration: totalDuration,
                };
            }

            setSleepAnalysis({
                totalSleepValue,
                sleepSteps,
            });
        });
    }, [hasPermissions, dateOptions.startDate, dateOptions.endDate]);

    return {
        heartRate,
        bloodGlucose,
        sleepAnalysis,
        stepCount,
        steps,
        flights,
        distance,
        activeEnergyBurned,
    };
};

export default useHealthData;
