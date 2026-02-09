import { useCallback, useEffect, useMemo, useState } from "react";
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

const useHealthData = ({
    startDate,
    endDate,
}: {
    startDate: string | Date;
    endDate: string | Date;
}): HealthData => {
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
    const [steps, setSteps] = useState<HealthData["steps"]>(null);
    const [flights, setFlights] = useState<HealthData["flights"]>(null);
    const [distance, setDistance] = useState<HealthData["distance"]>(null);
    const [activeEnergyBurned, setActiveEnergyBurned] =
        useState<HealthData["activeEnergyBurned"]>(null);
    const [workouts] = useState<HealthData["workouts"]>(null);
    const [activeMinutes] = useState<HealthData["activeMinutes"]>(null);

    const startDateCopy = useMemo(
        () => new Date(startDate).setHours(0, 0, 0, 0),
        [startDate],
    );
    const endDateCopy = useMemo(
        () => new Date(endDate).setHours(23, 59, 59, 999),
        [endDate],
    );

    const readSampleData = useCallback(async () => {
        try {
            // Step 1: Initialize Health Connect
            const isInitialized = await initialize();

            if (!isInitialized) {
                return;
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

            try {
                await requestPermission(permissions);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (permError) {}

            const timeRangeFilter: TimeRangeFilter = {
                operator: "between",
                startTime: new Date(startDateCopy).toISOString(),
                endTime: new Date(endDateCopy).toISOString(),
            };

            // Fetch all data types
            // For general steps/distance/calories which are accumulative for the day, we keep the requested day range.
            await fetchStepsData(timeRangeFilter);

            await fetchDistanceData(timeRangeFilter);

            // Step 6: Fetch Floors Data
            await fetchFloorsData(timeRangeFilter);

            // Step 7: Fetch Calories Data
            await fetchCaloriesData(timeRangeFilter);

            // For Heart Rate and Sleep, fetch ALL historical data
            // Go back 10 years to capture all available records
            const tenYearsAgo = new Date(startDateCopy);
            tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);

            const extendedTimeRangeFilter: TimeRangeFilter = {
                operator: "between",
                startTime: tenYearsAgo.toISOString(),
                endTime: timeRangeFilter.endTime,
            };

            // Step 8: Fetch Heart Rate Data
            await fetchHeartRateData(extendedTimeRangeFilter);

            // Step 9: Fetch Sleep Data
            await fetchSleepData(extendedTimeRangeFilter);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {}
    }, [startDateCopy, endDateCopy]);

    const fetchStepsData = async (timeRangeFilter: TimeRangeFilter) => {
        try {
            const stepsData = (await readRecords("Steps", {
                timeRangeFilter,
            })) as HealthConnectResponse<StepsRecord>;

            if (stepsData?.records && stepsData.records.length > 0) {
                const processedSteps = stepsData.records.map(
                    (record: StepsRecord) => ({
                        value: record.count || 0,
                        startDate: record.startTime,
                        endDate: record.endTime,
                    }),
                );
                setSteps(processedSteps);
            } else {
                setSteps([]);
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setSteps([]);
        }
    };

    const fetchDistanceData = async (timeRangeFilter: TimeRangeFilter) => {
        try {
            const distanceData = (await readRecords("Distance", {
                timeRangeFilter,
            })) as HealthConnectResponse<DistanceRecord>;

            if (distanceData?.records && distanceData.records.length > 0) {
                const processedDistance = distanceData.records.map(
                    (record: DistanceRecord) => {
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
                    },
                );
                setDistance(processedDistance);
            } else {
                setDistance([]);
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setDistance([]);
        }
    };

    const fetchFloorsData = async (timeRangeFilter: TimeRangeFilter) => {
        try {
            const floorsData = (await readRecords("FloorsClimbed", {
                timeRangeFilter,
            })) as HealthConnectResponse<FloorsClimbedRecord>;

            if (floorsData?.records && floorsData.records.length > 0) {
                const processedFloors = floorsData.records.map(
                    (record: FloorsClimbedRecord, index: number) => {
                        let floorValue = 0;

                        // Try different possible field names
                        if (record.floors !== undefined) {
                            floorValue = record.floors;
                        } else if (record.count !== undefined) {
                            floorValue = record.count;
                        } else if (record.floorsClimbed !== undefined) {
                            floorValue = record.floorsClimbed;
                        }

                        return {
                            value: floorValue,
                            startDate: record.startTime,
                            endDate: record.endTime,
                        };
                    },
                );

                setFlights(processedFloors);
            } else {
                setFlights([]);
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setFlights([]);
        }
    };

    const fetchCaloriesData = async (timeRangeFilter: TimeRangeFilter) => {
        try {
            const activeCaloriesData = (await readRecords(
                "ActiveCaloriesBurned",
                { timeRangeFilter },
            )) as HealthConnectResponse<EnergyRecord>;

            if (
                activeCaloriesData?.records &&
                activeCaloriesData.records.length > 0
            ) {
                const processedCalories = activeCaloriesData.records.map(
                    (record: EnergyRecord) => {
                        let calorieValue = 0;

                        if (record.energy) {
                            if (typeof record.energy === "number") {
                                calorieValue = record.energy;
                            } else if (record.energy.inCalories !== undefined) {
                                calorieValue = record.energy.inCalories;
                            } else if (
                                record.energy.inKilocalories !== undefined
                            ) {
                                calorieValue =
                                    record.energy.inKilocalories * 1000; // Convert to calories
                            } else if (record.energy.inJoules !== undefined) {
                                calorieValue = record.energy.inJoules / 4.184; // Convert joules to calories
                            } else if (
                                record.energy.inKilojoules !== undefined
                            ) {
                                calorieValue =
                                    (record.energy.inKilojoules * 1000) / 4.184; // Convert kilojoules to calories
                            }
                        }

                        return {
                            value: calorieValue,
                            startDate: record.startTime,
                            endDate: record.endTime,
                        };
                    },
                );

                setActiveEnergyBurned(processedCalories);
            } else {
                // Try TotalCaloriesBurned as fallback
                try {
                    const totalCaloriesData = (await readRecords(
                        "TotalCaloriesBurned",
                        { timeRangeFilter },
                    )) as HealthConnectResponse<EnergyRecord>;

                    if (
                        totalCaloriesData?.records &&
                        totalCaloriesData.records.length > 0
                    ) {
                        const processedTotalCalories =
                            totalCaloriesData.records.map(
                                (record: EnergyRecord) => {
                                    let calorieValue = 0;

                                    if (record.energy) {
                                        if (typeof record.energy === "number") {
                                            calorieValue = record.energy;
                                        } else if (
                                            record.energy.inCalories !==
                                            undefined
                                        ) {
                                            calorieValue =
                                                record.energy.inCalories;
                                        } else if (
                                            record.energy.inKilocalories !==
                                            undefined
                                        ) {
                                            calorieValue =
                                                record.energy.inKilocalories *
                                                1000; // Convert to calories
                                        } else if (
                                            record.energy.inJoules !== undefined
                                        ) {
                                            calorieValue =
                                                record.energy.inJoules / 4.184; // Convert joules to calories
                                        } else if (
                                            record.energy.inKilojoules !==
                                            undefined
                                        ) {
                                            calorieValue =
                                                (record.energy.inKilojoules *
                                                    1000) /
                                                4.184; // Convert kilojoules to calories
                                        }
                                    }

                                    return {
                                        value: calorieValue,
                                        startDate: record.startTime,
                                        endDate: record.endTime,
                                    };
                                },
                            );

                        setActiveEnergyBurned(processedTotalCalories);
                    } else {
                        setActiveEnergyBurned([]);
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (error) {
                    setActiveEnergyBurned([]);
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setActiveEnergyBurned([]);
        }
    };

    const fetchHeartRateData = async (timeRangeFilter: TimeRangeFilter) => {
        try {
            const heartRateData = (await readRecords("HeartRate", {
                timeRangeFilter,
            })) as HealthConnectResponse<HeartRateRecord>;

            if (heartRateData?.records && heartRateData.records.length > 0) {
                const allSamples: {
                    value: number;
                    startDate: string;
                    endDate: string;
                }[] = [];

                heartRateData.records.forEach((record) => {
                    record.samples.forEach((sample) => {
                        allSamples.push({
                            value: sample.beatsPerMinute,
                            startDate: sample.time,
                            endDate: sample.time,
                        });
                    });
                });

                // Sort by date descending (newest first)
                allSamples.sort(
                    (a, b) =>
                        new Date(b.startDate).getTime() -
                        new Date(a.startDate).getTime(),
                );

                setHeartRate({
                    lastHeartRateValue: allSamples[0] || null,
                    values: allSamples,
                });
            } else {
                setHeartRate({ lastHeartRateValue: null, values: [] });
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            //console.error("Error fetching heart rate:", error);
            setHeartRate({ lastHeartRateValue: null, values: [] });
        }
    };

    const fetchSleepData = async (timeRangeFilter: TimeRangeFilter) => {
        try {
            const sleepData = (await readRecords("SleepSession", {
                timeRangeFilter: timeRangeFilter,
            })) as HealthConnectResponse<SleepSessionRecord>;

            if (sleepData?.records && sleepData.records.length > 0) {
                // If we fetched a large window, we might have multiple nights.
                // We likely want the *latets* night for the statistics on Home page,
                // OR all nights for the Sleep page chart.

                const STAGE_MAP: Record<number, SleepStage["type"]> = {
                    0: "unknown",
                    1: "awake",
                    2: "sleeping",
                    3: "out_of_bed",
                    4: "light",
                    5: "deep",
                    6: "rem",
                };

                const processedSleep = sleepData.records.map((record) => {
                    const startRecord = new Date(record.startTime).getTime();
                    const end = new Date(record.endTime).getTime();
                    const durationInSeconds = (end - startRecord) / 1000;

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
                        duration: durationInSeconds, // Duration in seconds
                        stages: stages.length > 0 ? stages : undefined,
                    };
                });

                // Sort by endDate (wake up time) in chronological order for charts
                processedSleep.sort(
                    (a, b) =>
                        new Date(a.endDate).getTime() -
                        new Date(b.endDate).getTime(),
                );

                // Get the latest session (last one after sorting)
                const latestSession = processedSleep[processedSleep.length - 1];

                setSleepAnalysis({
                    totalSleepValue: latestSession,
                    sleepSteps: processedSleep,
                });
            } else {
                setSleepAnalysis({ totalSleepValue: null, sleepSteps: [] });
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            //console.error("Error fetching sleep data:", error);
            setSleepAnalysis({ totalSleepValue: null, sleepSteps: [] });
        }
    };

    useEffect(() => {
        readSampleData();
    }, [readSampleData]);

    return {
        heartRate,
        sleepAnalysis,
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
        steps: null,
        flights: null,
        distance: null,
        activeEnergyBurned: null,
        workouts: null,
        activeMinutes: null,
    };

    try {
        // Initialize Health Connect first
        const isInitialized = await initialize();
        if (!isInitialized) {
            //console.error("Health Connect not initialized");
            return result;
        }

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

        // Fetch all data in parallel
        const [
            stepsData,
            flightsData,
            distanceData,
            energyData,
            heartRateData,
            sleepData,
        ] = await Promise.all([
            readRecords("Steps", { timeRangeFilter }) as Promise<
                HealthConnectResponse<StepsRecord>
            >,
            readRecords("FloorsClimbed", { timeRangeFilter }) as Promise<
                HealthConnectResponse<FloorsClimbedRecord>
            >,
            readRecords("Distance", { timeRangeFilter }) as Promise<
                HealthConnectResponse<DistanceRecord>
            >,
            readRecords("ActiveCaloriesBurned", { timeRangeFilter }) as Promise<
                HealthConnectResponse<EnergyRecord>
            >,
            readRecords("HeartRate", {
                timeRangeFilter: extendedTimeRangeFilter,
            }) as Promise<HealthConnectResponse<HeartRateRecord>>,
            readRecords("SleepSession", {
                timeRangeFilter: extendedTimeRangeFilter,
            }) as Promise<HealthConnectResponse<SleepSessionRecord>>,
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

export default useHealthData;
export { useHealthData };
