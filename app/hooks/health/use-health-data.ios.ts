import { useEffect, useMemo, useState } from "react";

import { HealthData } from "@app/types/health-data-types";
import AppleHealthKit, {
    HealthInputOptions,
    HealthKitPermissions,
} from "react-native-health";

const permissions: HealthKitPermissions = {
    permissions: {
        read: [
            AppleHealthKit.Constants.Permissions.HeartRate,
            AppleHealthKit.Constants.Permissions.BloodGlucose,
            AppleHealthKit.Constants.Permissions.SleepAnalysis,
        ],
        write: [],
    },
};
const useHealthData = ({
    startDate,
    endDate,
}: {
    startDate: string;
    endDate: string;
}): HealthData => {
    const [hasPermissions, setHasPermission] = useState(false);
    const [heartRate, setHeartRate] = useState<HealthData["heartRate"]>({
        lastHeartRateValue: null,
        values: [],
    });
    const [bloodGlucose, setBloodGlucose] =
        useState<HealthData["bloodGlucose"]>(0);
    const [sleepAnalysis, setSleepAnalysis] =
        useState<HealthData["sleepAnalysis"]>("");

    const startDateCopy = new Date(startDate).setHours(0, 0, 0, 0);
    const endDateCopy = new Date(endDate).setHours(23, 59, 59, 999);

    const dateOptions = useMemo(() => {
        return {
            startDate: new Date(startDateCopy).toISOString(),
            endDate: new Date(endDateCopy).toISOString(),
        };
    }, [startDate, endDate]);

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
            ...dateOptions,
            // includeManuallyAdded: false,
        };

        AppleHealthKit.getHeartRateSamples(options, (err, results) => {
            if (err) {
                console.error("Error fetching heart rate samples:", err);
                return;
            }

            const sortedResults = results
                .sort((a, b) => {
                    return (
                        new Date(a.startDate).getTime() -
                        new Date(b.startDate).getTime()
                    );
                })
                .map((sample) => ({
                    value: sample.value,
                    startDate: sample.startDate,
                    endDate: sample.endDate,
                }));

            setHeartRate({
                lastHeartRateValue: sortedResults[0] || null,
                values: sortedResults,
            });
        });

        // AppleHealthKit.getBloodGlucoseSamples(options, (err, results) => {
        //     if (err) {
        //         console.error("Error fetching blood glucose samples:", err);
        //         return;
        //     }

        //     console.log("Blood glucose samples:", results);
        //     setBloodGlucose(results[0]?.value || 0);
        // });

        // AppleHealthKit.getSleepSamples(options, (err, results) => {
        //     if (err) {
        //         console.error("Error fetching sleep samples:", err);
        //         return;
        //     }

        //     console.log("Sleep samples:", results);
        //     // setSleepAnalysis(results.map((sample) => sample.value).join(", "));
        // });
    }, [hasPermissions, startDate, endDate]);

    return {
        heartRate,
        bloodGlucose,
        sleepAnalysis,
    };
};

export default useHealthData;
