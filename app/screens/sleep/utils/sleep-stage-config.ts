import { useColorTheme } from "@app/hooks/use-color-theme";
import { SleepStage } from "@app/types/health-data-types";

export const getStageColors = (
    colors: ReturnType<typeof useColorTheme>,
): Record<SleepStage["type"], string> => ({
    unknown: colors.raw.black[300],
    awake: colors.raw.orange[400],
    sleeping: colors.raw.blue[400],
    out_of_bed: colors.raw.orange[500],
    light: colors.raw.blue[400],
    deep: colors.raw.blue[700],
    rem: colors.raw.blue[100],
});

export const getStageLabels = (
    t: (key: string) => string,
): Record<SleepStage["type"], string> => ({
    unknown: t("SLEEP.STAGES.UNKNOWN"),
    awake: t("SLEEP.STAGES.AWAKE"),
    sleeping: t("SLEEP.STAGES.SLEEPING"),
    out_of_bed: t("SLEEP.STAGES.OUT_OF_BED"),
    light: t("SLEEP.STAGES.LIGHT"),
    deep: t("SLEEP.STAGES.DEEP"),
    rem: t("SLEEP.STAGES.REM"),
});

export const STAGE_VERTICAL_POSITION: Record<SleepStage["type"], number> = {
    deep: 0.05,
    light: 0.25,
    rem: 0.45,
    sleeping: 0.35,
    awake: 0.65,
    out_of_bed: 0.85,
    unknown: 0.5,
};
