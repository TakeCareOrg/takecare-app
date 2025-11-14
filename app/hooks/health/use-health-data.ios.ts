import {
    HealthKitCategoryType,
    HealthKitModule,
    HealthKitQuantityType,
} from "@takecareorg/takecare-healthkit";
import { useEffect, useMemo, useState } from "react";

import { HealthData, SleepAnalysis } from "@app/types/health-data-types";

const useHealthData = ({
    startDate,
    endDate,
}: {
    startDate: string | Date;
    endDate: string | Date;
}): HealthData => {
    const [hasPermissions, setHasPermission] = useState(false);
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
    const [stepCount, setStepCount] = useState<HealthData["stepCount"]>(0);
    const [steps, setSteps] = useState<HealthData["steps"]>(null);
    const [flights, setFlights] = useState<HealthData["flights"]>(null);
    const [distance, setDistance] = useState<HealthData["distance"]>(null);
    const [activeEnergyBurned, setActiveEnergyBurned] =
        useState<HealthData["activeEnergyBurned"]>(null);

    const startDateCopy = new Date(startDate).setHours(0, 0, 0, 0);
    const endDateCopy = new Date(endDate).setHours(23, 59, 59, 999);

    const dateOptions = useMemo(() => {
        return {
            startDate: new Date(startDateCopy),
            endDate: new Date(endDateCopy),
        };
    }, [startDateCopy, endDateCopy]);

    // Initialize HealthKit
    useEffect(() => {
        const initHealthKit = async () => {
            try {
                const isAvailable =
                    await HealthKitModule.isHealthKitAvailable();
                if (!isAvailable) {
                    // console.warn("HealthKit is not available on this device");
                    return;
                }

                const authorized = await HealthKitModule.requestAuthorization();
                setHasPermission(authorized);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                // console.error("HealthKit init error:", error);
            }
        };

        initHealthKit();
    }, []);

    // Fetch all health data when permissions are granted
    useEffect(() => {
        if (!hasPermissions) return;

        const fetchHealthData = async () => {
            try {
                // Fetch heart rate samples
                const heartRateSamples = await HealthKitModule.getQuantityData(
                    HealthKitQuantityType.HEART_RATE,
                    dateOptions.startDate,
                    dateOptions.endDate,
                    null, // no aggregation
                    true, // use cache
                    60, // cache TTL
                );

                if (heartRateSamples.length > 0) {
                    const sortedHeartRate = heartRateSamples
                        .sort(
                            (a, b) =>
                                new Date(a.startDate).getTime() -
                                new Date(b.startDate).getTime(),
                        )
                        .map((sample) => ({
                            value: sample.value,
                            startDate: sample.startDate.toISOString(),
                            endDate: sample.endDate.toISOString(),
                        }));

                    setHeartRate({
                        lastHeartRateValue: sortedHeartRate[0] || null,
                        values: sortedHeartRate,
                    });
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                // console.error("Error fetching heart rate:", error);
            }

            try {
                // Fetch step count samples
                const stepSamples = await HealthKitModule.getQuantityData(
                    HealthKitQuantityType.STEPS,
                    dateOptions.startDate,
                    dateOptions.endDate,
                    null,
                    true,
                    60,
                );

                if (stepSamples.length > 0) {
                    const sortedSteps = stepSamples
                        .sort(
                            (a, b) =>
                                new Date(a.startDate).getTime() -
                                new Date(b.startDate).getTime(),
                        )
                        .map((sample) => ({
                            value: sample.value,
                            startDate: sample.startDate.toISOString(),
                            endDate: sample.endDate.toISOString(),
                        }));

                    setSteps(sortedSteps);

                    // Calculate total step count
                    const totalSteps =
                        await HealthKitModule.getAggregatedQuantity(
                            HealthKitQuantityType.STEPS,
                            dateOptions.startDate,
                            dateOptions.endDate,
                            "sum",
                            true,
                            60,
                        );
                    setStepCount(totalSteps);
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                //console.error("Error fetching steps:", error);
            }

            try {
                // Fetch flights climbed
                const flightSamples = await HealthKitModule.getQuantityData(
                    HealthKitQuantityType.FLIGHTS_CLIMBED,
                    dateOptions.startDate,
                    dateOptions.endDate,
                    null,
                    true,
                    60,
                );

                if (flightSamples.length > 0) {
                    const sortedFlights = flightSamples
                        .sort(
                            (a, b) =>
                                new Date(a.startDate).getTime() -
                                new Date(b.startDate).getTime(),
                        )
                        .map((sample) => ({
                            value: sample.value,
                            startDate: sample.startDate.toISOString(),
                            endDate: sample.endDate.toISOString(),
                        }));

                    setFlights(sortedFlights);
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                // console.error("Error fetching flights:", error);
            }

            try {
                // Fetch distance walking/running
                const distanceSamples = await HealthKitModule.getQuantityData(
                    HealthKitQuantityType.DISTANCE_WALKING_RUNNING,
                    dateOptions.startDate,
                    dateOptions.endDate,
                    null,
                    true,
                    60,
                );

                if (distanceSamples.length > 0) {
                    const sortedDistance = distanceSamples
                        .sort(
                            (a, b) =>
                                new Date(a.startDate).getTime() -
                                new Date(b.startDate).getTime(),
                        )
                        .map((sample) => ({
                            value: sample.value,
                            startDate: sample.startDate.toISOString(),
                            endDate: sample.endDate.toISOString(),
                        }));

                    setDistance(sortedDistance);
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                //console.error("Error fetching distance:", error);
            }

            try {
                // Fetch active energy burned
                const energySamples = await HealthKitModule.getQuantityData(
                    HealthKitQuantityType.ACTIVE_ENERGY_BURNED,
                    dateOptions.startDate,
                    dateOptions.endDate,
                    null,
                    true,
                    60,
                );

                if (energySamples.length > 0) {
                    const sortedEnergy = energySamples
                        .sort(
                            (a, b) =>
                                new Date(a.startDate).getTime() -
                                new Date(b.startDate).getTime(),
                        )
                        .map((sample) => ({
                            value: sample.value,
                            startDate: sample.startDate.toISOString(),
                            endDate: sample.endDate.toISOString(),
                        }));

                    setActiveEnergyBurned(sortedEnergy);
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                //console.error("Error fetching active energy:", error);
            }

            try {
                // Fetch sleep analysis
                const sleepSamples = await HealthKitModule.getCategoryData(
                    HealthKitCategoryType.SLEEP_ANALYSIS,
                    dateOptions.startDate,
                    dateOptions.endDate,
                    true,
                    60,
                );

                if (sleepSamples.length > 0) {
                    const sortedSleep = sleepSamples.sort(
                        (a, b) =>
                            new Date(a.startDate).getTime() -
                            new Date(b.startDate).getTime(),
                    );

                    const sleepSteps: SleepAnalysis[] = sortedSleep.map(
                        (sample) => ({
                            value: sample.value.toString(),
                            startDate: sample.startDate.toISOString(),
                            endDate: sample.endDate.toISOString(),
                        }),
                    );

                    let totalSleepValue: SleepAnalysis | null = null;

                    if (sortedSleep.length > 0) {
                        const startSleep =
                            sortedSleep[0].startDate.toISOString();
                        const endSleep =
                            sortedSleep[
                                sortedSleep.length - 1
                            ].endDate.toISOString();

                        const startTime = new Date(startSleep).getTime();
                        const endTime = new Date(endSleep).getTime();
                        const totalDuration = Math.round(
                            (endTime - startTime) / 1000,
                        );

                        totalSleepValue = {
                            value: "TOTAL_SLEEP",
                            startDate: startSleep,
                            endDate: endSleep,
                            duration: totalDuration,
                        };
                    }

                    setSleepAnalysis({
                        totalSleepValue,
                        sleepSteps,
                    });
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                //console.error("Error fetching sleep analysis:", error);
            }
        };

        fetchHealthData();
    }, [hasPermissions, startDateCopy, endDateCopy]);

    return {
        heartRate,
        sleepAnalysis,
        stepCount,
        steps,
        flights,
        distance,
        activeEnergyBurned,
    };
};

export default useHealthData;
