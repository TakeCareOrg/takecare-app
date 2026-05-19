import {
    HealthKitCategoryType,
    HealthKitModule,
    HealthKitQuantityType,
    type WorkoutDataPoint,
} from "@takecareorg/takecare-healthkit";

import {
    BasesHealthValue,
    HealthData,
    SleepAnalysis,
    SleepStage,
    WorkoutData,
} from "@dtypes/health-data-types";

/**
 * Health Connect's [SleepSessionRecord.Stage] integer codes are forwarded by the
 * Kotlin side as iOS-style numeric values (see CategoryMapper.kt: sleepStageToIosValue).
 * This keeps the JS reader symmetrical with `fetch-health-data.ios.ts`.
 */
const STAGE_MAP: Record<number, SleepStage["type"]> = {
    0: "out_of_bed",
    1: "sleeping",
    2: "awake",
    3: "light",
    4: "deep",
    5: "rem",
};

const sortAndMapSamples = (
    samples: { value: number; startDate: Date; endDate: Date }[],
    order: "asc" | "desc" = "asc",
): BasesHealthValue[] =>
    samples
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

/**
 * Android health data ingest. Backed by Health Connect via the native Kotlin module
 * (`@takecareorg/takecare-healthkit` ≥ 2.2.0). The shape it produces is identical to
 * `fetch-health-data.ios.ts` — same `HealthData` interface, same units, same coding for
 * sleep stages — so the callers in `health-sync.ts` and the home/charts screens do not
 * need to branch.
 *
 * Notable differences with the previous `react-native-health-connect` implementation:
 *   - Permissions and initialisation are delegated to the native module
 *     (`requestAuthorization` / `isHealthKitAvailable`) and cached natively.
 *   - Each call is cached for `CACHE_TTL_SECONDS` natively to avoid hammering HC when
 *     `health-sync.ts` triggers multiple refetches.
 *   - Workouts come back already shaped as `WorkoutDataPoint`, matching iOS.
 */
