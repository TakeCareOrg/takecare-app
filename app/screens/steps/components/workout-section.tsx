import { View } from "react-native";

import { GoodScoreIcon } from "@app/assets/icons/GoodScoreIcon";
import { Box } from "@app/components/ui/box";
import { Text } from "@app/components/ui/text";
import { useColorTheme } from "@app/hooks/use-color-theme";
import { WorkoutData } from "@app/types/health-data-types";
import { formatHour } from "@app/utils/date";

interface WorkoutProps {
    workout: WorkoutData;
}

const Workout = ({ workout }: WorkoutProps) => {
    const colors = useColorTheme();

    // Format duration from seconds to minutes
    const durationMinutes = Math.round(workout.duration / 60);

    // Format start date to show hour
    const startDate = new Date(workout.startDate);
    const hour = formatHour(startDate);

    // Calculate points based on duration (50 points per workout as base)
    const points = 50;

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between",
                backgroundColor: colors.box,
                borderRadius: 10,
                minHeight: 50,
                paddingHorizontal: 12,
                paddingVertical: 8,
                marginBottom: 8,
            }}
        >
            <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
                <View
                    style={{
                        width: 30,
                        height: 30,
                        borderRadius: 100,
                        overflow: "hidden",
                        backgroundColor: colors.isDark ? "#3A3A3A" : "#E8E8E8",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <GoodScoreIcon />
                </View>
                <View style={{ flexDirection: "column" }}>
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: colors.text,
                        }}
                    >
                        {workout.workoutActivityName}
                    </Text>
                    <Text
                        style={{
                            fontSize: 12,
                            color: colors.secondary,
                        }}
                    >
                        {durationMinutes} min • {hour}
                        {workout.totalEnergyBurned &&
                            ` • ${Math.round(workout.totalEnergyBurned)} kcal`}
                    </Text>
                </View>
            </View>
            <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
                <Text
                    style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#22C55E",
                    }}
                >
                    +{points} pts
                </Text>
                {workout.totalDistance && (
                    <Text
                        style={{
                            fontSize: 12,
                            color: colors.secondary,
                        }}
                    >
                        {(workout.totalDistance / 1000).toFixed(2)} km
                    </Text>
                )}
            </View>
        </View>
    );
};

interface WorkoutSectionProps {
    workouts?: WorkoutData[] | null;
}

export function WorkoutSection({ workouts }: WorkoutSectionProps) {
    if (!workouts || workouts.length === 0) {
        return null;
    }

    return (
        <Box title="This Week">
            {workouts.map((workout, index) => (
                <Workout
                    key={`${workout.startDate}-${index}`}
                    workout={workout}
                />
            ))}
        </Box>
    );
}
