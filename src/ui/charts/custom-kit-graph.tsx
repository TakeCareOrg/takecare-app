import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useColors } from "../../styles/Colors";

interface LineChartData {
    data: {
        labels: string[];
        datasets: { data: number[]; color?: (opacity: number) => string }[];
    };
    curved?: boolean;
    withVerticalLabels?: boolean;
    withHorizontalLabels?: boolean;
    withInnerLines?: boolean;
    withOuterLines?: boolean;
    withVerticalLines?: boolean;
    withHorizontalLines?: boolean;
    height?: number;
    width?: number;
}

const CustomKitGraph: React.FC<LineChartData> = ({
    data,
    curved = false,
    withVerticalLabels = true,
    withHorizontalLabels = true,
    withInnerLines = true,
    withOuterLines = true,
    withVerticalLines = true,
    withHorizontalLines = true,
    height = 220,
    width = Dimensions.get("window").width,
}) => {
    const { main } = useColors();

    return (
        <View style={styles.container}>
            <LineChart
                data={data}
                width={width} // from react-native
                height={height}
                yAxisLabel=""
                yAxisSuffix=""
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                    backgroundColor: main.container,
                    backgroundGradientFrom: main.container,
                    backgroundGradientTo: main.container,
                    decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) =>
                        `rgba(255, 255, 255, ${opacity})`,
                    fillShadowGradientTo: main.background,
                    fillShadowGradientOpacity: 0.3,
                }}
                withDots={false}
                bezier={curved}
                withVerticalLabels={withVerticalLabels}
                withHorizontalLabels={withHorizontalLabels}
                withHorizontalLines={withHorizontalLines}
                withVerticalLines={withVerticalLines}
                withInnerLines={withInnerLines}
                withOuterLines={withOuterLines}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    tooltip: {
        position: "absolute",
        backgroundColor: "#000",
        padding: 8,
        borderRadius: 4,
        zIndex: 9999,
    },
    tooltipText: {
        color: "#fff",
    },
});

export default CustomKitGraph;
