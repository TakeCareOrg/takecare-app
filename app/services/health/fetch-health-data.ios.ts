import {
    HealthKitCategoryType,
    HealthKitModule,
    HealthKitQuantityType,
    type WorkoutDataPoint,
} from "@takecareorg/takecare-healthkit";

import {
    BasesHealthValue,
    BodyCompositionSlice,
    HealthData,
    SleepAnalysis,
    VitalsSlice,
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

/**
 * Sort and map samples to BasesHealthValue format
 */
const sortAndMapSamples = (
    samples: { value: number; startDate: Date; endDate: Date }[],
    order: "asc" | "desc" = "asc",
): BasesHealthValue[] => {
    return samples
        .sort((a, b) =>
            order === "asc"
                ? new Date(a.startDate).getTime() -
                  new Date(b.startDate).getTime()
                : new Date(b.startDate).getTime() -
                  new Date(a.startDate).getTime(),
        )
        .map((sample) => ({
            value: sample.value,
            startDate: sample.startDate.toISOString(),
            endDate: sample.endDate.toISOString(),
        }));
};

/**
 * Fetch health data once without using hooks (for background sync)
 */
export const fetchHealthData = async ({
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
            // Body composition + cardio vitals — same set the Android
            // path fetches. Withings still gets priority in the merge
            // layer when its slice is non-empty; these HK reads act as
            // a fallback for users without Withings.
            weightSamples,
            bodyFatSamples,
            leanMassSamples,
            heightSamples,
            systolicSamples,
            diastolicSamples,
            spo2Samples,
            hrvSamples,
            restingHrSamples,
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

            // Body composition — punctual measurements from HK
            // (Apple Health) like HC. Pulled regardless of Withings
            // connection state; the merge layer decides priority.
            HealthKitModule.getQuantityData(
                HealthKitQuantityType.BODY_MASS,
                startDateTime,
                endDateTime,
                undefined,
                true,
                60,
            ).catch(() => []),

            HealthKitModule.getQuantityData(
                HealthKitQuantityType.BODY_FAT_PERCENTAGE,
                startDateTime,
                endDateTime,
                undefined,
                true,
                60,
            ).catch(() => []),

            HealthKitModule.getQuantityData(
                HealthKitQuantityType.LEAN_BODY_MASS,
                startDateTime,
                endDateTime,
                undefined,
                true,
                60,
            ).catch(() => []),

            HealthKitModule.getQuantityData(
                HealthKitQuantityType.HEIGHT,
                startDateTime,
                endDateTime,
                undefined,
                true,
                60,
            ).catch(() => []),

            // Cardio vitals
            HealthKitModule.getQuantityData(
                HealthKitQuantityType.BLOOD_PRESSURE_SYSTOLIC,
                startDateTime,
                endDateTime,
                undefined,
                true,
                60,
            ).catch(() => []),

            HealthKitModule.getQuantityData(
                HealthKitQuantityType.BLOOD_PRESSURE_DIASTOLIC,
                startDateTime,
                endDateTime,
                undefined,
                true,
                60,
            ).catch(() => []),

            HealthKitModule.getQuantityData(
                HealthKitQuantityType.BLOOD_OXYGEN_SATURATION,
                startDateTime,
                endDateTime,
                undefined,
                true,
                60,
            ).catch(() => []),

            HealthKitModule.getQuantityData(
                HealthKitQuantityType.HEART_RATE_VARIABILITY_SDNN,
                startDateTime,
                endDateTime,
                undefined,
                true,
                60,
            ).catch(() => []),

            HealthKitModule.getQuantityData(
                HealthKitQuantityType.RESTING_HEART_RATE,
                startDateTime,
                endDateTime,
                undefined,
                true,
                60,
            ).catch(() => []),
        ]);

        // Process heart rate
        if (heartRateSamples.length > 0) {
            const sortedHeartRate = sortAndMapSamples(heartRateSamples);
            result.heartRate = {
                lastHeartRateValue: sortedHeartRate[0] || null,
                values: sortedHeartRate,
            };
        }

        // Process steps
        if (stepSamples.length > 0) {
            const sortedSteps = sortAndMapSamples(stepSamples);
            result.steps = sortedSteps;
            result.stepCount = Math.round(totalSteps);
        }

        // Process flights
        if (flightSamples.length > 0) {
            const sortedFlights = sortAndMapSamples(flightSamples);
            result.flights = sortedFlights;
        }

        // Process distance
        if (distanceSamples.length > 0) {
            const sortedDistance = sortAndMapSamples(distanceSamples);
            result.distance = sortedDistance;
        }

        // Process active energy burned
        if (energySamples.length > 0) {
            const sortedEnergy = sortAndMapSamples(energySamples);
            result.activeEnergyBurned = sortedEnergy;
        } else if (stepSamples.length > 0) {
            // Users without an Apple Watch don't get
            // ActiveEnergyBurned samples from iOS — only step counts
            // from the phone's pedometer. Estimate active kcal from
            // steps (~0.04 kcal/step for an average adult) so the
            // activity ring shows something meaningful instead of 0.
            result.activeEnergyBurned = sortAndMapSamples(stepSamples).map(
                (s) => ({ ...s, value: Math.round(s.value * 0.04) }),
            );
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
        } else if (stepSamples.length > 0) {
            // `APPLE_EXERCISE_TIME` is only populated when the user
            // wears an Apple Watch. Phone-only users get 0 from that
            // sample stream. Fall back to a step-derived estimate
            // (WHO moderate-activity threshold ≈ 100 steps/min, so
            // active_minutes ≈ steps / 100). Coarse but better than
            // a flat zero.
            result.activeMinutes = sortAndMapSamples(stepSamples).map((s) => ({
                ...s,
                value: Math.round(s.value / 100),
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

        // ── Body composition slice (HealthKit) ──
        // Same shape + derivation rules as the Android path so the
        // merge layer treats both platforms identically. See
        // `fetch-health-data.android.ts` for the rationale comments.
        const bodyComposition: BodyCompositionSlice = {};
        if (weightSamples.length > 0) {
            bodyComposition.weight = sortAndMapSamples(weightSamples);
        }
        if (bodyFatSamples.length > 0) {
            bodyComposition.fatMass = sortAndMapSamples(bodyFatSamples);
        }
        if (leanMassSamples.length > 0) {
            bodyComposition.muscleMass = sortAndMapSamples(leanMassSamples);
        }
        // HealthKit has `HKQuantityTypeIdentifierBodyMassIndex` but it
        // isn't part of our Nitro spec today — derive from weight ×
        // height like the Android path.
        if (weightSamples.length > 0 && heightSamples.length > 0) {
            const sortedHeight = sortAndMapSamples(heightSamples);
            const latestHeight = sortedHeight[sortedHeight.length - 1]?.value;
            if (latestHeight && latestHeight > 0) {
                bodyComposition.bmi = sortAndMapSamples(weightSamples).map(
                    (w) => ({
                        ...w,
                        value: w.value / (latestHeight * latestHeight),
                    }),
                );
            }
        }
        if (Object.keys(bodyComposition).length > 0) {
            result.bodyComposition = bodyComposition;
        }

        // ── Cardio vitals slice (HealthKit) ──
        const vitals: VitalsSlice = {};
        if (spo2Samples.length > 0) {
            vitals.spo2 = sortAndMapSamples(spo2Samples);
        }
        if (hrvSamples.length > 0) {
            vitals.hrv = sortAndMapSamples(hrvSamples);
        }
        if (systolicSamples.length > 0 && diastolicSamples.length > 0) {
            vitals.bloodPressure = {
                systolic: sortAndMapSamples(systolicSamples),
                diastolic: sortAndMapSamples(diastolicSamples),
            };
        }
        void restingHrSamples; // Reserved for a future restingHr slot
        if (Object.keys(vitals).length > 0) {
            result.vitals = vitals;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        // Error fetching health data
    }

    return result;
};
