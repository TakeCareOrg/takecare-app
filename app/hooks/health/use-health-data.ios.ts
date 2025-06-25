import { useEffect, useState } from "react";

import AppleHealthKit, {
    HealthInputOptions,
    HealthKitPermissions,
} from "react-native-health";

import { HealthData } from "./use-health-data";

const permissions: HealthKitPermissions = {
    permissions: {
        read: [
            AppleHealthKit.Constants.Permissions.Steps,
            AppleHealthKit.Constants.Permissions.FlightsClimbed,
            AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
            AppleHealthKit.Constants.Permissions.HeartRate,
            AppleHealthKit.Constants.Permissions.BloodGlucose,
        ],
        write: [],
    },
};

const useHealthData = (date: Date): HealthData => {
    const [hasPermissions, setHasPermission] = useState(false);
    const [steps, setSteps] = useState(0);
    const [flights, setFlights] = useState(0);
    const [distance, setDistance] = useState(0);

    useEffect(() => {
        AppleHealthKit.isAvailable((err, isAvailable) => {
            if (err || !isAvailable) {
                console.error("Apple Health not available or error:", err);
                return;
            }

            AppleHealthKit.initHealthKit(permissions, (initError) => {
                if (initError) {
                    console.error("HealthKit init error:", initError);
                    return;
                }
                setHasPermission(true);
            });
        });
    }, []);

    useEffect(() => {
        if (!hasPermissions) return;

        const options: HealthInputOptions = {
            startDate: new Date(date.setHours(0, 0, 0, 0)).toISOString(),
            endDate: new Date(date.setHours(23, 59, 59, 999)).toISOString(),
            // includeManuallyAdded: false,
        };

        AppleHealthKit.getStepCount(options, (err, results) => {
            console.log("Fetching health data for date:", results);
            if (!err) setSteps(results.value);
        });

        AppleHealthKit.getFlightsClimbed(options, (err, results) => {
            if (!err) setFlights(results.value);
        });

        AppleHealthKit.getDistanceWalkingRunning(options, (err, results) => {
            if (!err) setDistance(results.value);
        });
    }, [hasPermissions, date]);

    return { steps, flights, distance };
};

export default useHealthData;
