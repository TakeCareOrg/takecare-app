import {
    HealthKitCategoryType,
    HealthKitModule,
    HealthKitQuantityType,
    type WorkoutDataPoint,
} from "@takecareorg/takecare-healthkit";
import { useEffect, useMemo, useState } from "react";

import {
    HealthData,
    SleepAnalysis,
    WorkoutData,
} from "@app/types/health-data-types";

/**
 * Map HealthKit sleep stage values to readable strings
 * https://developer.apple.com/documentation/healthkit/hkcategoryvaluesleepanalysis
 */
const mapSleepStageValue = (
    value: number,
):
    | "unknown"
    | "awake"
    | "sleeping"
    | "out_of_bed"
    | "light"
    | "deep"
    | "rem" => {
    switch (value) {
        case 0:
            return "out_of_bed"; // inBed
        case 1:
            return "sleeping"; // asleepUnspecified
        case 2:
            return "awake";
        case 3:
            return "light"; // asleepCore (mapping to light since no "core" in type)
        case 4:
            return "deep"; // asleepDeep
        case 5:
            return "rem"; // asleepREM
        default:
            // Unknown sleep stage value
            return "unknown";
    }
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
    const [workouts, setWorkouts] = useState<HealthData["workouts"]>(null);
    const [activeMinutes, setActiveMinutes] =
        useState<HealthData["activeMinutes"]>(null);

    const dateOptions = useMemo(() => {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        return {
            startDate: start,
            endDate: end,
        };
    }, [startDate, endDate]);

    // Initialize HealthKit
    useEffect(() => {
        const initHealthKit = async () => {
            try {
                const isAvailable =
                    await HealthKitModule.isHealthKitAvailable();
                if (!isAvailable) {
                    return;
                }

                const authorized = await HealthKitModule.requestAuthorization();
                setHasPermission(authorized);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {}
        };

        initHealthKit();
    }, []);

    // Fetch all health data when permissions are granted
    useEffect(() => {
        if (!hasPermissions) return;

        const fetchHealthData = async () => {
            try {
                // Fetch heart rate samples
                const heartRateSamples = await HealthKitModule.getQuantityData(
                    HealthKitQuantityType.HEART_RATE,
                    dateOptions.startDate,
                    dateOptions.endDate,
                    undefined, // no aggregation - use undefined instead of null
                    true, // use cache
                    60, // cache TTL
                );

                if (heartRateSamples.length > 0) {
                    const sortedHeartRate = heartRateSamples
                        .sort(
                            (a, b) =>
                                new Date(b.startDate).getTime() -
                                new Date(a.startDate).getTime(),
                        )
                        .map((sample) => ({
                            value: sample.value,
                            startDate: sample.startDate.toISOString(),
                            endDate: sample.endDate.toISOString(),
                        }));

                    setHeartRate({
                        lastHeartRateValue: sortedHeartRate[0] || null,
                        values: sortedHeartRate,
                    });
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                //console.error("Error fetching heart rate:", error);
            }

            try {
                // Test with legacy method first
                const totalStepsLegacy = await HealthKitModule.getSteps(
                    dateOptions.startDate,
                    dateOptions.endDate,
                );
                setStepCount(Math.round(totalStepsLegacy));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                // console.error("❌ Error fetching steps (legacy):", error);
            }

            try {
                // Fetch step count samples
                const stepSamples = await HealthKitModule.getQuantityData(
                    HealthKitQuantityType.STEPS,
                    dateOptions.startDate,
                    dateOptions.endDate,
                    undefined, // Use undefined instead of null
                    true,
                    60,
                );

                if (stepSamples.length > 0) {
                    const sortedSteps = stepSamples
                        .sort(
                            (a, b) =>
                                new Date(a.startDate).getTime() -
                                new Date(b.startDate).getTime(),
                        )
                        .map((sample) => ({
                            value: sample.value,
                            startDate: sample.startDate.toISOString(),
                            endDate: sample.endDate.toISOString(),
                        }));

                    setSteps(sortedSteps);

                    // Calculate total step count
                    const totalSteps =
                        await HealthKitModule.getAggregatedQuantity(
                            HealthKitQuantityType.STEPS,
                            dateOptions.startDate,
                            dateOptions.endDate,
                            "sum",
                            true,
                            60,
                        );
                    setStepCount(Math.round(totalSteps));
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                //console.error("Error fetching steps:", error);
            }

            try {
                // Fetch flights climbed
                const flightSamples = await HealthKitModule.getQuantityData(
                    HealthKitQuantityType.FLIGHTS_CLIMBED,
                    dateOptions.startDate,
                    dateOptions.endDate,
                    undefined,
                    true,
                    60,
                );

                if (flightSamples.length > 0) {
                    const sortedFlights = flightSamples
                        .sort(
                            (a, b) =>
                                new Date(a.startDate).getTime() -
                                new Date(b.startDate).getTime(),
                        )
                        .map((sample) => ({
                            value: sample.value,
                            startDate: sample.startDate.toISOString(),
                            endDate: sample.endDate.toISOString(),
                        }));

                    setFlights(sortedFlights);
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                // console.error("Error fetching flights:", error);
            }

            try {
                // Fetch distance walking/running
                const distanceSamples = await HealthKitModule.getQuantityData(
                    HealthKitQuantityType.DISTANCE_WALKING_RUNNING,
                    dateOptions.startDate,
                    dateOptions.endDate,
                    undefined,
                    true,
                    60,
                );

                if (distanceSamples.length > 0) {
                    const sortedDistance = distanceSamples
                        .sort(
                            (a, b) =>
                                new Date(a.startDate).getTime() -
                                new Date(b.startDate).getTime(),
                        )
                        .map((sample) => ({
                            value: sample.value,
                            startDate: sample.startDate.toISOString(),
                            endDate: sample.endDate.toISOString(),
                        }));

                    setDistance(sortedDistance);
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                //console.error("Error fetching distance:", error);
            }

            try {
                // Fetch active energy burned
                const energySamples = await HealthKitModule.getQuantityData(
                    HealthKitQuantityType.ACTIVE_ENERGY_BURNED,
                    dateOptions.startDate,
                    dateOptions.endDate,
                    undefined,
                    true,
                    60,
                );

                if (energySamples.length > 0) {
                    const sortedEnergy = energySamples
                        .sort(
                            (a, b) =>
                                new Date(a.startDate).getTime() -
                                new Date(b.startDate).getTime(),
                        )
                        .map((sample) => ({
                            value: sample.value,
                            startDate: sample.startDate.toISOString(),
                            endDate: sample.endDate.toISOString(),
                        }));

                    setActiveEnergyBurned(sortedEnergy);
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                //console.error("Error fetching active energy:", error);
            }

            try {
                // Fetch sleep analysis
                const sleepSamples = await HealthKitModule.getCategoryData(
                    HealthKitCategoryType.SLEEP_ANALYSIS,
                    dateOptions.startDate,
                    dateOptions.endDate,
                    true,
                    60,
                );

                if (sleepSamples.length > 0) {
                    const sortedSleep = sleepSamples.sort(
                        (a, b) =>
                            new Date(a.startDate).getTime() -
                            new Date(b.startDate).getTime(),
                    );

                    // Convert all samples to SleepStage format
                    const allStages = sortedSleep.map((sample) => {
                        const stageType = mapSleepStageValue(sample.value);
                        const startTime = new Date(sample.startDate).getTime();
                        const endTime = new Date(sample.endDate).getTime();
                        const durationSeconds = Math.round(
                            (endTime - startTime) / 1000,
                        );

                        return {
                            type: stageType,
                            startTime: sample.startDate.toISOString(),
                            endTime: sample.endDate.toISOString(),
                            duration: durationSeconds,
                        };
                    });

                    // Group stages into sleep sessions
                    // Two stages belong to the same session if they're within 30 minutes of each other
                    const sessions: {
                        startDate: string;
                        endDate: string;
                        stages: typeof allStages;
                    }[] = [];

                    let currentSession: (typeof sessions)[0] | null = null;

                    for (const stage of allStages) {
                        if (!currentSession) {
                            // Start new session
                            currentSession = {
                                startDate: stage.startTime,
                                endDate: stage.endTime,
                                stages: [stage],
                            };
                        } else {
                            // Check if this stage is part of current session (within 30 min gap)
                            const lastStageEnd = new Date(
                                currentSession.stages[
                                    currentSession.stages.length - 1
                                ].endTime,
                            ).getTime();
                            const currentStageStart = new Date(
                                stage.startTime,
                            ).getTime();
                            const gapMinutes =
                                (currentStageStart - lastStageEnd) / 1000 / 60;

                            if (gapMinutes <= 30) {
                                // Same session
                                currentSession.endDate = stage.endTime;
                                currentSession.stages.push(stage);
                            } else {
                                // New session - save current and start new one
                                sessions.push(currentSession);
                                currentSession = {
                                    startDate: stage.startTime,
                                    endDate: stage.endTime,
                                    stages: [stage],
                                };
                            }
                        }
                    }

                    // Don't forget to add the last session
                    if (currentSession) {
                        sessions.push(currentSession);
                    }

                    // Convert sessions to SleepAnalysis format
                    const sleepSteps: SleepAnalysis[] = sessions
                        .map((session) => {
                            // Calculate total sleep duration (excluding awake and out_of_bed)
                            const actualSleepStages = session.stages.filter(
                                (stage) =>
                                    stage.type !== "awake" &&
                                    stage.type !== "out_of_bed",
                            );

                            const totalSleepSeconds = actualSleepStages.reduce(
                                (sum, stage) => sum + stage.duration,
                                0,
                            );

                            return {
                                value: "ASLEEP",
                                startDate: session.startDate,
                                endDate: session.endDate,
                                duration: totalSleepSeconds,
                                stages: session.stages,
                            };
                        })
                        .filter((sleep) => (sleep.duration ?? 0) >= 60); // Only keep sessions with at least 1 minute of sleep

                    // Sort by endDate (wake up time)
                    sleepSteps.sort(
                        (a, b) =>
                            new Date(a.endDate).getTime() -
                            new Date(b.endDate).getTime(),
                    );

                    // Get the session with the most actual sleep (not the last one, which might be a nap or 0 duration)
                    const totalSleepValue =
                        sleepSteps.length > 0
                            ? sleepSteps.reduce((max, current) =>
                                  (current.duration ?? 0) > (max.duration ?? 0)
                                      ? current
                                      : max,
                              )
                            : null;

                    setSleepAnalysis({
                        totalSleepValue,
                        sleepSteps,
                    });
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                // console.error("Error fetching sleep analysis:", error);
            }

            try {
                // Fetch Apple Exercise Time (temps d'activité)
                const exerciseTimeSamples =
                    await HealthKitModule.getQuantityData(
                        HealthKitQuantityType.APPLE_EXERCISE_TIME,
                        dateOptions.startDate,
                        dateOptions.endDate,
                        undefined,
                        true,
                        60,
                    );

                if (exerciseTimeSamples.length > 0) {
                    // Store exercise time as array with individual samples
                    const activeMinutesSamples = exerciseTimeSamples.map(
                        (sample) => ({
                            value: Math.round(sample.value || 0),
                            startDate: sample.startDate.toISOString(),
                            endDate: sample.endDate.toISOString(),
                        }),
                    );
                    setActiveMinutes(activeMinutesSamples);
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                //console.error("Error fetching exercise time:", error);
            }

            try {
                // Fetch workouts
                const workoutSamples = await HealthKitModule.getWorkouts(
                    dateOptions.startDate,
                    dateOptions.endDate,
                    true,
                    60,
                );

                if (workoutSamples.length > 0) {
                    const sortedWorkouts: WorkoutData[] = workoutSamples
                        .sort(
                            (a: WorkoutDataPoint, b: WorkoutDataPoint) =>
                                new Date(a.startDate).getTime() -
                                new Date(b.startDate).getTime(),
                        )
                        .map((sample: WorkoutDataPoint) => {
                            const location = sample.metadata?.location as
                                | "indoor"
                                | "outdoor"
                                | undefined;

                            return {
                                workoutActivityType: sample.workoutActivityType,
                                workoutActivityName: sample.workoutActivityName,
                                duration: sample.duration,
                                totalEnergyBurned:
                                    sample.totalEnergyBurned ?? 0,
                                totalDistance: sample.totalDistance ?? 0,
                                startDate: sample.startDate.toISOString(),
                                endDate: sample.endDate.toISOString(),
                                location: location ?? "outdoor",
                                metadata: sample.metadata,
                            };
                        });

                    setWorkouts(sortedWorkouts);
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                //console.error("Error fetching workouts:", error);
            }
        };

        fetchHealthData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasPermissions, startDate, endDate]);

    return {
        heartRate,
        sleepAnalysis,
        stepCount,
        steps,
        flights,
        distance,
        activeEnergyBurned,
        workouts,
        activeMinutes,
    };
};

/**
 * Fetch health data once without using hooks (for background sync)
 */
export const fetchHealthDataOnce = async ({
    startDate,
    endDate,
}: {
    startDate: string | Date;
    endDate: string | Date;
}): Promise<HealthData> => {
    const result: HealthData = {
        heartRate: { lastHeartRateValue: null, values: [] },
        sleepAnalysis: { totalSleepValue: null, sleepSteps: [] },
        stepCount: 0,
        steps: null,
        flights: null,
        distance: null,
        activeEnergyBurned: null,
        workouts: null,
        activeMinutes: null,
    };

    try {
        // Check HealthKit availability
        const isAvailable = await HealthKitModule.isHealthKitAvailable();
        if (!isAvailable) {
            return result;
        }

        // Request authorization
        const authorized = await HealthKitModule.requestAuthorization();
        if (!authorized) {
            return result;
        }

        // Prepare date range
        const startDateTime = new Date(startDate);
        startDateTime.setHours(0, 0, 0, 0);
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);

        // Fetch all data in parallel
        const [
            heartRateSamples,
            stepSamples,
            totalSteps,
            flightSamples,
            distanceSamples,
            energySamples,
            sleepSamples,
            exerciseTimeSamples,
            workoutSamples,
        ] = await Promise.all([
            // Heart rate
            HealthKitModule.getQuantityData(
                HealthKitQuantityType.HEART_RATE,
                startDateTime,
                endDateTime,
                undefined,
                true,
                60,
            ).catch(() => []),

            // Steps samples
            HealthKitModule.getQuantityData(
                HealthKitQuantityType.STEPS,
                startDateTime,
                endDateTime,
                undefined,
                true,
                60,
            ).catch(() => []),

            // Total steps (aggregated)
            HealthKitModule.getAggregatedQuantity(
                HealthKitQuantityType.STEPS,
                startDateTime,
                endDateTime,
                "sum",
                true,
                60,
            ).catch(() => 0),

            // Flights climbed
            HealthKitModule.getQuantityData(
                HealthKitQuantityType.FLIGHTS_CLIMBED,
                startDateTime,
                endDateTime,
                undefined,
                true,
                60,
            ).catch(() => []),

            // Distance
            HealthKitModule.getQuantityData(
                HealthKitQuantityType.DISTANCE_WALKING_RUNNING,
                startDateTime,
                endDateTime,
                undefined,
                true,
                60,
            ).catch(() => []),

            // Active energy burned
            HealthKitModule.getQuantityData(
                HealthKitQuantityType.ACTIVE_ENERGY_BURNED,
                startDateTime,
                endDateTime,
                undefined,
                true,
                60,
            ).catch(() => []),

            // Sleep analysis
            HealthKitModule.getCategoryData(
                HealthKitCategoryType.SLEEP_ANALYSIS,
                startDateTime,
                endDateTime,
                true,
                60,
            ).catch(() => []),

            // Exercise time (active minutes)
            HealthKitModule.getQuantityData(
                HealthKitQuantityType.APPLE_EXERCISE_TIME,
                startDateTime,
                endDateTime,
                undefined,
                true,
                60,
            ).catch(() => []),

            // Workouts
            HealthKitModule.getWorkouts(
                startDateTime,
                endDateTime,
                true,
                60,
            ).catch(() => []),
        ]);

        // Process heart rate
        if (heartRateSamples.length > 0) {
            const sortedHeartRate = heartRateSamples
                .sort(
                    (a, b) =>
                        new Date(b.startDate).getTime() -
                        new Date(a.startDate).getTime(),
                )
                .map((sample) => ({
                    value: sample.value,
                    startDate: sample.startDate.toISOString(),
                    endDate: sample.endDate.toISOString(),
                }));

            result.heartRate = {
                lastHeartRateValue: sortedHeartRate[0] || null,
                values: sortedHeartRate,
            };
        }

        // Process steps
        if (stepSamples.length > 0) {
            const sortedSteps = stepSamples
                .sort(
                    (a, b) =>
                        new Date(a.startDate).getTime() -
                        new Date(b.startDate).getTime(),
                )
                .map((sample) => ({
                    value: sample.value,
                    startDate: sample.startDate.toISOString(),
                    endDate: sample.endDate.toISOString(),
                }));

            result.steps = sortedSteps;
            result.stepCount = Math.round(totalSteps);
        }

        // Process flights
        if (flightSamples.length > 0) {
            const sortedFlights = flightSamples
                .sort(
                    (a, b) =>
                        new Date(a.startDate).getTime() -
                        new Date(b.startDate).getTime(),
                )
                .map((sample) => ({
                    value: sample.value,
                    startDate: sample.startDate.toISOString(),
                    endDate: sample.endDate.toISOString(),
                }));

            result.flights = sortedFlights;
        }

        // Process distance
        if (distanceSamples.length > 0) {
            const sortedDistance = distanceSamples
                .sort(
                    (a, b) =>
                        new Date(a.startDate).getTime() -
                        new Date(b.startDate).getTime(),
                )
                .map((sample) => ({
                    value: sample.value,
                    startDate: sample.startDate.toISOString(),
                    endDate: sample.endDate.toISOString(),
                }));

            result.distance = sortedDistance;
        }

        // Process active energy burned
        if (energySamples.length > 0) {
            const sortedEnergy = energySamples
                .sort(
                    (a, b) =>
                        new Date(a.startDate).getTime() -
                        new Date(b.startDate).getTime(),
                )
                .map((sample) => ({
                    value: sample.value,
                    startDate: sample.startDate.toISOString(),
                    endDate: sample.endDate.toISOString(),
                }));

            result.activeEnergyBurned = sortedEnergy;
        }

        // Process sleep analysis
        if (sleepSamples.length > 0) {
            const sortedSleep = sleepSamples.sort(
                (a, b) =>
                    new Date(a.startDate).getTime() -
                    new Date(b.startDate).getTime(),
            );

            // Convert all samples to SleepStage format
            const allStages = sortedSleep.map((sample) => {
                const stageType = mapSleepStageValue(sample.value);
                const startTime = new Date(sample.startDate).getTime();
                const endTime = new Date(sample.endDate).getTime();
                const durationSeconds = Math.round(
                    (endTime - startTime) / 1000,
                );

                return {
                    type: stageType,
                    startTime: sample.startDate.toISOString(),
                    endTime: sample.endDate.toISOString(),
                    duration: durationSeconds,
                };
            });

            // Group stages into sleep sessions
            // Two stages belong to the same session if they're within 30 minutes of each other
            const sessions: {
                startDate: string;
                endDate: string;
                stages: typeof allStages;
            }[] = [];

            let currentSession: (typeof sessions)[0] | null = null;

            for (const stage of allStages) {
                if (!currentSession) {
                    // Start new session
                    currentSession = {
                        startDate: stage.startTime,
                        endDate: stage.endTime,
                        stages: [stage],
                    };
                } else {
                    // Check if this stage is part of current session (within 30 min gap)
                    const lastStage =
                        currentSession.stages[currentSession.stages.length - 1];
                    const lastStageEnd = new Date(lastStage.endTime).getTime();
                    const currentStageStart = new Date(
                        stage.startTime,
                    ).getTime();
                    const gapMinutes =
                        (currentStageStart - lastStageEnd) / 1000 / 60;

                    if (gapMinutes <= 30) {
                        // Same session
                        currentSession.endDate = stage.endTime;
                        currentSession.stages.push(stage);
                    } else {
                        // New session - save current and start new one
                        sessions.push(currentSession);
                        currentSession = {
                            startDate: stage.startTime,
                            endDate: stage.endTime,
                            stages: [stage],
                        };
                    }
                }
            }

            // Don't forget to add the last session
            if (currentSession) {
                sessions.push(currentSession);
            }

            // Convert sessions to SleepAnalysis format
            const sleepSteps: SleepAnalysis[] = sessions
                .map((session) => {
                    // Calculate total sleep duration (excluding awake and out_of_bed)
                    const actualSleepStages = session.stages.filter(
                        (stage) =>
                            stage.type !== "awake" &&
                            stage.type !== "out_of_bed",
                    );

                    const totalSleepSeconds = actualSleepStages.reduce(
                        (sum, stage) => sum + stage.duration,
                        0,
                    );

                    return {
                        value: "ASLEEP",
                        startDate: session.startDate,
                        endDate: session.endDate,
                        duration: totalSleepSeconds,
                        stages: session.stages,
                    };
                })
                .filter((sleep) => (sleep.duration ?? 0) >= 60); // Only keep sessions with at least 1 minute of sleep

            // Sort by endDate (wake up time)
            sleepSteps.sort(
                (a, b) =>
                    new Date(a.endDate).getTime() -
                    new Date(b.endDate).getTime(),
            );

            // Get the session with the most actual sleep (not the last one, which might be a nap or 0 duration)
            const totalSleepValue =
                sleepSteps.length > 0
                    ? sleepSteps.reduce((max, current) =>
                          (current.duration ?? 0) > (max.duration ?? 0)
                              ? current
                              : max,
                      )
                    : null;

            result.sleepAnalysis = {
                totalSleepValue,
                sleepSteps,
            };
        }

        // Process active minutes (exercise time)
        if (exerciseTimeSamples.length > 0) {
            result.activeMinutes = exerciseTimeSamples.map((sample) => ({
                value: Math.round(sample.value || 0),
                startDate: sample.startDate.toISOString(),
                endDate: sample.endDate.toISOString(),
            }));
        }

        // Process workouts
        if (workoutSamples.length > 0) {
            const sortedWorkouts: WorkoutData[] = workoutSamples
                .sort(
                    (a: WorkoutDataPoint, b: WorkoutDataPoint) =>
                        new Date(a.startDate).getTime() -
                        new Date(b.startDate).getTime(),
                )
                .map((sample: WorkoutDataPoint) => {
                    const location = sample.metadata?.location as
                        | "indoor"
                        | "outdoor"
                        | undefined;

                    return {
                        workoutActivityType: sample.workoutActivityType,
                        workoutActivityName: sample.workoutActivityName,
                        duration: sample.duration,
                        totalEnergyBurned: sample.totalEnergyBurned ?? 0,
                        totalDistance: sample.totalDistance ?? 0,
                        startDate: sample.startDate.toISOString(),
                        endDate: sample.endDate.toISOString(),
                        location: location ?? "outdoor",
                        metadata: sample.metadata,
                    };
                });

            result.workouts = sortedWorkouts;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        // Error fetching health data
    }

    return result;
};

export default useHealthData;
export { useHealthData };
