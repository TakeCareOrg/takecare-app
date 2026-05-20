import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { moveAsync } from "expo-file-system/legacy";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { Text } from "@components/ui/text";
import { UserInfoPayload } from "@dtypes/base/users";
import { BasesHealthValue, SleepAnalysis } from "@dtypes/health-data-types";
import { useColorTheme } from "@hooks/use-color-theme";
import { useHealthDataStore } from "@stores/health-data";

interface Props {
    isVisible: boolean;
    onClose: () => void;
    user: UserInfoPayload;
}

interface HealthMetrics {
    avgSteps: number | null;
    lastHeartRate: number | null;
    avgSleep: string | null;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const calculateAge = (birthDate: Date | string): number => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
};

const calculateBMI = (
    weight?: number,
    weightUnit?: string,
    height?: number,
    heightUnit?: string,
): string | null => {
    if (!weight || !height) return null;
    const kg = weightUnit === "lbs" ? weight * 0.453592 : weight;
    const m = heightUnit === "ft" ? height * 0.3048 : height / 100;
    return (kg / (m * m)).toFixed(1);
};

const calculateAvgWeeklySteps = (
    steps: BasesHealthValue[] | null,
): number | null => {
    if (!steps || steps.length === 0) return null;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dayMap = new Map<string, number>();
    steps.forEach((entry) => {
        if (new Date(entry.startDate) >= sevenDaysAgo) {
            const key = entry.startDate.split("T")[0];
            dayMap.set(key, (dayMap.get(key) || 0) + entry.value);
        }
    });
    if (dayMap.size === 0) return null;
    const total = Array.from(dayMap.values()).reduce((s, v) => s + v, 0);
    return Math.round(total / dayMap.size);
};

const calculateAvgSleep = (sleepSteps: SleepAnalysis[]): string | null => {
    const withDuration = sleepSteps.filter((s) => (s.duration ?? 0) >= 60);
    if (withDuration.length === 0) return null;
    const recent = withDuration.slice(-7);
    const avg =
        recent.reduce((sum, s) => sum + (s.duration || 0), 0) / recent.length;
    const h = Math.floor(avg / 3600);
    const min = Math.floor((avg % 3600) / 60);
    return `${h}h${String(min).padStart(2, "0")}`;
};

// ─── HTML template ───────────────────────────────────────────────────────────

