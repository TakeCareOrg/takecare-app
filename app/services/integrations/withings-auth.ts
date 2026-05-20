import * as WebBrowser from "expo-web-browser";

import { initiateWithingsConnect } from "@app/services/withings";

/**
 * Drive the Withings OAuth flow from the app side.
 *
 * Flow:
 *   1. Call backend `/withings/oauth/init` → get `authorize_url` (which
 *      already carries our signed `state` JWT) and a returnable result.
 *   2. Open the URL in the system browser via
 *      `WebBrowser.openAuthSessionAsync`. The user authorises on
 *      Withings; Withings 302s to the backend; the backend processes
 *      everything, then 302s to `app-scheme://withings/callback?status=...`.
 *   3. `openAuthSessionAsync` resolves once the OS catches the deep link
 *      back into the app — its result includes the URL we got, which we
 *      parse to detect success vs error.
 *
 * The backend owns the client_secret and the token exchange, so the
 * app's role is essentially "open browser, wait for deep link back,
 * tell the store to refresh".
 */

export interface WithingsAuthResult {
    status: "success" | "error" | "dismissed";
    message?: string;
}

export const APP_DEEP_LINK_CALLBACK = "app-scheme://withings/callback";

export async function runWithingsAuthFlow(): Promise<WithingsAuthResult> {
    let authorizeUrl: string;
    try {
        const data = await initiateWithingsConnect();
        authorizeUrl = data.authorize_url;
    } catch (error) {
        return {
            status: "error",
            message:
                error instanceof Error ? error.message : "init_request_failed",
        };
    }

    // `WebBrowser.openAuthSessionAsync` opens the URL inside an in-app
    // browser (SFAuthenticationSession on iOS, Custom Tabs on Android),
    // and resolves as soon as the OS catches a redirect that matches
    // `returnUrl`'s scheme. We pass `APP_DEEP_LINK_CALLBACK` so the
    // session terminates the moment Withings's HTTPS callback (handled
    // by our backend) 302s into the app scheme.
    const result = await WebBrowser.openAuthSessionAsync(
        authorizeUrl,
        APP_DEEP_LINK_CALLBACK,
    );

    if (result.type === "cancel" || result.type === "dismiss") {
        return { status: "dismissed" };
    }
    if (result.type !== "success") {
        return {
            status: "error",
            message: `unknown_result_type:${result.type}`,
        };
    }

    // result.url is the deep link that re-opened the app, e.g.
    // app-scheme://withings/callback?status=success
    const url = new URL(result.url);
    const status = url.searchParams.get("status");
    if (status === "success") {
        return { status: "success" };
    }
    return {
        status: "error",
        message: url.searchParams.get("message") ?? "callback_returned_error",
    };
}
