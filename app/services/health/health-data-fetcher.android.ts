import {
    HeartRateRecord,
    initialize,
    readRecords,
    requestPermission,
    SleepSessionRecord,
} from "react-native-health-connect";
import { TimeRangeFilter } from "react-native-health-connect/lib/typescript/types/base.types";

import {
    DistanceRecord,
    EnergyRecord,
    FloorsClimbedRecord,
    HealthConnectResponse,
    HealthData,
    SleepStage,
    StepsRecord,
} from "@dtypes/health-data-types";

/**
 * Request Health Connect permissions (should be called once, not on every sync)
 * Returns true if initialization and permission request succeeded
 */
export const requestHealthPermissions = async (): Promise<boolean> => {
    try {
        const isInitialized = await initialize();
        if (!isInitialized) {
            return false;
        }

        const permissions = [
            { accessType: "read" as const, recordType: "Steps" as const },
            {
                accessType: "read" as const,
                recordType: "Distance" as const,
            },
            {
                accessType: "read" as const,
                recordType: "FloorsClimbed" as const,
            },
            {
                accessType: "read" as const,
                recordType: "ActiveCaloriesBurned" as const,
            },
            {
                accessType: "read" as const,
                recordType: "TotalCaloriesBurned" as const,
            },
            {
                accessType: "read" as const,
                recordType: "HeartRate" as const,
            },
            {
                accessType: "read" as const,
                recordType: "SleepSession" as const,
            },
            {
                accessType: "read" as const,
                recordType: "ExerciseSession" as const,
            },
        ];

        await requestPermission(permissions);
        return true;
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
        steps: null,
        flights: null,
        distance: null,
        activeEnergyBurned: null,
        workouts: null,
        activeMinutes: null,
    };

    try {
        const startDateTime = new Date(startDate);
        startDateTime.setHours(0, 0, 0, 0);
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);

        // Extend time range for heart rate and sleep (10 years back)
        const extendedStartDate = new Date(startDateTime);
        extendedStartDate.setFullYear(extendedStartDate.getFullYear() - 10);

        const timeRangeFilter: TimeRangeFilter = {
            operator: "between",
            startTime: startDateTime.toISOString(),
            endTime: endDateTime.toISOString(),
        };

        const extendedTimeRangeFilter: TimeRangeFilter = {
            operator: "between",
            startTime: extendedStartDate.toISOString(),
            endTime: endDateTime.toISOString(),
        };

        // Fetch all data in parallel with individual error handling
        const [
            stepsData,
            flightsData,
            distanceData,
            energyData,
            heartRateData,
            sleepData,
        ] = await Promise.all([
            readRecords("Steps", { timeRangeFilter })
                .then((data) => {
                    return data as HealthConnectResponse<StepsRecord>;
                })
                .catch((err) => {
                    return {
                        records: [],
                    } as HealthConnectResponse<StepsRecord>;
                }),
            readRecords("FloorsClimbed", { timeRangeFilter })
                .then(
                    (data) =>
                        data as HealthConnectResponse<FloorsClimbedRecord>,
                )
                .catch((err) => {
                    return {
                        records: [],
                    } as HealthConnectResponse<FloorsClimbedRecord>;
                }),
            readRecords("Distance", { timeRangeFilter })
                .then((data) => data as HealthConnectResponse<DistanceRecord>)
                .catch((err) => {
                    return {
                        records: [],
                    } as HealthConnectResponse<DistanceRecord>;
                }),
            readRecords("ActiveCaloriesBurned", { timeRangeFilter })
                .then((data) => data as HealthConnectResponse<EnergyRecord>)
                .catch((err) => {
                    return {
                        records: [],
                    } as HealthConnectResponse<EnergyRecord>;
                }),
            readRecords("HeartRate", {
                timeRangeFilter: extendedTimeRangeFilter,
            })
                .then((data) => data as HealthConnectResponse<HeartRateRecord>)
                .catch((err) => {
                    return {
                        records: [],
                    } as HealthConnectResponse<HeartRateRecord>;
                }),
            readRecords("SleepSession", {
                timeRangeFilter: extendedTimeRangeFilter,
            })
                .then(
                    (data) => data as HealthConnectResponse<SleepSessionRecord>,
                )
                .catch((err) => {
                    return {
                        records: [],
                    } as HealthConnectResponse<SleepSessionRecord>;
                }),
        ]);

        // Process steps - Transform to array format
        if (stepsData?.records && stepsData.records.length > 0) {
            result.steps = stepsData.records.map((record) => ({
                value: record.count || 0,
                startDate: record.startTime,
                endDate: record.endTime,
            }));
        }

        // Process flights - Transform to array format
        if (flightsData?.records && flightsData.records.length > 0) {
            result.flights = flightsData.records.map((record) => ({
                value: record.floors || 0,
                startDate: record.startTime,
                endDate: record.endTime,
            }));
        }

        // Process distance - Transform to array format
        if (distanceData?.records && distanceData.records.length > 0) {
            result.distance = distanceData.records.map((record) => {
                let distanceValue = 0;
                if (record.distance) {
                    if (typeof record.distance === "number") {
                        distanceValue = record.distance;
                    } else if (record.distance.inMeters !== undefined) {
                        distanceValue = record.distance.inMeters;
                    }
                }
                return {
                    value: distanceValue,
                    startDate: record.startTime,
                    endDate: record.endTime,
                };
            });
        }

        // Process energy - Transform to array format
        if (energyData?.records && energyData.records.length > 0) {
            result.activeEnergyBurned = energyData.records.map((record) => {
                let calorieValue = 0;
                if (record.energy) {
                    if (typeof record.energy === "number") {
                        calorieValue = record.energy;
                    } else if (record.energy.inKilocalories !== undefined) {
                        calorieValue = record.energy.inKilocalories;
                    } else if (record.energy.inCalories !== undefined) {
                        calorieValue = record.energy.inCalories;
                    }
                }
                return {
                    value: calorieValue,
                    startDate: record.startTime,
                    endDate: record.endTime,
                };
            });
        }

        // Process heart rate
        if (heartRateData?.records && heartRateData.records.length > 0) {
            const allSamples: {
                value: number;
                startDate: string;
                endDate: string;
            }[] = [];

            heartRateData.records.forEach((record) => {
                if (record.samples && Array.isArray(record.samples)) {
                    record.samples.forEach((sample) => {
                        allSamples.push({
                            value: sample.beatsPerMinute,
                            startDate: sample.time,
                            endDate: sample.time,
                        });
                    });
                }
            });

            if (allSamples.length > 0) {
                // Sort by date descending (newest first)
                allSamples.sort(
                    (a, b) =>
                        new Date(b.startDate).getTime() -
                        new Date(a.startDate).getTime(),
                );

                result.heartRate = {
                    lastHeartRateValue: allSamples[0], // Return the object, not just the value
                    values: allSamples,
                };
            }
        }

        // Process sleep
        if (sleepData?.records && sleepData.records.length > 0) {
            const STAGE_MAP: Record<number, SleepStage["type"]> = {
                0: "unknown",
                1: "awake",
                2: "sleeping",
                3: "out_of_bed",
                4: "light",
                5: "deep",
                6: "rem",
            };

            const sleepSessions = sleepData.records
                .map((record) => {
                    const start = new Date(record.startTime);
                    const end = new Date(record.endTime);
                    const duration = (end.getTime() - start.getTime()) / 1000;

                    // Process sleep stages if available
                    const stages: SleepStage[] = [];
                    if (record.stages && Array.isArray(record.stages)) {
                        record.stages.forEach((stage) => {
                            const stageStart = new Date(stage.startTime);
                            const stageEnd = new Date(stage.endTime);
                            const stageDuration =
                                (stageEnd.getTime() - stageStart.getTime()) /
                                1000;

                            stages.push({
                                type: STAGE_MAP[stage.stage] || "unknown",
                                startTime: stage.startTime,
                                endTime: stage.endTime,
                                duration: stageDuration,
                            });
                        });
                    }

                    return {
                        value: "ASLEEP",
                        startDate: record.startTime,
                        endDate: record.endTime,
                        duration,
                        stages: stages.length > 0 ? stages : undefined,
                    };
                })
                .sort(
                    (a, b) =>
                        new Date(b.endDate).getTime() -
                        new Date(a.endDate).getTime(),
                );

            if (sleepSessions.length > 0) {
                const latestSession = sleepSessions[0];

                result.sleepAnalysis = {
                    totalSleepValue: latestSession,
                    sleepSteps: sleepSessions,
                };
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        //console.error("Error fetching health data:", error);
    }

    return result;
};
