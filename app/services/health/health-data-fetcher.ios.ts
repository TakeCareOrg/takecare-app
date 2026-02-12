import {
    HealthKitCategoryType,
    HealthKitModule,
    HealthKitQuantityType,
    type WorkoutDataPoint,
} from "@takecareorg/takecare-healthkit";

import {
    HealthData,
    SleepAnalysis,
    WorkoutData,
} from "@app/types/health-data-types";

/**
 * Request HealthKit permissions (should be called once, not on every sync)
 * Returns true if permissions were granted
 */
export const requestHealthPermissions = async (): Promise<boolean> => {
    try {
        const isAvailable = await HealthKitModule.isHealthKitAvailable();
        if (!isAvailable) {
            return false;
        }

        const authorized = await HealthKitModule.requestAuthorization();
        return authorized;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return false;
    }
};

/**
 * Fetch health data once (for background sync)
 * Assumes permissions have already been granted via requestHealthPermissions()
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

            const sleepSteps: SleepAnalysis[] = sortedSleep.map((sample) => ({
                value: sample.value.toString(),
                startDate: sample.startDate.toISOString(),
                endDate: sample.endDate.toISOString(),
            }));

            let totalSleepValue: SleepAnalysis | null = null;

            const startSleep = sortedSleep[0].startDate.toISOString();
            const endSleep =
                sortedSleep[sortedSleep.length - 1].endDate.toISOString();

            const startTime = new Date(startSleep).getTime();
            const endTime = new Date(endSleep).getTime();
            const totalDuration = Math.round((endTime - startTime) / 1000);

            totalSleepValue = {
                value: "TOTAL_SLEEP",
                startDate: startSleep,
                endDate: endSleep,
                duration: totalDuration,
            };

            result.sleepAnalysis = {
                totalSleepValue,
                sleepSteps,
            };
        }

        // Process active minutes (exercise time)
        if (exerciseTimeSamples.length > 0) {
            const totalActiveMinutes = exerciseTimeSamples.reduce(
                (sum, sample) => sum + (sample.value || 0),
                0,
            );
            result.activeMinutes = Math.round(totalActiveMinutes);
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
