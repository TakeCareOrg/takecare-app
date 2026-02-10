import { useEffect } from "react";

import * as Notifications from "expo-notifications";

import { useGamificationStore } from "@app/stores/gamification";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const useAchievementNotifications = () => {
    const { cache } = useGamificationStore();

    useEffect(() => {
        const unsubscribe = useGamificationStore.subscribe(
            (state, prevState) => {
                const newAchievements = state.cache?.achievements || [];
                const oldAchievements = prevState.cache?.achievements || [];

                const addedAchievements = newAchievements.filter(
                    (newAch) =>
                        !oldAchievements.some(
                            (oldAch) =>
                                oldAch.achievementId === newAch.achievementId,
                        ),
                );

                addedAchievements.forEach((achievement) => {
                    Notifications.scheduleNotificationAsync({
                        content: {
                            title: `🎉 ${achievement.metadata.icon} ${achievement.metadata.title}`,
                            body: `+${achievement.pointsEarned} points!`,
                            data: { achievementId: achievement.achievementId },
                        },
                        trigger: null,
                    });
                });
            },
        );

        return unsubscribe;
    }, []);

    return cache;
};
