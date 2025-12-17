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

                    const sleepSteps: SleepAnalysis[] = sortedSleep.map(
                        (sample) => ({
                            value: sample.value.toString(),
                            startDate: sample.startDate.toISOString(),
                            endDate: sample.endDate.toISOString(),
                        }),
                    );

                    let totalSleepValue: SleepAnalysis | null = null;

                    const startSleep = sortedSleep[0].startDate.toISOString();
                    const endSleep =
                        sortedSleep[
                            sortedSleep.length - 1
                        ].endDate.toISOString();

                    const startTime = new Date(startSleep).getTime();
                    const endTime = new Date(endSleep).getTime();
                    const totalDuration = Math.round(
                        (endTime - startTime) / 1000,
                    );

                    totalSleepValue = {
                        value: "TOTAL_SLEEP",
                        startDate: startSleep,
                        endDate: endSleep,
                        duration: totalDuration,
                    };

                    setSleepAnalysis({
                        totalSleepValue,
                        sleepSteps,
                    });
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                //console.error("Error fetching sleep analysis:", error);
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
                    // Calculate total active minutes
                    const totalActiveMinutes = exerciseTimeSamples.reduce(
                        (sum, sample) => sum + (sample.value || 0),
                        0,
                    );
                    setActiveMinutes(Math.round(totalActiveMinutes));
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

export default useHealthData;
