import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
    Animated,
    FlatList,
    Modal,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { useColorTheme } from "@app/hooks/use-color-theme";
import { Achievement } from "@app/types/gamification-types";
import { Text } from "@components/ui/text";
import { padding } from "@utils/styles";

const SLIDE_DURATION = 300;

function AchievementItem({
    achievement,
    index,
}: {
    achievement: Achievement;
    index: number;
}) {
    const { t } = useTranslation("full_trads");
    const colors = useColorTheme();
    const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            delay: index * 80,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
        }).start();
    }, [scaleAnim, index]);

    return (
        <Animated.View
            style={{
                opacity: scaleAnim,
                transform: [
                    {
                        translateY: scaleAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                        }),
                    },
                ],
            }}
        >
            <View
                style={[
                    styles.achievementItem,
                    {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                    },
                ]}
            >
                <View
                    style={[
                        styles.achievementIcon,
                        {
                            backgroundColor: colors.isDark
                                ? colors.secondary
                                : colors.white,
                        },
                    ]}
                >
                    <Text fontSize={24}>
                        {achievement.metadata.icon
                            ? achievement.metadata.icon
                            : "🏆"}
                    </Text>
                </View>
                <View style={styles.achievementInfo}>
                    <Text
                        fontSize={14}
                        weight="700"
                        color={colors.text}
                        numberOfLines={1}
                    >
                        {achievement.metadata.title}
                    </Text>
                    {achievement.metadata.description && (
                        <Text
                            fontSize={11}
                            color={colors.placeholder}
                            numberOfLines={1}
                        >
                            {achievement.metadata.description}
                        </Text>
                    )}
                </View>
                <View style={styles.achievementPoints}>
                    <Text fontSize={14} weight="700" color={colors.text}>
                        +{achievement.pointsEarned}
                    </Text>
                    <Text
                        fontSize={10}
                        weight="500"
                        color={colors.text}
                        style={{ opacity: 0.6 }}
                    >
                        {t("HOME_PAGE.GAMIFICATION.PTS")}
                    </Text>
                </View>
            </View>
        </Animated.View>
    );
}

export function AchievementsModal({
    visible,
    onClose,
    achievements,
}: {
    visible: boolean;
    onClose: () => void;
    achievements: Achievement[];
}) {
    const { t } = useTranslation("full_trads");
    const colors = useColorTheme();
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(300)).current;

    const totalPoints = achievements.reduce(
        (sum, a) => sum + a.pointsEarned,
        0,
    );

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(overlayOpacity, {
                    toValue: 1,
                    duration: SLIDE_DURATION,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 65,
                    friction: 11,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible, overlayOpacity, slideAnim]);

    const handleClose = () => {
        Animated.parallel([
            Animated.timing(overlayOpacity, {
                toValue: 0,
                duration: SLIDE_DURATION,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 300,
                duration: SLIDE_DURATION,
                useNativeDriver: true,
            }),
        ]).start(() => onClose());
    };

    return (
        <Modal
            visible={visible}
            animationType="none"
            transparent
            onRequestClose={handleClose}
        >
            <View style={styles.modalWrapper}>
                <Animated.View
                    style={[styles.modalOverlay, { opacity: overlayOpacity }]}
                >
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        activeOpacity={1}
                        onPress={handleClose}
                    />
                </Animated.View>

                <Animated.View
                    style={[
                        styles.modalContent,
                        {
                            backgroundColor: colors.background,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <View
                        style={[
                            styles.modalHandle,
                            { backgroundColor: colors.border },
                        ]}
                    />

                    <LinearGradient
                        colors={colors.achievement}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.modalBanner}
                    >
                        <View style={styles.bannerContent}>
                            <View>
                                <Text
                                    fontSize={22}
                                    weight="700"
                                    color={colors.white}
                                >
                                    {t(
                                        "HOME_PAGE.GAMIFICATION.YOUR_ACHIEVEMENTS",
                                    )}
                                </Text>
                                <Text
                                    fontSize={13}
                                    weight="500"
                                    color={colors.white}
                                    style={{ opacity: 0.7 }}
                                >
                                    {t(
                                        "HOME_PAGE.GAMIFICATION.UNLOCKED_COUNT",
                                        { count: achievements.length },
                                    )}
                                </Text>
                            </View>
                            <View style={styles.bannerPoints}>
                                <Text
                                    fontSize={24}
                                    weight="800"
                                    color={colors.white}
                                >
                                    {totalPoints}
                                </Text>
                                <Text
                                    fontSize={11}
                                    weight="600"
                                    color={colors.white}
                                    style={{ opacity: 0.6 }}
                                >
                                    {t("HOME_PAGE.GAMIFICATION.POINTS_EARNED")}
                                </Text>
                            </View>
                        </View>
                    </LinearGradient>

                    <FlatList
                        data={achievements}
                        keyExtractor={(item) => item.achievementId}
                        renderItem={({ item, index }) => (
                            <AchievementItem achievement={item} index={index} />
                        )}
                        contentContainerStyle={styles.modalList}
                        showsVerticalScrollIndicator={false}
                    />

                    <TouchableOpacity
                        style={[
                            styles.closeButton,
                            {
                                backgroundColor: colors.card,
                            },
                        ]}
                        onPress={handleClose}
                        activeOpacity={0.7}
                    >
                        <Text fontSize={15} weight="600" color={colors.text}>
                            {t("HOME_PAGE.GAMIFICATION.CLOSE")}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
        ...padding(10, 15),
        height: 175,
        minHeight: 160,
        flex: 0,
        zIndex: -1,
        overflow: "hidden",
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    badgesColumn: {
        alignItems: "flex-end",
        gap: 2,
    },
    badge: {
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    pointsBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    bottomSection: {
        flex: 1,
        justifyContent: "flex-end",
    },
    title: {
        marginBottom: 2,
    },
    // Modal
    modalWrapper: {
        flex: 1,
        justifyContent: "flex-end",
    },
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: "80%",
        paddingBottom: 30,
    },
    modalHandle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        alignSelf: "center",
        marginTop: 10,
        marginBottom: 12,
    },
    modalBanner: {
        marginHorizontal: 16,
        borderRadius: 16,
        marginBottom: 16,
    },
    bannerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 18,
    },
    bannerPoints: {
        alignItems: "flex-end",
    },
    modalList: {
        paddingHorizontal: 16,
        gap: 8,
        paddingBottom: 12,
    },
    closeButton: {
        marginHorizontal: 16,
        marginTop: 4,
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
    },
    // Achievement items
    achievementItem: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 14,
        padding: 14,
        gap: 12,
        borderWidth: 1,
    },
    achievementIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    achievementInfo: {
        flex: 1,
        gap: 2,
    },
    achievementPoints: {
        alignItems: "flex-end",
    },
});
