import axios from "axios";

import { WEATHER_VIDEO_IDS } from "@app/utils/weather-videos";

interface PixabayVideoResponse {
    total: number;
    totalHits: number;
    hits: {
        id: number;
        pageURL: string;
        type: string;
        tags: string;
        duration: number;
        videos: {
            large: {
                url: string;
                width: number;
                height: number;
                size: number;
            };
            medium: {
                url: string;
                width: number;
                height: number;
                size: number;
            };
            small: {
                url: string;
                width: number;
                height: number;
                size: number;
            };
            tiny: {
                url: string;
                width: number;
                height: number;
                size: number;
            };
        };
    }[];
}

// Cache for video URLs to avoid repeated API calls
const videoUrlCache: Record<string, string> = {};

/**
 * Fetch video URL from Pixabay API
 * @param condition - Weather condition
 * @returns Video URL or null if error
 */
export const fetchPixabayVideoUrl = async (
    condition: string,
): Promise<string | null> => {
    // Return cached URL if available
    if (videoUrlCache[condition]) {
        return videoUrlCache[condition];
    }

    const videoId = WEATHER_VIDEO_IDS[condition];
    if (!videoId) {
        return null;
    }
    const apiKey = process.env.EXPO_PUBLIC_PIXABAY_API_KEY;

    if (!apiKey) {
        return null;
    }

    try {
        const response = await axios.get<PixabayVideoResponse>(
            "https://pixabay.com/api/videos/",
            {
                params: { key: apiKey, id: videoId },
            },
        );

        if (response.data.hits && response.data.hits.length > 0) {
            // Get medium quality video URL
            const videoUrl = response.data.hits[0].videos.medium.url;
            videoUrlCache[condition] = videoUrl;
            return videoUrl;
        }

        return null;
    } catch {
        return null;
    }
};
