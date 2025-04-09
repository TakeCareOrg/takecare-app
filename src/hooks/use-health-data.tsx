import { track } from "@amplitude/analytics-react-native";
import moment from "moment";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import {
    initialize,
    readRecords,
    requestPermission,
} from "react-native-health-connect";
import { TimeRangeFilter } from "react-native-health-connect/lib/typescript/types/base.types";
import { requestMultiple } from "react-native-permissions";

const useHealthData = () => {
    const [data, setData] = useState({
        steps: 0,
        flights: 0,
        distance: 0,
        calories: 0,
        activeCalories: 0,
        sleep: 0,
        height: 0,
        hydration: 0,
        weight: 0,
    });

    // Android - Health Connect
    const readSampleData = async () => {
        try {
            // initialize the client
            const isInitialized = await initialize();
            if (!isInitialized) {
                console.error("Health Connect initialization failed");
                return;
            }

            // request permissions
            const permissionsGranted = await requestPermission([
                { accessType: "read", recordType: "Distance" },
                { accessType: "read", recordType: "Steps" },
                { accessType: "read", recordType: "FloorsClimbed" },
                { accessType: "read", recordType: "TotalCaloriesBurned" },
                { accessType: "read", recordType: "ActiveCaloriesBurned" },
                { accessType: "read", recordType: "SleepSession" },
                { accessType: "read", recordType: "BodyFat" },
                { accessType: "read", recordType: "BoneMass" },
                { accessType: "read", recordType: "ExerciseSession" },
                { accessType: "read", recordType: "Height" },
                { accessType: "read", recordType: "Hydration" },
                { accessType: "read", recordType: "LeanBodyMass" },
                { accessType: "read", recordType: "RespiratoryRate" },
                { accessType: "read", recordType: "Speed" },
                { accessType: "read", recordType: "Weight" },
            ]);
            if (!permissionsGranted) {
                console.error("Health Connect permissions not granted");
                return;
            }

            const timeRangeFilter: TimeRangeFilter = {
                operator: "between",
                startTime: moment()
                    .subtract(3, "days")
                    .startOf("day")
                    .toISOString(),
                endTime: moment().toISOString(),
            };

            const [
                _steps,
                _distance,
                _flights,
                _calories,
                _activeCalories,
                _sleep,
                _weight,
                _height,
                _hydration,
            ] = await Promise.all([
                readRecords("Steps", { timeRangeFilter }),
                readRecords("Distance", { timeRangeFilter }),
                readRecords("FloorsClimbed", { timeRangeFilter }),
                readRecords("TotalCaloriesBurned", { timeRangeFilter }),
                readRecords("ActiveCaloriesBurned", { timeRangeFilter }),
                readRecords("SleepSession", { timeRangeFilter }),
                readRecords("Weight", { timeRangeFilter }),
                readRecords("Height", { timeRangeFilter }),
                readRecords("Hydration", { timeRangeFilter }),
            ]);

            console.log("height", _height);
            console.log("hydration", _hydration);
            console.log("weight", _weight);

            const totalSteps = _steps.reduce((sum, cur) => sum + cur.count, 0);

            const totalDistance = _distance.reduce(
                (sum, cur) => sum + cur.distance.inKilometers,
                0,
            );
            const totalFloors = _flights.reduce(
                (sum, cur) => sum + cur.floors,
                0,
            );
            const totalCalories = _calories.reduce(
                (sum, cur) => sum + cur.energy.inKilocalories,
                0,
            );

            const totalActiveCalories = _activeCalories.reduce(
                (sum, cur) => sum + cur.energy.inKilocalories,
                0,
            );

            const totalWeight = _weight.reduce(
                (sum, cur) => sum + cur.weight.inKilograms,
                0,
            );

            const totalHeight = _height.reduce(
                (sum, cur) => sum + cur.height.inMeters,
                0,
            );

            const totalHydration = _hydration.reduce(
                (sum, cur) => sum + cur.volume.inLiters,
                0,
            );

            // Total sleeping time = last sleep session end time - last sleep session start time
            const totalSleepingTime = _sleep.reduce((sum, cur) => {
                const sleepEndTime = new Date(cur.endTime);
                const sleepStartTime = new Date(cur.startTime);
                const duration =
                    sleepEndTime.getTime() - sleepStartTime.getTime();
                return sum + duration / 60000;
            }, 0);

            setData({
                steps: totalSteps,
                distance: totalDistance,
                flights: totalFloors,
                calories: totalCalories,
                activeCalories: totalActiveCalories,
                sleep: totalSleepingTime,
                weight: totalWeight,
                height: totalHeight,
                hydration: totalHydration,
            });
        } catch (error) {
            console.error("Error reading health data:", error);
        }
    };

    useEffect(() => {
        track("Got data", { data: "android" });
        requestPermissions();
    }, []);

    const requestPermissions = async () => {
        try {
            if (Platform.OS === "android") {
                // Request ACTIVITY_RECOGNITION permission
                // Request BODY_SENSORS permission (Example, replace with appropriate permission)
                const result = await requestMultiple([
                    "android.permission.ACTIVITY_RECOGNITION",
                    "android.permission.BODY_SENSORS",
                ]);

                if (
                    result["android.permission.ACTIVITY_RECOGNITION"] ===
                        "granted" &&
                    result["android.permission.BODY_SENSORS"] === "granted"
                ) {
                    console.log("Permission granted");
                    readSampleData();
                } else if (
                    result["android.permission.ACTIVITY_RECOGNITION"] ===
                        "denied" ||
                    result["android.permission.BODY_SENSORS"] === "denied"
                ) {
                    console.log("Permission denied");
                }
            }
        } catch (error) {
            console.error("Error requesting permissions:", error);
        }
    };

    return {
        steps: data.steps,
        flights: data.flights,
        distance: data.distance,
        calories: data.calories,
        activeCalories: data.activeCalories,
        sleep: data.sleep,
        weight: data.weight,
        height: data.height,
        hydration: data.hydration,
    };
};

export default useHealthData;
