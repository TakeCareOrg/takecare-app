import { View } from "react-native";

import { Text } from "@app/components/ui/text";
import useHealthData from "@app/hooks/health/use-health-data";
import { PageContainer } from "@app/layouts/page-container";
import { addDays } from "date-fns";

import { Box } from "./components/box";

export function HomeScreen() {
    const { steps, flights, distance } = useHealthData({
        startDate: new Date(),
        endDate: new Date(),
    });

    console.log("Health Data:", { steps, flights, distance });

    return (
        <PageContainer>
            <Box>
                <Text>Home Screen</Text>
            </Box>
        </PageContainer>
    );
}
