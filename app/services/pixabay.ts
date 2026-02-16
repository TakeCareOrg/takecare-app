import axios, { isAxiosError } from "axios";

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

// Video IDs mapping for each weather condition
const WEATHER_VIDEO_IDS: Record<string, number> = {
    clear: 4753,
    cloud: 221180,
    rain: 203878,
    snow: 85104,
    fog: 149330,
    thunderstorm: 16160,
};

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
        /*     console.warn(
                "Pixabay API key not configured. Add EXPO_PUBLIC_PIXABAY_API_KEY to .env.local",
            ); */
        return null;
    }

    try {
        const response = await axios.get<PixabayVideoResponse>(
            "https://pixabay.com/api/videos/",
            {
                params: {
                    key: apiKey,
                    id: videoId,
                },
            },
        );

        if (response.data.hits && response.data.hits.length > 0) {
            // Get medium quality video URL
            const videoUrl = response.data.hits[0].videos.medium.url;
            videoUrlCache[condition] = videoUrl;
            return videoUrl;
        }

        return null;
    } catch (error) {
        if (isAxiosError(error)) {
            //console.error("Pixabay API error:", error.message);
        } else {
            //console.error("Error fetching video from Pixabay:", error);
        }
        return null;
    }
};
