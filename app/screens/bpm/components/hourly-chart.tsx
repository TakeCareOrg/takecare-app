import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Box } from "@app/components/ui/box";
import {
    LineChart,
    LineChartDataPoint,
} from "@app/components/ui/chart/line-chart";
import { useColorTheme } from "@app/hooks/use-color-theme";

interface HourlyChartProps {
    data: LineChartDataPoint[];
    height?: number;
}

export function HourlyChart({ data, height = 200 }: HourlyChartProps) {
    const { t } = useTranslation("full_trads");
    const colors = useColorTheme();

    return (
        <View style={{ marginTop: 20 }}>
            <Box title={t("BPM.GRAPH_TITLE")}>
                <LineChart
                    data={data}
                    height={height}
                    lineColor={colors.red[500]}
                    showGrid={true}
                    gridLineColor={colors.white[800]}
                    fillGradientColors={[colors.red[500], colors.blue[300]]}
                />
            </Box>
        </View>
    );
}
