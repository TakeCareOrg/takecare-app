import axios from "@app/services/axios";
import type {
    WithingsDataResponse,
    WithingsOAuthInitResponse,
    WithingsStatusResponse,
} from "@app/types/withings-types";

/**
 * Thin HTTP client for the backend's `/withings/*` endpoints.
 *
 * Errors are propagated to the caller — the calling store (`useWithingsStore`)
 * or screen handles them. We deliberately don't swallow here so the
 * caller can decide whether to retry, show a toast, etc.
 */

export const fetchWithingsStatus =
    async (): Promise<WithingsStatusResponse> => {
        const { data } =
            await axios.get<WithingsStatusResponse>("/withings/status");
        return data;
    };

export const initiateWithingsConnect =
    async (): Promise<WithingsOAuthInitResponse> => {
        const { data } = await axios.post<WithingsOAuthInitResponse>(
            "/withings/oauth/init",
        );
        return data;
    };

export const disconnectWithings = async (): Promise<void> => {
    await axios.delete("/withings/disconnect");
};

/**
 * Fetch the user's Withings slice for the requested window. Returns
 * `null` on any HTTP error — the caller falls back to HC-only data
 * rather than blocking the whole sync on a Withings outage.
 */
export const fetchWithingsData = async ({
    start,
    end,
    types,
}: {
    start: string;
    end: string;
    types?: string[];
}): Promise<WithingsDataResponse | null> => {
    try {
        const { data } = await axios.get<WithingsDataResponse>(
            "/withings/data",
            {
                params: {
                    start,
                    end,
                    ...(types && types.length > 0
                        ? { types: types.join(",") }
                        : {}),
                },
            },
        );
        return data;
    } catch {
        return null;
    }
};
