import { useEffect, useState } from "react";
import { Platform } from "react-native";

// import AppleHealthKit, {
//     HealthInputOptions,
//     HealthKitPermissions,
// } from "react-native-health";

import {
    initialize,
    readRecords,
    requestPermission,
} from "react-native-health-connect";
import { TimeRangeFilter } from "react-native-health-connect/lib/typescript/types/base.types";

// const permissions: HealthKitPermissions = {
//     permissions: {
//         read: [
//             AppleHealthKit.Constants.Permissions.Steps,
//             AppleHealthKit.Constants.Permissions.FlightsClimbed,
//             AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
//             AppleHealthKit.Constants.Permissions.HeartRate,
//             AppleHealthKit.Constants.Permissions.BloodGlucose,
//         ],
//         write: [],
//     },
// };

const useHealthData = (date: Date) => {
    const [hasPermissions, setHasPermission] = useState(false);
    const [steps, setSteps] = useState(0);
    const [flights, setFlights] = useState(0);
    const [distance, setDistance] = useState(0);

    // iOS - HealthKit
    // useEffect(() => {
    //     if (Platform.OS !== "ios") {
    //         return;
    //     }

    //     AppleHealthKit.isAvailable((err, isAvailable) => {
    //         if (err) {
    //             console.error("Error checking availability:", err);
    //             return;
    //         }
    //         if (!isAvailable) {
    //             console.error("Apple Health not available on this device");
    //             return;
    //         }

    //         console.log("HealthKit is available, requesting permissions...");
    //         AppleHealthKit.initHealthKit(permissions, (initError) => {
    //             if (initError) {
    //                 console.error("Error getting permissions:", initError);
    //                 return;
    //             }
    //             console.log("HealthKit permissions granted successfully");
    //             setHasPermission(true);
    //         });
    //     });
    // }, []);

    // useEffect(() => {
    //     if (!hasPermissions) {
    //         return;
    //     }

    //     const options: HealthInputOptions = {
    //         startDate: new Date(date.setHours(0, 0, 0, 0)).toISOString(),
    //         endDate: new Date(date.setHours(23, 59, 59, 999)).toISOString(),
    //         includeManuallyAdded: false,
    //     };

    //     AppleHealthKit.getStepCount(options, (err, results) => {
    //         if (err) {
    //             console.log("Error getting the steps");
    //             return;
    //         }
    //         console.log("Steps:", results);

    //         setSteps(results.value);
    //     });

    //     AppleHealthKit.getFlightsClimbed(options, (err, results) => {
    //         if (err) {
    //             console.log("Error getting the steps:", err);
    //             return;
    //         }
    //         setFlights(results.value);
    //     });

    //     AppleHealthKit.getDistanceWalkingRunning(options, (err, results) => {
    //         if (err) {
    //             console.log("Error getting the steps:", err);
    //             return;
    //         }
    //         setDistance(results.value);
    //     });

    //     // AppleHealthKit.getHeartRateSamples(options, (err, results) => {
    //     //     if (err) {
    //     //         console.log("Error getting heart rate samples:", err);
    //     //         return;
    //     //     }
    //     //     console.log(
    //     //         "Heart Rate Samples:",
    //     //         JSON.stringify(results, null, 2),
    //     //     );
    //     // });

    //     AppleHealthKit.getBloodGlucoseSamples(options, (err, results) => {
    //         if (err) {
    //             console.log("Error getting blood glucose samples:", err);
    //             return;
    //         }
    //         console.log(
    //             "Blood Glucose Samples:",
    //             JSON.stringify(results, null, 2),
    //         );
    //     });
    // }, [hasPermissions, date]);

    // Android - Health Connect
    const readSampleData = async () => {
        // initialize the client
        const isInitialized = await initialize();
        console.log("Health Connect initialized:", isInitialized);

        if (!isInitialized) {
            return;
        }

        // request permissions
        const permissions = await requestPermission([
            { accessType: "read", recordType: "Steps" },
            { accessType: "read", recordType: "Distance" },
            { accessType: "read", recordType: "FloorsClimbed" },
        ]);

        console.log("Health Connect permissions:", permissions);

        const timeRangeFilter: TimeRangeFilter = {
            operator: "between",
            startTime: new Date(date.setHours(0, 0, 0, 0)).toISOString(),
            endTime: new Date(date.setHours(23, 59, 59, 999)).toISOString(),
        };

        // Steps
        const steps = await readRecords("Steps", { timeRangeFilter });
        const totalSteps = steps.records.reduce(
            (sum, cur) => sum + cur.count,
            0,
        );
        setSteps(totalSteps);

        // Distance
        const distance = await readRecords("Distance", { timeRangeFilter });
        const totalDistance = distance.records.reduce(
            (sum, cur) => sum + cur.distance.inMeters,
            0,
        );
        setDistance(totalDistance);

        // Floors climbed
        const floorsClimbed = await readRecords("FloorsClimbed", {
            timeRangeFilter,
        });
        const totalFloors = floorsClimbed.records.reduce(
            (sum, cur) => sum + cur.floors,
            0,
        );
        setFlights(totalFloors);
        // console.log(floorsClimbed);
    };

    useEffect(() => {
        if (Platform.OS !== "android") {
            return;
        }
        readSampleData();
    }, [date]);

    return {
        steps,
        flights,
        distance,
    };
};

export default useHealthData;
