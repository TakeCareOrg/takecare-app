import { useEffect, useState, useMemo, useCallback } from "react";
import {
    initialize,
    readRecords,
    requestPermission,
    getSdkStatus,
} from "react-native-health-connect";
import { TimeRangeFilter } from "react-native-health-connect/lib/typescript/types/base.types";

import { HealthData } from "@dtypes/health-data-types";

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
    const [bloodGlucose, setBloodGlucose] = useState<number>(0);
    const [sleepAnalysis, setSleepAnalysis] = useState<HealthData["sleepAnalysis"]>({
        totalSleepValue: null,
        sleepSteps: [],
    });
    const [steps, setSteps] = useState<HealthData["steps"]>(null);
    const [flights, setFlights] = useState<HealthData["flights"]>(null);
    const [distance, setDistance] = useState<HealthData["distance"]>(null);
    const [activeEnergyBurned, setActiveEnergyBurned] = useState<HealthData["activeEnergyBurned"]>(null);

    const startDateCopy = useMemo(() => new Date(startDate).setHours(0, 0, 0, 0), [startDate]);
    const endDateCopy = useMemo(() => new Date(endDate).setHours(23, 59, 59, 999), [endDate]);

    const readSampleData = useCallback(async () => {

        try {
            // Step 1: Initialize Health Connect
            const isInitialized = await initialize();
            
            if (!isInitialized) {
                return;
            }

            // Step 2: Check SDK status
            const sdkStatus = await getSdkStatus();
            
            // Step 3: Request permissions
            const permissions = [
                { accessType: "read" as const, recordType: "Steps" as const },
                { accessType: "read" as const, recordType: "Distance" as const },
                { accessType: "read" as const, recordType: "FloorsClimbed" as const },
                { accessType: "read" as const, recordType: "ActiveCaloriesBurned" as const },
                { accessType: "read" as const, recordType: "TotalCaloriesBurned" as const },
            ];
            
            const permissionResult = await requestPermission(permissions);

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

        } catch (error) {
            console.log("❌ Error in readSampleData:", error);
        }
        
    }, [startDateCopy, endDateCopy]);

    const fetchStepsData = async (timeRangeFilter: TimeRangeFilter) => {
        try {
            const stepsData = await readRecords("Steps", { timeRangeFilter });
            
            if (stepsData?.records && stepsData.records.length > 0) {
                const processedSteps = stepsData.records.map((record: any) => ({
                    value: record.count || 0,
                    startDate: record.startTime,
                    endDate: record.endTime,
                }));
                setSteps(processedSteps);
            } else {
                setSteps([]);
            }
        } catch (error) {
            setSteps([]);
        }
    };

    const fetchDistanceData = async (timeRangeFilter: TimeRangeFilter) => {
        try {
            const distanceData = await readRecords("Distance", { timeRangeFilter });
            
            if (distanceData?.records && distanceData.records.length > 0) {
                const processedDistance = distanceData.records.map((record: any) => {
                    let distanceValue = 0;
                    if (record.distance) {
                        if (typeof record.distance === 'number') {
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
                setDistance(processedDistance);
            } else {
                setDistance([]);
            }
        } catch (error) {
            setDistance([]);
        }
    };

    const fetchFloorsData = async (timeRangeFilter: TimeRangeFilter) => {
        try {
            const floorsData = await readRecords("FloorsClimbed", { timeRangeFilter });
            
            
            if (floorsData?.records && floorsData.records.length > 0) {
                
                const processedFloors = floorsData.records.map((record: any, index: number) => {
                    
                    let floorValue = 0;
                    
                    // Try different possible field names
                    if (record.floors !== undefined) {
                        floorValue = record.floors;
                    } else if (record.count !== undefined) {
                        floorValue = record.count;
                    } else if (record.floorsClimbed !== undefined) {
                        floorValue = record.floorsClimbed;
                    } else {
                        console.log("🏢 No recognized floor field found in record");
                        console.log("🏢 Available fields:", Object.keys(record));
                    }
                    
                    return {
                        value: floorValue,
                        startDate: record.startTime,
                        endDate: record.endTime,
                    };
                });
                
                setFlights(processedFloors);
            } else {
                setFlights([]);
            }
        } catch (error) {
            setFlights([]);
        }
    };

    const fetchCaloriesData = async (timeRangeFilter: TimeRangeFilter) => {
        try {
            const activeCaloriesData = await readRecords("ActiveCaloriesBurned", { timeRangeFilter });
            
            
            if (activeCaloriesData?.records && activeCaloriesData.records.length > 0) {
                
                const processedCalories = activeCaloriesData.records.map((record: any, index: number) => {
                    
                    let calorieValue = 0;
                    let rawValue = null;
                    let conversionUsed = "none";
                    
                    if (record.energy) {

                        if (typeof record.energy === 'number') {
                            rawValue = record.energy;
                            calorieValue = record.energy;
                            conversionUsed = "direct_number";
                        } else if (record.energy.inCalories !== undefined) {
                            rawValue = record.energy.inCalories;
                            calorieValue = record.energy.inCalories;
                            conversionUsed = "inCalories";
                        } else if (record.energy.inKilocalories !== undefined) {
                            rawValue = record.energy.inKilocalories;
                            calorieValue = record.energy.inKilocalories * 1000; // Convert to calories
                            conversionUsed = "inKilocalories_to_calories";
                        } else if (record.energy.inJoules !== undefined) {
                            rawValue = record.energy.inJoules;
                            calorieValue = record.energy.inJoules / 4.184; // Convert joules to calories
                            conversionUsed = "inJoules_to_calories";
                        } else if (record.energy.inKilojoules !== undefined) {
                            rawValue = record.energy.inKilojoules;
                            calorieValue = (record.energy.inKilojoules * 1000) / 4.184; // Convert kilojoules to calories
                            conversionUsed = "inKilojoules_to_calories";
                        }
                    }
                    
                    
                    return {
                        value: calorieValue,
                        startDate: record.startTime,
                        endDate: record.endTime,
                    };
                });
                
                setActiveEnergyBurned(processedCalories);
            } else {
                
                // Try TotalCaloriesBurned as fallback
                try {
                    const totalCaloriesData = await readRecords("TotalCaloriesBurned", { timeRangeFilter });
                    
                    
                    if (totalCaloriesData?.records && totalCaloriesData.records.length > 0) {
                        
                        const processedTotalCalories = totalCaloriesData.records.map((record: any, index: number) => {
                            
                            let calorieValue = 0;
                            let rawValue = null;
                            let conversionUsed = "none";
                            
                            if (record.energy) {
                                
                                if (typeof record.energy === 'number') {
                                    rawValue = record.energy;
                                    calorieValue = record.energy;
                                    conversionUsed = "direct_number";
                                } else if (record.energy.inCalories !== undefined) {
                                    rawValue = record.energy.inCalories;
                                    calorieValue = record.energy.inCalories;
                                    conversionUsed = "inCalories";
                                } else if (record.energy.inKilocalories !== undefined) {
                                    rawValue = record.energy.inKilocalories;
                                    calorieValue = record.energy.inKilocalories * 1000; // Convert to calories
                                    conversionUsed = "inKilocalories_to_calories";
                                } else if (record.energy.inJoules !== undefined) {
                                    rawValue = record.energy.inJoules;
                                    calorieValue = record.energy.inJoules / 4.184; // Convert joules to calories
                                    conversionUsed = "inJoules_to_calories";
                                } else if (record.energy.inKilojoules !== undefined) {
                                    rawValue = record.energy.inKilojoules;
                                    calorieValue = (record.energy.inKilojoules * 1000) / 4.184; // Convert kilojoules to calories
                                    conversionUsed = "inKilojoules_to_calories";
                                }
                            }
                            
                            return {
                                value: calorieValue,
                                startDate: record.startTime,
                                endDate: record.endTime,
                            };
                        });
                        
                        setActiveEnergyBurned(processedTotalCalories);
                    } else {
                        setActiveEnergyBurned([]);
                    }
                } catch (totalCaloriesError) {
                    setActiveEnergyBurned([]);
                }
            }
        } catch (error) {
            console.log("❌ Calories fetch error:", error);
            setActiveEnergyBurned([]);
        }
    };

    useEffect(() => {
        readSampleData();
    }, [readSampleData]);

    return {
        heartRate,
        bloodGlucose,
        sleepAnalysis,
        steps,
        flights,
        distance,
        activeEnergyBurned,
    };
};

export default useHealthData;
