import { useCallback, useEffect, useMemo, useState } from "react";
import { initialize, readRecords } from "react-native-health-connect";
import { TimeRangeFilter } from "react-native-health-connect/lib/typescript/types/base.types";

import {
    DistanceRecord,
    EnergyRecord,
    FloorsClimbedRecord,
    HealthConnectResponse,
    HealthData,
    StepsRecord,
} from "@dtypes/health-data-types";

const useHealthData = ({
    startDate,
    endDate,
}: {
    startDate: string | Date;
    endDate: string | Date;
}): HealthData => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [heartRate, setHeartRate] = useState<HealthData["heartRate"]>({
        lastHeartRateValue: null,
        values: [],
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

            const timeRangeFilter: TimeRangeFilter = {
                operator: "between",
                startTime: new Date(startDateCopy).toISOString(),
                endTime: new Date(endDateCopy).toISOString(),
            };

            // Step 4: Fetch Steps Data
            await fetchStepsData(timeRangeFilter);

            // Step 5: Fetch Distance Data
            await fetchDistanceData(timeRangeFilter);

            // Step 6: Fetch Floors Data
            await fetchFloorsData(timeRangeFilter);

            // Step 7: Fetch Calories Data
            await fetchCaloriesData(timeRangeFilter);
        } catch {
            //pass
        }
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
        } catch {
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
        } catch {
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
        } catch {
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
                } catch {
                    setActiveEnergyBurned([]);
                }
            }
        } catch {
            setActiveEnergyBurned([]);
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
    };
};

export default useHealthData;
