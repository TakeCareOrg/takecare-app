import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import { Text } from "@app/components/ui/text";
import { useColorTheme } from "@app/hooks/use-color-theme";
import { syncHealthData } from "@app/services/health-sync";
import { runWithingsAuthFlow } from "@app/services/integrations/withings-auth";
import { useWithingsStore } from "@app/stores/withings";

interface WithingsDeviceCardProps {
    onDisconnectError?: (message: string) => void;
}

/**
 * Per-provider card on the Connected Devices screen. Today only
 * Withings; future providers (Fitbit, Garmin, Polar, ...) should
 * follow this exact pattern so the listing stays uniform.
 */
export const WithingsDeviceCard = ({
    onDisconnectError,
}: WithingsDeviceCardProps) => {
    const { t } = useTranslation("full_trads");
    const themeColors = useColorTheme();

    const connected = useWithingsStore((state) => state.connected);
    const connectedAt = useWithingsStore((state) => state.connectedAt);
    const lastSyncedAt = useWithingsStore((state) => state.lastSyncedAt);
    const markConnected = useWithingsStore((state) => state.markConnected);
    const disconnect = useWithingsStore((state) => state.disconnect);

    const [busy, setBusy] = useState(false);

    const handleConnect = async () => {
        setBusy(true);
        const result = await runWithingsAuthFlow();
        if (result.status === "success") {
            await markConnected();
            // Kick the global sync immediately so the new Withings
            // data lands in the cache without waiting for the next
            // 60s interval tick.
            await syncHealthData();
        } else if (result.status === "error") {
            Alert.alert(
                t("CONNECTED_DEVICES.ERROR_TITLE"),
                result.message ?? t("CONNECTED_DEVICES.CONNECT_FAILED"),
            );
        }
        // "dismissed" → user cancelled the browser, no message needed.
        setBusy(false);
    };

    const handleDisconnect = () => {
        Alert.alert(
            t("CONNECTED_DEVICES.WITHINGS.DISCONNECT_TITLE"),
            t("CONNECTED_DEVICES.WITHINGS.DISCONNECT_CONFIRM"),
            [
                { text: t("COMMON.CANCEL"), style: "cancel" },
                {
                    text: t("CONNECTED_DEVICES.WITHINGS.DISCONNECT_CTA"),
                    style: "destructive",
                    onPress: async () => {
                        setBusy(true);
                        await disconnect();
                        setBusy(false);
                        // If the store ended up with an error after
                        // disconnect (e.g. network failure), surface
                        // it through the parent's alert handler.
                        const err = useWithingsStore.getState().error;
                        if (err && onDisconnectError) {
                            onDisconnectError(err);
                        }
                    },
                },
            ],
        );
    };

    const dotColor = connected
        ? themeColors.green[500]
        : themeColors.raw.black[200];
    const statusText = connected
        ? t("CONNECTED_DEVICES.STATUS_CONNECTED")
        : t("CONNECTED_DEVICES.STATUS_DISCONNECTED");

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: themeColors.box,
                    borderColor: themeColors.border,
                },
            ]}
        >
            <View style={styles.headerRow}>
                <View
                    style={[
                        styles.iconBubble,
                        {
                            backgroundColor: themeColors.isDark
                                ? `${themeColors.raw.blue[300]}90`
                                : `${themeColors.raw.blue[200]}30`,
                        },
                    ]}
                >
                    <Ionicons
                        name="fitness-outline"
                        size={22}
                        color={themeColors.text}
                    />
                </View>
                <View style={styles.titleColumn}>
                    <Text style={styles.providerName}>
                        {t("CONNECTED_DEVICES.WITHINGS.LABEL")}
                    </Text>
                    <View style={styles.statusRow}>
                        <View
                            style={[
                                styles.statusDot,
                                { backgroundColor: dotColor },
                            ]}
                        />
                        <Text
                            style={[
                                styles.statusText,
                                { color: themeColors.secondary },
                            ]}
                        >
                            {statusText}
                        </Text>
                    </View>
                </View>
            </View>

            <Text
                style={[styles.description, { color: themeColors.secondary }]}
            >
                {t("CONNECTED_DEVICES.WITHINGS.DESCRIPTION")}
            </Text>

            {connected && connectedAt && (
                <Text
                    style={[styles.metaLine, { color: themeColors.secondary }]}
                >
                    {t("CONNECTED_DEVICES.CONNECTED_SINCE", {
                        date: new Date(connectedAt).toLocaleDateString(),
                    })}
                </Text>
            )}
            {connected && lastSyncedAt && (
                <Text
                    style={[styles.metaLine, { color: themeColors.secondary }]}
                >
                    {t("CONNECTED_DEVICES.LAST_SYNC", {
                        date: new Date(lastSyncedAt).toLocaleString(),
                    })}
                </Text>
            )}

            <TouchableOpacity
                disabled={busy}
                onPress={connected ? handleDisconnect : handleConnect}
                activeOpacity={0.85}
                style={[
                    styles.cta,
                    {
                        backgroundColor: connected
                            ? themeColors.red[500]
                            : themeColors.green[500],
                        opacity: busy ? 0.6 : 1,
                    },
                ]}
            >
                {busy ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.ctaText}>
                        {connected
                            ? t("CONNECTED_DEVICES.WITHINGS.DISCONNECT_CTA")
                            : t("CONNECTED_DEVICES.WITHINGS.CONNECT_CTA")}
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 18,
        borderWidth: StyleSheet.hairlineWidth,
        gap: 10,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    iconBubble: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: "center",
        alignItems: "center",
    },
    titleColumn: {
        flex: 1,
    },
    providerName: {
        fontSize: 16,
        fontWeight: "700",
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2,
        gap: 6,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 12,
    },
    description: {
        fontSize: 13,
        lineHeight: 18,
        marginTop: 4,
    },
    metaLine: {
        fontSize: 11,
    },
    cta: {
        marginTop: 8,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    ctaText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
});
