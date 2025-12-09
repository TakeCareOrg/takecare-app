import React from "react";
import { StyleSheet, View } from "react-native";

import { useColorTheme } from "@hooks/use-color-theme";

interface LiveWaveformProps {
    levels: number[];
    width?: number;
    height?: number;
}

export const LiveWaveform: React.FC<LiveWaveformProps> = ({
    levels,
    width = 200,
    height = 40,
}) => {
    const theme = useColorTheme();

    const barColor = theme.isDark ? "#60A5FA" : "#3B82F6";
    const maxBars = Math.floor(width / 4);
    const visibleLevels = levels.slice(-maxBars);

    return (
        <View style={[styles.container, { width, height }]}>
            {visibleLevels.map((level, i) => {
                const minHeight = 4;
                const maxHeightPercent = 0.9;

                const normalizedHeight =
                    minHeight +
                    (level / 100) * (height * maxHeightPercent - minHeight);

                const finalHeight = Math.max(
                    minHeight,
                    Math.min(normalizedHeight, height * maxHeightPercent),
                );

                const opacity = level > 5 ? 1 : 0.4;

                return (
                    <View
                        key={`${i}-${level}`}
                        style={[
                            styles.bar,
                            {
                                height: finalHeight,
                                backgroundColor: barColor,
                                opacity: opacity,
                            },
                        ]}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        overflow: "hidden",
    },
    bar: {
        width: 2.5,
        borderRadius: 1.5,
        marginRight: 2.5,
    },
});