const generateHtml = (
    user: UserInfoPayload,
    t: (key: string) => string,
    lang: string,
    metrics: HealthMetrics,
): string => {
    const health = user.health;
    const age = health?.birth_date ? calculateAge(health.birth_date) : null;
    const bmi = calculateBMI(
        health?.weight,
        health?.weight_unit,
        health?.height,
        health?.height_unit,
    );
    const generatedDate = new Date().toLocaleDateString(lang, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const yesNo = (arr?: string[]) =>
        arr && arr.length > 0
            ? t("PROFILE.VALUES.YES")
            : t("PROFILE.VALUES.NO");
    const listOrNone = (arr?: string[]) =>
        !arr || arr.length === 0 ? t("PROFILE.VALUES.NO") : arr.join(", ");

    const field = (emoji: string, label: string, value: string, cls = "") =>
        `<div class="field"><div class="field-label">${emoji} ${label}</div><div class="field-value ${cls}">${value}</div></div>`;

    const metricsSection =
        metrics.avgSteps || metrics.lastHeartRate || metrics.avgSleep
            ? `<div class="section">
      <div class="section-title">📊 ${t("MEDICAL_RECORD.SECTIONS.HEALTH_METRICS")}</div>
      <div class="grid">
        ${metrics.avgSteps ? field("👟", t("MEDICAL_RECORD.AVG_STEPS"), metrics.avgSteps.toLocaleString(lang), "highlight") : ""}
        ${metrics.lastHeartRate ? field("❤️", t("MEDICAL_RECORD.HEART_RATE"), `${metrics.lastHeartRate} ${t("MEDICAL_RECORD.BPM")}`, "highlight") : ""}
        ${metrics.avgSleep ? field("😴", t("MEDICAL_RECORD.AVG_SLEEP"), metrics.avgSleep, "highlight") : ""}
      </div>
    </div>`
            : "";

    const statPill = (label: string, value: string) =>
        `<span class="stat-pill">${label} <strong>${value}</strong></span>`;

    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; background: #f0f2ff; color: #1a1a2e; }
  .page { max-width: 800px; margin: 0 auto; background: white; }
  /* Header — solid color (expo-print ne supporte pas les gradients) */
  .header { background: #667eea; color: white; padding: 32px 40px 28px; page-break-inside: avoid; break-inside: avoid; }
  .logo { font-size: 11px; font-weight: 700; letter-spacing: 2px; color: rgba(255,255,255,0.75); text-transform: uppercase; margin-bottom: 10px; }
  .title { font-size: 28px; font-weight: 800; color: white; margin-bottom: 2px; }
  .subtitle { font-size: 13px; color: rgba(255,255,255,0.75); margin-bottom: 18px; }
  .patient-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .patient-name { font-size: 20px; font-weight: 700; color: white; }
  .header-stats { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
  .stat-pill { background: rgba(255,255,255,0.22); border-radius: 20px; padding: 4px 12px; font-size: 12px; color: white; }
  .stat-pill strong { font-weight: 700; }
  .generated { font-size: 11px; color: rgba(255,255,255,0.6); }
  /* Body */
  .body { padding: 28px 40px 36px; }
  .disclaimer { padding: 11px 14px; background: #fef9c3; border-left: 3px solid #f59e0b; margin-bottom: 22px; border-radius: 0 6px 6px 0; page-break-inside: avoid; break-inside: avoid; }
  .disclaimer-text { font-size: 11px; color: #854d0e; line-height: 1.5; }
  .section { margin-bottom: 22px; page-break-inside: avoid; break-inside: avoid; }
  .section-title { font-size: 11px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase; color: #667eea; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1.5px solid #e0e7ff; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .field { background: #f8f9ff; border-radius: 8px; padding: 10px 14px; page-break-inside: avoid; break-inside: avoid; border: 1px solid #e8eaf6; }
  .field-label { font-size: 9.5px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .field-value { font-size: 14px; font-weight: 500; color: #1a1a2e; }
  .field-value.highlight { color: #667eea; font-weight: 700; font-size: 16px; }
  .tag-yes { color: #16a34a; font-weight: 600; }
  .tag-no { color: #6b7280; }
  /* Footer */
  .footer { padding: 14px 40px; background: #f8f9ff; border-top: 1px solid #e0e7ff; display: flex; justify-content: space-between; align-items: center; }
  .footer-text { font-size: 10px; color: #9ca3af; }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="logo">TAKECARE — Dossier Medical</div>
    <div class="title">${user.first_name} ${user.last_name}</div>
    <div class="subtitle">${t("MEDICAL_RECORD.SUBTITLE")}</div>
    <div class="header-stats">
      ${age !== null ? statPill(t("PROFILE.HEALTH_ITEMS.AGE"), `${age} ${t("MEDICAL_RECORD.YEARS")}`) : ""}
      ${health?.gender ? statPill(t("PROFILE.HEALTH_ITEMS.GENDER"), t(`PROFILE.VALUES.${health.gender.toUpperCase()}`)) : ""}
      ${health?.weight ? statPill(t("PROFILE.HEALTH_ITEMS.WEIGHT"), `${health.weight} ${health.weight_unit || ""}`) : ""}
      ${health?.height ? statPill(t("PROFILE.HEALTH_ITEMS.HEIGHT"), `${health.height} ${health.height_unit || ""}`) : ""}
      ${bmi ? statPill("IMC", bmi) : ""}
      ${statPill("Email", user.email)}
    </div>
    <div class="generated">${t("MEDICAL_RECORD.GENERATED_ON")} ${generatedDate}</div>
  </div>
  <div class="body">
    <div class="disclaimer">
      <div class="disclaimer-text">${t("MEDICAL_RECORD.DISCLAIMER")}</div>
    </div>
    <div class="section">
      <div class="section-title">${t("MEDICAL_RECORD.SECTIONS.LIFESTYLE")}</div>
      <div class="grid">
        ${field("", t("PROFILE.HEALTH_ITEMS.ALCOHOL"), health?.alcohol ? t(`PROFILE.VALUES.${health.alcohol.toUpperCase()}`) : "—")}
        ${field("", t("PROFILE.HEALTH_ITEMS.SMOKING"), health?.smoking ? t(`PROFILE.VALUES.${health.smoking.toUpperCase()}`) : "—")}
        ${field("", t("PROFILE.HEALTH_ITEMS.SPORTS"), yesNo(health?.practice_sports), health?.practice_sports?.length ? "tag-yes" : "tag-no")}
        ${field("", t("PROFILE.HEALTH_ITEMS.PROFESSIONAL_HELP"), yesNo(health?.professional_help), health?.professional_help?.length ? "tag-yes" : "tag-no")}
      </div>
    </div>
    <div class="section">
      <div class="section-title">${t("MEDICAL_RECORD.SECTIONS.MEDICAL_HISTORY")}</div>
      <div class="grid">
        ${field("", t("PROFILE.HEALTH_ITEMS.CHRONIC_ILLNESS"), listOrNone(health?.chronic_illness))}
        ${field("", t("PROFILE.HEALTH_ITEMS.ALLERGIES"), listOrNone(health?.allergies))}
        ${field("", t("PROFILE.HEALTH_ITEMS.MEDICATION_TREATMENT"), listOrNone(health?.medication_treatment))}
        ${field("", t("PROFILE.HEALTH_ITEMS.PREVIOUS_SURGERY"), listOrNone(health?.surgery_before))}
      </div>
    </div>
    ${metricsSection}
  </div>
  <div class="footer">
    <div class="footer-text">TakeCare — ${t("MEDICAL_RECORD.CONFIDENTIAL")}</div>
    <div class="footer-text">${generatedDate}</div>
  </div>
</div>
</body>
</html>`;
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const RecordRow = ({
    emoji,
    label,
    value,
}: {
    emoji: string;
    label: string;
    value: string;
}) => {
    const themeColors = useColorTheme();
    // Border draws a crisp edge on light theme where `colors.box`
    // (#F2EFF8) otherwise melts into the page background.
    const borderColor = themeColors.isDark
        ? "rgba(255,255,255,0.08)"
        : "rgba(60, 73, 192, 0.18)";
    // Labels need a darker hue in light theme — `themeColors.secondary`
    // (#8A8A8A) sits too close to the box fill to read at a glance.
    const labelColor = themeColors.isDark ? themeColors.secondary : "#4B5563";
    return (
        <View
            style={[
                styles.recordRow,
                {
                    backgroundColor: themeColors.box,
                    borderColor,
                },
            ]}
        >
            <Text style={[styles.recordLabel, { color: labelColor }]}>
                {emoji} {label}
            </Text>
            <Text
                style={[styles.recordValue, { color: themeColors.text }]}
                numberOfLines={2}
            >
                {value}
            </Text>
        </View>
    );
};

const Section = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => {
    const themeColors = useColorTheme();
    return (
        <View style={styles.section}>
            <Text
                style={[styles.sectionTitle, { color: themeColors.blue[400] }]}
            >
                {title}
            </Text>
            {children}
        </View>
    );
};

// ─── Main component ──────────────────────────────────────────────────────────

export const MedicalRecordModal = ({ isVisible, onClose, user }: Props) => {
    const themeColors = useColorTheme();
    const { t, i18n } = useTranslation("full_trads");
    const [isGenerating, setIsGenerating] = useState(false);

    const historicalCache = useHealthDataStore((s) => s.historicalCache);
    const todayCache = useHealthDataStore((s) => s.todayCache);

    const metrics: HealthMetrics = useMemo(() => {
        const steps =
            historicalCache?.data?.steps ?? todayCache?.data?.steps ?? null;
        const sleepSteps =
            historicalCache?.data?.sleepAnalysis?.sleepSteps ?? [];
        const lastHR =
            historicalCache?.data?.heartRate?.lastHeartRateValue?.value ??
            todayCache?.data?.heartRate?.lastHeartRateValue?.value ??
            null;
        return {
            avgSteps: calculateAvgWeeklySteps(steps),
            lastHeartRate: lastHR ?? null,
            avgSleep: calculateAvgSleep(sleepSteps),
        };
    }, [historicalCache, todayCache]);

    const health = user.health;
    const age = health?.birth_date ? calculateAge(health.birth_date) : null;
    const bmi = calculateBMI(
        health?.weight,
        health?.weight_unit,
        health?.height,
        health?.height_unit,
    );
    const generatedDate = new Date().toLocaleDateString(i18n.language, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const yesNo = (arr?: string[]) =>
        arr && arr.length > 0
            ? t("PROFILE.VALUES.YES")
            : t("PROFILE.VALUES.NO");
    const listOrNone = (arr?: string[]) =>
        !arr || arr.length === 0 ? t("PROFILE.VALUES.NO") : arr.join(", ");

    const handleDownload = async () => {
        setIsGenerating(true);
        try {
            const html = generateHtml(user, t, i18n.language, metrics);
            const { uri } = await Print.printToFileAsync({
                html,
                base64: false,
            });
            const date = new Date().toISOString().split("T")[0];
            const last = user.last_name.toLowerCase().replace(/\s+/g, "-");
            const first = user.first_name.toLowerCase().replace(/\s+/g, "-");
            const fileName = `dossier-medical-${last}-${first}-${date}.pdf`;
            const destUri =
                uri.substring(0, uri.lastIndexOf("/") + 1) + fileName;
            let shareUri = uri;
            try {
                await moveAsync({ from: uri, to: destUri });
                shareUri = destUri;
            } catch {
                // fallback to original uri if rename fails
            }
            const canShare = await Sharing.isAvailableAsync();
            if (canShare) {
                await Sharing.shareAsync(shareUri, {
                    mimeType: "application/pdf",
                    dialogTitle: t("MEDICAL_RECORD.SHARE_TITLE"),
                    UTI: Platform.OS === "ios" ? "com.adobe.pdf" : undefined,
                });
            }
        } catch {
            // sharing cancelled or failed silently
        } finally {
            setIsGenerating(false);
        }
    };

    const hasMetrics =
        metrics.avgSteps !== null ||
        metrics.lastHeartRate !== null ||
        metrics.avgSleep !== null;

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView
                style={[
                    styles.container,
                    { backgroundColor: themeColors.background },
                ]}
            >
                <View
                    style={[
                        styles.header,
                        { borderBottomColor: themeColors.border },
                    ]}
                >
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Text
                            style={{
                                color: themeColors.blue[400],
                                fontSize: 16,
                            }}
                        >
                            {t("COMMON.CLOSE")}
                        </Text>
                    </TouchableOpacity>
                    <Text
                        style={[
                            styles.headerTitle,
                            { color: themeColors.text },
                        ]}
                    >
                        🏥 {t("MEDICAL_RECORD.TITLE")}
                    </Text>
                    <View style={styles.closeBtn} />
                </View>

                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View
                        style={[
                            styles.heroCard,
                            { backgroundColor: themeColors.blue[400] },
                        ]}
                    >
                        <Text style={styles.heroLabel}>
                            {t("MEDICAL_RECORD.PATIENT")}
                        </Text>
                        <Text style={styles.heroName}>
                            👤 {user.first_name} {user.last_name}
                        </Text>
                        <View style={styles.heroStats}>
                            {age !== null && (
                                <View style={styles.heroStatPill}>
                                    <Text style={styles.heroStatText}>
                                        🎂 {age} {t("MEDICAL_RECORD.YEARS")}
                                    </Text>
                                </View>
                            )}
                            {health?.gender && (
                                <View style={styles.heroStatPill}>
                                    <Text style={styles.heroStatText}>
                                        ⚧{" "}
                                        {t(
                                            `PROFILE.VALUES.${health.gender.toUpperCase()}`,
                                        )}
                                    </Text>
                                </View>
                            )}
                            {health?.weight && (
                                <View style={styles.heroStatPill}>
                                    <Text style={styles.heroStatText}>
                                        ⚖️ {health.weight}{" "}
                                        {health.weight_unit || ""}
                                    </Text>
                                </View>
                            )}
                            {health?.height && (
                                <View style={styles.heroStatPill}>
                                    <Text style={styles.heroStatText}>
                                        📏 {health.height}{" "}
                                        {health.height_unit || ""}
                                    </Text>
                                </View>
                            )}
                            {bmi && (
                                <View style={styles.heroStatPill}>
                                    <Text style={styles.heroStatText}>
                                        📊 IMC {bmi}
                                    </Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.heroDate}>
                            📅 {t("MEDICAL_RECORD.GENERATED_ON")}{" "}
                            {generatedDate}
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.disclaimer,
                            {
                                backgroundColor: themeColors.isDark
                                    ? "rgba(245, 158, 11, 0.18)"
                                    : (themeColors.orange[100] ?? "#fde68a"),
                                borderLeftColor:
                                    themeColors.orange[500] ?? "#f59e0b",
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.disclaimerText,
                                {
                                    color: themeColors.isDark
                                        ? (themeColors.orange[200] ?? "#fcd34d")
                                        : (themeColors.orange[700] ??
                                          "#92400e"),
                                },
                            ]}
                        >
                            ⚠️ {t("MEDICAL_RECORD.DISCLAIMER")}
                        </Text>
                    </View>

                    <Section
                        title={`🌿 ${t("MEDICAL_RECORD.SECTIONS.LIFESTYLE")}`}
                    >
                        <View style={styles.grid}>
                            <RecordRow
                                emoji="🍷"
                                label={t("PROFILE.HEALTH_ITEMS.ALCOHOL")}
                                value={
                                    health?.alcohol
                                        ? t(
                                              `PROFILE.VALUES.${health.alcohol.toUpperCase()}`,
                                          )
                                        : "—"
                                }
                            />
                            <RecordRow
                                emoji="🚬"
                                label={t("PROFILE.HEALTH_ITEMS.SMOKING")}
                                value={
                                    health?.smoking
                                        ? t(
                                              `PROFILE.VALUES.${health.smoking.toUpperCase()}`,
                                          )
                                        : "—"
                                }
                            />
                            <RecordRow
                                emoji="🏃"
                                label={t("PROFILE.HEALTH_ITEMS.SPORTS")}
                                value={yesNo(health?.practice_sports)}
                            />
                            <RecordRow
                                emoji="🧠"
                                label={t(
                                    "PROFILE.HEALTH_ITEMS.PROFESSIONAL_HELP",
                                )}
                                value={yesNo(health?.professional_help)}
                            />
                        </View>
                    </Section>

                    <Section
                        title={`🏥 ${t("MEDICAL_RECORD.SECTIONS.MEDICAL_HISTORY")}`}
                    >
                        <View style={styles.grid}>
                            <RecordRow
                                emoji="🫀"
                                label={t(
                                    "PROFILE.HEALTH_ITEMS.CHRONIC_ILLNESS",
                                )}
                                value={listOrNone(health?.chronic_illness)}
                            />
                            <RecordRow
                                emoji="🌸"
                                label={t("PROFILE.HEALTH_ITEMS.ALLERGIES")}
                                value={listOrNone(health?.allergies)}
                            />
                            <RecordRow
                                emoji="💊"
                                label={t(
                                    "PROFILE.HEALTH_ITEMS.MEDICATION_TREATMENT",
                                )}
                                value={listOrNone(health?.medication_treatment)}
                            />
                            <RecordRow
                                emoji="🩺"
                                label={t(
                                    "PROFILE.HEALTH_ITEMS.PREVIOUS_SURGERY",
                                )}
                                value={listOrNone(health?.surgery_before)}
                            />
                        </View>
                    </Section>

                    {hasMetrics && (
                        <Section
                            title={`📊 ${t("MEDICAL_RECORD.SECTIONS.HEALTH_METRICS")}`}
                        >
                            <View style={styles.grid}>
                                {metrics.avgSteps !== null && (
                                    <RecordRow
                                        emoji="👟"
                                        label={t("MEDICAL_RECORD.AVG_STEPS")}
                                        value={metrics.avgSteps.toLocaleString(
                                            i18n.language,
                                        )}
                                    />
                                )}
                                {metrics.lastHeartRate !== null && (
                                    <RecordRow
                                        emoji="❤️"
                                        label={t("MEDICAL_RECORD.HEART_RATE")}
                                        value={`${metrics.lastHeartRate} ${t("MEDICAL_RECORD.BPM")}`}
                                    />
                                )}
                                {metrics.avgSleep !== null && (
                                    <RecordRow
                                        emoji="😴"
                                        label={t("MEDICAL_RECORD.AVG_SLEEP")}
                                        value={metrics.avgSleep}
                                    />
                                )}
                            </View>
                        </Section>
                    )}
                </ScrollView>

                <View
                    style={[
                        styles.footer,
                        {
                            borderTopColor: themeColors.border,
                            backgroundColor: themeColors.background,
                        },
                    ]}
                >
                    <TouchableOpacity
                        style={[
                            styles.downloadBtn,
                            { backgroundColor: themeColors.blue[400] },
                            isGenerating && styles.downloadBtnDisabled,
                        ]}
                        onPress={handleDownload}
                        disabled={isGenerating}
                        activeOpacity={0.8}
                    >
                        {isGenerating ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={styles.downloadBtnText}>
                                📄 {t("MEDICAL_RECORD.DOWNLOAD_PDF")}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    closeBtn: { width: 60 },
    headerTitle: { fontSize: 18, fontWeight: "800" },
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: 20 },
    heroCard: {
        margin: 16,
        borderRadius: 16,
        padding: 22,
        // Subtle shadow lifts the hero above the page in both themes
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 4,
    },
    heroLabel: {
        fontSize: 11,
        color: "rgba(255,255,255,0.7)",
        fontWeight: "600",
        letterSpacing: 1,
        textTransform: "uppercase",
        marginBottom: 6,
    },
    heroName: {
        fontSize: 22,
        fontWeight: "800",
        color: "#fff",
        marginBottom: 10,
    },
    heroStats: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
        marginBottom: 10,
    },
    heroStatPill: {
        backgroundColor: "rgba(255,255,255,0.18)",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    heroStatText: { fontSize: 12, fontWeight: "700", color: "#fff" },
    heroDate: {
        fontSize: 12,
        fontWeight: "600",
        color: "rgba(255,255,255,0.75)",
    },
    disclaimer: {
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 10,
        padding: 14,
        borderLeftWidth: 4,
    },
    disclaimerText: { fontSize: 12.5, lineHeight: 18, fontWeight: "600" },
    section: { marginHorizontal: 16, marginTop: 20 },
    sectionTitle: {
        fontSize: 13,
        fontWeight: "800",
        letterSpacing: 1.2,
        textTransform: "uppercase",
        marginBottom: 10,
    },
    /* Compact identity chips */
    chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 7,
    },
    chipEmoji: { fontSize: 15 },
    chipLabel: {
        fontSize: 9,
        fontWeight: "600",
        letterSpacing: 0.4,
        textTransform: "uppercase",
    },
    chipValue: { fontSize: 12, fontWeight: "600" },
    /* Regular grid rows */
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    recordRow: {
        width: "47.5%",
        borderRadius: 10,
        padding: 12,
        borderWidth: 1,
    },
    recordLabel: {
        fontSize: 10.5,
        fontWeight: "700",
        letterSpacing: 0.4,
        textTransform: "uppercase",
        marginBottom: 5,
    },
    recordValue: { fontSize: 14.5, fontWeight: "700" },
    footer: { padding: 16, borderTopWidth: StyleSheet.hairlineWidth },
    downloadBtn: {
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    downloadBtnDisabled: { opacity: 0.6 },
    downloadBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