const CACHE_TTL_SECONDS = 60;

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
        const isAvailable = await HealthKitModule.isHealthKitAvailable();
        if (!isAvailable) {
            return result;
        }

        // No-op on Android when permissions are already granted; reports the current state.
        await HealthKitModule.requestAuthorization().catch(() => false);

        const startDateTime = new Date(startDate);
        startDateTime.setHours(0, 0, 0, 0);
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);

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
            HealthKitModule.getQuantityData(
                HealthKitQuantityType.HEART_RATE,
                startDateTime,
                endDateTime,
                undefined,
                true,
                CACHE_TTL_SECONDS,
            ).catch(() => []),

            // Steps / Distance / Floors / ActiveEnergy are all *cumulative*
            // quantities: when several sources (Samsung Health, Google
            // Fit, Fitbit…) all sync to Health Connect, summing the raw
            // records double- or triple-counts the same activity. We
            // therefore ask the native module for HC's
            // `aggregateGroupByPeriod` daily buckets, which apply the
            // user's data-priority list and dedupe per day.
            HealthKitModule.getQuantityData(
                HealthKitQuantityType.STEPS,
                startDateTime,
                endDateTime,
                "daily",
                true,
                CACHE_TTL_SECONDS,
            ).catch(() => []),

            HealthKitModule.getAggregatedQuantity(
                HealthKitQuantityType.STEPS,
                startDateTime,
                endDateTime,
                "sum",
                true,
                CACHE_TTL_SECONDS,
            ).catch(() => 0),

            HealthKitModule.getQuantityData(
                HealthKitQuantityType.FLIGHTS_CLIMBED,
                startDateTime,
                endDateTime,
                "daily",
                true,
                CACHE_TTL_SECONDS,
            ).catch(() => []),

            HealthKitModule.getQuantityData(
                HealthKitQuantityType.DISTANCE_WALKING_RUNNING,
                startDateTime,
                endDateTime,
                "daily",
                true,
                CACHE_TTL_SECONDS,
            ).catch(() => []),

            HealthKitModule.getQuantityData(
                HealthKitQuantityType.ACTIVE_ENERGY_BURNED,
                startDateTime,
                endDateTime,
                "daily",
                true,
                CACHE_TTL_SECONDS,
            ).catch(() => []),

            HealthKitModule.getCategoryData(
                HealthKitCategoryType.SLEEP_ANALYSIS,
                startDateTime,
                endDateTime,
                true,
                CACHE_TTL_SECONDS,
            ).catch(() => []),

            // Health Connect does not have a 1:1 equivalent of APPLE_EXERCISE_TIME;
            // we derive active minutes from ExerciseSessionRecord durations (see below).
            Promise.resolve(
                [] as { value: number; startDate: Date; endDate: Date }[],
            ),

            HealthKitModule.getWorkouts(
                startDateTime,
                endDateTime,
                true,
                CACHE_TTL_SECONDS,
            ).catch(() => []),
        ]);

        if (heartRateSamples.length > 0) {
            const sortedHeartRate = sortAndMapSamples(heartRateSamples);
            result.heartRate = {
                lastHeartRateValue: sortedHeartRate[0] || null,
                values: sortedHeartRate,
            };
        }

        if (stepSamples.length > 0) {
            // Step samples here are HC-deduplicated daily buckets (one
            // entry per day, value = total steps recorded by the
            // priority-source for that day). The Steps detail screen
            // wants to exclude steps that happened *during* a workout
            // that wasn't walking — running/cycling/swimming/yoga
            // sessions register their own dedicated metric (active
            // minutes, distance, BPM) and counting them as "walking
            // steps" double-attributes them. Walking workouts stay in
            // the count by design.
            //
            // iOS HKWorkoutActivityType for Walking = 52. The Kotlin
            // module exposes the same numeric ID for parity, so the
            // filter works the same on both platforms.
            const HK_WALKING = 52;
            const nonWalkingWorkouts = (workoutSamples ?? []).filter(
                (w: WorkoutDataPoint) => w.workoutActivityType !== HK_WALKING,
            );

            // Fetch the HC-deduplicated step count *inside* each
            // non-walking workout window — same `getAggregatedQuantity`
            // path the daily totals use, so the subtraction is in the
            // same unit/source resolution as the daily total.
            const workoutStepDeductions = await Promise.all(
                nonWalkingWorkouts.map((w: WorkoutDataPoint) =>
                    HealthKitModule.getAggregatedQuantity(
                        HealthKitQuantityType.STEPS,
                        new Date(w.startDate),
                        new Date(w.endDate),
                        "sum",
                        true,
                        CACHE_TTL_SECONDS,
                    ).catch(() => 0),
                ),
            );

            const deductionsByDay = new Map<number, number>();
            nonWalkingWorkouts.forEach((w: WorkoutDataPoint, i: number) => {
                const dayKey = new Date(w.startDate).setHours(0, 0, 0, 0);
                deductionsByDay.set(
                    dayKey,
                    (deductionsByDay.get(dayKey) ?? 0) +
                        (workoutStepDeductions[i] ?? 0),
                );
            });

            const adjusted = sortAndMapSamples(stepSamples).map((sample) => {
                const dayKey = new Date(sample.startDate).setHours(0, 0, 0, 0);
                const deduction = deductionsByDay.get(dayKey) ?? 0;
                return {
                    ...sample,
                    value: Math.max(0, sample.value - deduction),
                };
            });
            result.steps = adjusted.filter((s) => s.value > 0);

            const totalDeduction = workoutStepDeductions.reduce(
                (sum, n) => sum + (n ?? 0),
                0,
            );
            result.stepCount = Math.max(
                0,
                Math.round(totalSteps - totalDeduction),
            );
        }

        if (flightSamples.length > 0) {
            result.flights = sortAndMapSamples(flightSamples);
        }

        if (distanceSamples.length > 0) {
            result.distance = sortAndMapSamples(distanceSamples);
        }

        if (energySamples.length > 0) {
            result.activeEnergyBurned = sortAndMapSamples(energySamples);
        }

        if (sleepSamples.length > 0) {
            // The Kotlin side already unrolls SleepSessionRecord.stages into one sample
            // per stage, encoded with iOS-style integer codes. We just need to group them
            // back into sessions (≤ 30 min gap between stages = same session), matching
            // exactly what `fetch-health-data.ios.ts` does.
            const stagesByTime = [...sleepSamples].sort(
                (a, b) =>
                    new Date(a.startDate).getTime() -
                    new Date(b.startDate).getTime(),
            );

            const allStages = stagesByTime.map((sample) => {
                const stageType = STAGE_MAP[sample.value] ?? "unknown";
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

            const sessions: {
                startDate: string;
                endDate: string;
                stages: typeof allStages;
            }[] = [];
            let currentSession: (typeof sessions)[0] | null = null;
            for (const stage of allStages) {
                if (!currentSession) {
                    currentSession = {
                        startDate: stage.startTime,
                        endDate: stage.endTime,
                        stages: [stage],
                    };
                } else {
                    const lastStage =
                        currentSession.stages[currentSession.stages.length - 1];
                    const lastStageEnd = new Date(lastStage.endTime).getTime();
                    const currentStageStart = new Date(
                        stage.startTime,
                    ).getTime();
                    const gapMinutes =
                        (currentStageStart - lastStageEnd) / 1000 / 60;
                    if (gapMinutes <= 30) {
                        currentSession.endDate = stage.endTime;
                        currentSession.stages.push(stage);
                    } else {
                        sessions.push(currentSession);
                        currentSession = {
                            startDate: stage.startTime,
                            endDate: stage.endTime,
                            stages: [stage],
                        };
                    }
                }
            }
            if (currentSession) sessions.push(currentSession);

            const sleepSteps: SleepAnalysis[] = sessions
                .map((session) => {
                    const actualSleepStages = session.stages.filter(
                        (s) => s.type !== "awake" && s.type !== "out_of_bed",
                    );
                    const totalSleepSeconds = actualSleepStages.reduce(
                        (sum, s) => sum + s.duration,
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
                .filter((s) => (s.duration ?? 0) >= 60);

            sleepSteps.sort(
                (a, b) =>
                    new Date(a.endDate).getTime() -
                    new Date(b.endDate).getTime(),
            );

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

        // Health Connect-derived active minutes: sum of exercise session durations.
        if (workoutSamples.length > 0) {
            result.activeMinutes = workoutSamples.map(
                (sample: WorkoutDataPoint) => {
                    const start = new Date(sample.startDate).getTime();
                    const end = new Date(sample.endDate).getTime();
                    return {
                        value: Math.round((end - start) / 1000 / 60),
                        startDate: sample.startDate.toISOString(),
                        endDate: sample.endDate.toISOString(),
                    };
                },
            );
        } else if (exerciseTimeSamples.length > 0) {
            result.activeMinutes = exerciseTimeSamples.map((s) => ({
                value: Math.round(s.value || 0),
                startDate: s.startDate.toISOString(),
                endDate: s.endDate.toISOString(),
            }));
        } else {
            result.activeMinutes = [];
        }

        if (workoutSamples.length > 0) {
            const sortedWorkouts: WorkoutData[] = workoutSamples
                .slice()
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
        // Mirror iOS: never throw — the consumer expects a HealthData envelope (possibly empty).
    }

    return result;
};
