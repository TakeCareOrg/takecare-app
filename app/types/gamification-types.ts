export interface AchievementMetadata {
    title: string;
    icon: string;
    description?: string;
}

export interface Achievement {
    achievementId: string;
    pointsEarned: number;
    completedAt: string;
    metadata: AchievementMetadata;
}

export interface LevelInfo {
    level: number;
    title: string;
    currentPoints: number;
    pointsForCurrentLevel: number;
    pointsForNextLevel: number;
    progressToNextLevel: number;
}

export interface DailyActivity {
    date: string;
    steps: number;
    completed: boolean;
}

export interface GamificationProgress {
    achievements: Achievement[];
    totalPoints: number;
    levelInfo: LevelInfo;
    dailyActivities: DailyActivity[];
}

export interface SyncStepsResult {
    newAchievements: Achievement[];
    pointsEarned: number;
    currentStreak: number;
    streakBonus: number;
    levelInfo: LevelInfo;
    totalPoints: number;
    dailyActivities: DailyActivity[];
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export type SyncStepsResponse = ApiResponse<SyncStepsResult>;
export type GamificationProgressResponse = ApiResponse<GamificationProgress>;
