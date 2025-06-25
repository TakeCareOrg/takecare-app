import { useEffect, useState } from "react";

import {
    initialize,
    readRecords,
    requestPermission,
} from "react-native-health-connect";
import { TimeRangeFilter } from "react-native-health-connect/lib/typescript/types/base.types";

import { HealthData } from "./use-health-data";

const useHealthData = (date: Date): HealthData => {
    const [steps, setSteps] = useState(0);
    const [flights, setFlights] = useState(0);
    const [distance, setDistance] = useState(0);

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
            startTime: new Date(date.setHours(0, 0, 0, 0)).toISOString(),
            endTime: new Date(date.setHours(23, 59, 59, 999)).toISOString(),
        };

        const stepsData = await readRecords("Steps", { timeRangeFilter });
        setSteps(stepsData.records.reduce((sum, cur) => sum + cur.count, 0));

        const distanceData = await readRecords("Distance", { timeRangeFilter });
        setDistance(
            distanceData.records.reduce(
                (sum, cur) => sum + cur.distance.inMeters,
                0,
            ),
        );

        const floorsData = await readRecords("FloorsClimbed", {
            timeRangeFilter,
        });
        setFlights(
            floorsData.records.reduce((sum, cur) => sum + cur.floors, 0),
        );
    };

    useEffect(() => {
        readSampleData();
    }, [date]);

    return { steps, flights, distance };
};

export default useHealthData;
