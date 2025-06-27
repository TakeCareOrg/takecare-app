import { View } from "react-native";

import useHealthData from "@app/hooks/health/use-health-data";
import { PageContainer } from "@app/layouts/page-container";
import { safeFormatDate } from "@app/utils/date";
import { addDays } from "date-fns";

import { HeartRateBox } from "./components/heart-rate-box";

export function HomeScreen() {
    const { heartRate } = useHealthData({
        startDate: safeFormatDate(addDays(new Date(), -1)),
        endDate: safeFormatDate(new Date()),
    });

    return (
        <PageContainer>
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
