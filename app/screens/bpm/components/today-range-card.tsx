import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LayoutChangeEvent, View } from "react-native";

import { Box } from "@app/components/ui/box";
import { VerticalSelectionLine } from "@app/components/ui/chart/shared/vertical-selection-line";
import { Text } from "@app/components/ui/text";
import { useColorTheme } from "@app/hooks/use-color-theme";

interface TodayRangeCardProps {
    todayMin: number;
    todayMax: number;
    todayAverage: number;
    rangeMin?: number;
    rangeMax?: number;
}

export function TodayRangeCard({
    todayMin,
    todayMax,
    todayAverage,
    rangeMin = 30,
    rangeMax = 240,
}: TodayRangeCardProps) {
    const colors = useColorTheme();
    const [barWidth, setBarWidth] = useState(0);

    const totalRange = rangeMax - rangeMin;
    const minPercent = ((todayMin - rangeMin) / totalRange) * 100;
    const maxPercent = ((todayMax - rangeMin) / totalRange) * 100;
    const avgPercent = ((todayAverage - rangeMin) / totalRange) * 100;

    const handleBarLayout = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setBarWidth(width);
    };

    const { t } = useTranslation("full_trads");

    return (
        <Box>
            <View
                style={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    alignItems: "center",
                }}
            >
                {/* Title */}
                <View style={{ marginBottom: 30 }}>
                    <Text weight="600" fontSize={20}>
                        {t("BPM.RANGE")}
                    </Text>
                </View>

                {/* Range bar */}
                <View style={{ width: "100%", marginBottom: 10 }}>
                    <View
                        style={{
                            height: 50,
                            backgroundColor: colors.progress,
                            position: "relative",
                        }}
                        onLayout={handleBarLayout}
                    >
                        {/* Active range (min to max) */}
                        <View
                            style={{
                                position: "absolute",
                                left: `${minPercent}%`,
                                width: `${maxPercent - minPercent}%`,
                                height: "100%",
                                backgroundColor: colors.red[500],
                            }}
                        />

                        {/* Average line (dotted) */}
                        {barWidth > 0 && (
                            <VerticalSelectionLine
                                centerX={(avgPercent / 100) * barWidth}
                                height={50}
                                topOffset={0}
                                color={colors.white}
                                extendUpward={0}
                            />
                        )}
                    </View>

                    {/* Labels */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 10,
                            paddingHorizontal: 5,
                            position: "relative",
                        }}
                    >
                        <Text fontSize={12} color={colors.secondary}>
                            {rangeMin}
                        </Text>

                        {/* Average value and label centered under the line */}
                        <View
                            style={{
                                position: "absolute",
                                left: `${avgPercent}%`,
                                transform: [{ translateX: -20 }],
                                alignItems: "center",
                            }}
                        >
                            <Text
                                fontSize={12}
                                weight="600"
                                color={colors.secondary}
                            >
                                {todayAverage}
                            </Text>
                            <Text
                                fontSize={12}
                                weight="600"
                                color={colors.secondary}
                            >
                                {t("BPM.AVERAGE")}
                            </Text>
                        </View>

                        <Text fontSize={12} color={colors.secondary}>
                            {rangeMax}
                        </Text>
                    </View>
                </View>

                {/* Range display */}
                <View style={{ marginTop: 20 }}>
                    <Text
                        weight="700"
                        fontSize={32}
                        style={{
                            textAlign: "center",
                        }}
                    >
                        {todayMin}–{todayMax}{" "}
                        <Text weight="600">{t("BPM.BPM")}</Text>
                    </Text>
                </View>
            </View>
        </Box>
    );
}
