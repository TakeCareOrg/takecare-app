import { useEffect } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { useColorTheme } from "@app/hooks/use-color-theme";
import { useGamificationStore } from "@app/stores/gamification";
import { Text } from "@components/ui/text";
import { padding } from "@utils/styles";

// MOCK: décommenter pour tester sans backend
// const MOCK_LEVEL_INFO = {
//     level: 7,
//     title: "Explorateur",
//     currentPoints: 1450,
//     pointsForCurrentLevel: 1200,
//     pointsForNextLevel: 1800,
//     progressToNextLevel: 42,
// };
// const MOCK_TOTAL_POINTS = 1450;

export function LevelBox() {
    const windowWidth = useWindowDimensions().width;
    const colors = useColorTheme();
    const { cache, fetchProgress } = useGamificationStore();

    useEffect(() => {
        fetchProgress();
    }, [fetchProgress]);

    const levelInfo = cache?.levelInfo;
    const totalPoints = cache?.totalPoints ?? 0;

    if (!levelInfo) {
        return (
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: colors.isDark ? "#1A1A1A" : "#F0F0F0",
                        width: windowWidth / 2 - 25,
                        justifyContent: "center",
                        alignItems: "center",
                    },
                ]}
            >
                <Text
                    fontSize={16}
                    weight="700"
                    color={
                        colors.isDark
                            ? "rgba(193, 193, 193, 0.79)"
                            : "rgba(100, 100, 100, 0.79)"
                    }
                    style={{ textAlign: "center", lineHeight: 20 }}
                >
                    Aucun niveau
                </Text>
            </View>
        );
    }

    return (
        <LinearGradient
            colors={
                colors.isDark
                    ? ["#6b21a8", "#7c3aed", "#8b5cf6"] // Violet profond élégant
                    : ["#a78bfa", "#818cf8", "#6366f1"] // Violet-indigo moderne
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.container, { width: windowWidth / 2 - 25 }]}
        >
            <View style={styles.topRow}>
                <View style={styles.levelCircle}>
                    <Text fontSize={22} weight="800" color="#FFFFFF">
                        {levelInfo.level}
                    </Text>
                </View>
                <View style={styles.pointsBadge}>
                    <Text
                        fontSize={13}
                        weight="700"
                        color="rgba(255,255,255,0.95)"
                    >
                        {totalPoints}
                    </Text>
                    <Text
                        fontSize={9}
                        weight="600"
                        color="rgba(255,255,255,0.65)"
                    >
                        pts
                    </Text>
                </View>
            </View>

            <View style={styles.bottomSection}>
                <Text
                    fontSize={15}
                    color="#FFFFFF"
                    weight="700"
                    numberOfLines={1}
                    style={styles.title}
                >
                    {levelInfo.title}
                </Text>

                <View style={styles.progressRow}>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: `${levelInfo.progressToNextLevel}%`,
                                    backgroundColor: "rgba(255,255,255,0.9)",
                                    shadowColor: "#fff",
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 4,
                                },
                            ]}
                        />
                    </View>
                    <Text
                        fontSize={10}
                        color="rgba(255,255,255,0.7)"
                        weight="600"
                    >
                        {levelInfo.progressToNextLevel}%
                    </Text>
                </View>

                <Text fontSize={10} color="rgba(255,255,255,0.6)" weight="500">
                    Niv. {levelInfo.level + 1} : {levelInfo.pointsForNextLevel}{" "}
                    pts
                </Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
        ...padding(12, 15),
        height: 175,
        minHeight: 160,
        flex: 0,
        zIndex: -1,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    levelCircle: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: "rgba(255,255,255,0.15)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.25)",
    },
    pointsBadge: {
        alignItems: "flex-end",
    },
    bottomSection: {
        flex: 1,
        justifyContent: "flex-end",
    },
    title: {
        marginBottom: 8,
    },
    progressRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 4,
    },
    progressBar: {
        flex: 1,
        height: 6,
        borderRadius: 3,
        backgroundColor: "rgba(255,255,255,0.15)",
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "rgba(255,255,255,0.85)",
        borderRadius: 3,
    },
});
