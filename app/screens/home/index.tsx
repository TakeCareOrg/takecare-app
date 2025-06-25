import { View } from "react-native";

import { Text } from "@app/components/ui/text";
import useHealthData from "@app/hooks/use-health-data";
import { PageContainer } from "@app/layouts/page-container";
import { addDays } from "date-fns";

import { Box } from "./components/box";

export function HomeScreen() {
    const { steps, flights, distance } = useHealthData(addDays(new Date(), -1));

    return (
        <PageContainer>
            <Box>
                <Text>Home Screen</Text>
            </Box>
        </PageContainer>
    );
}
