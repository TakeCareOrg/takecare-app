import { View } from "react-native";

import { Text } from "@app/components/ui/text";
import useHealthData from "@app/hooks/health/use-health-data";
import { PageContainer } from "@app/layouts/page-container";
import { safeFormatDate } from "@app/utils/date";
import { add, addDays } from "date-fns";

import { Box } from "./components/box";
import { Diary } from "./components/diary";
import { HealthCheck } from "./components/health-check";
import { HeartRateBox } from "./components/heart-rate-box";

export function HomeScreen() {
    const { heartRate, bloodGlucose, sleepAnalysis } = useHealthData({
        startDate: safeFormatDate(addDays(new Date(), -1)),
        endDate: safeFormatDate(new Date()),
    });

    // console.log(
    //     "Health Data:",
    //     JSON.stringify(
    //         {
    //             heartRate,
    //             bloodGlucose,
    //             sleepAnalysis,
    //         },
    //         null,
    //         2,
    //     ),
    // );

    return (
        <PageContainer>
            <View
                style={{
                    flexDirection: "row",
                    flexWrap: "nowrap",
                    justifyContent: "space-between",
                }}
            >
                <HealthCheck score={1} />
                <Diary />
            </View>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 16,
                    columnGap: 14,
                }}
            >
                <HeartRateBox value={heartRate.lastHeartRateValue} />
            </View>
        </PageContainer>
    );
}
