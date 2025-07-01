import { useEffect, useState } from "react";

import { HealthData, HeartRateValue } from "@app/types/health-data-types";
import {
    initialize,
    readRecords,
    requestPermission,
} from "react-native-health-connect";
import { TimeRangeFilter } from "react-native-health-connect/lib/typescript/types/base.types";

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
    const [sleepAnalysis, setSleepAnalysis] = useState<string>("");
    const [steps, setSteps] = useState<HealthData["steps"]>(0);
    const [flights, setFlights] = useState<HealthData["flights"]>(0);
    const [distance, setDistance] = useState<HealthData["distance"]>(0);

    const startDateCopy = new Date(startDate).setHours(0, 0, 0, 0);
    const endDateCopy = new Date(endDate).setHours(23, 59, 59, 999);

    const readSampleData = async () => {
        const isInitialized = await initialize();
        if (!isInitialized) return;

        await requestPermission([
            { accessType: "read", recordType: "Steps" },
            { accessType: "read", recordType: "Distance" },
            { accessType: "read", recordType: "FloorsClimbed" },
        ]);

        const timeRangeFilter: TimeRangeFilter = {
            operator: "between",
            startTime: new Date(startDateCopy).toISOString(),
            endTime: new Date(endDateCopy).toISOString(),
        };

        // const stepsData = await readRecords("Steps", { timeRangeFilter });
        // setSteps(stepsData.records.reduce((sum, cur) => sum + cur.count, 0));

        // const distanceData = await readRecords("Distance", { timeRangeFilter });
        // setDistance(
        //     distanceData.records.reduce(
        //         (sum, cur) => sum + cur.distance.inMeters,
        //         0,
        //     ),
        // );

        // const floorsData = await readRecords("FloorsClimbed", {
        //     timeRangeFilter,
        // });
        // setFlights(
        //     floorsData.records.reduce((sum, cur) => sum + cur.floors, 0),
        // );
    };

    useEffect(() => {
        readSampleData();
    }, [startDate, endDate]);

    return {
        heartRate,
        bloodGlucose,
        sleepAnalysis,
        steps,
        flights,
        distance,
    };
};

export default useHealthData;
