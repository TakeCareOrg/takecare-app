import i18n from "i18next";

export function safeFormatDate(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        throw new Error("Invalid date provided");
    }
    return date.toISOString().split("T")[0]; // Returns date in YYYY-MM-DD format
}

export const formatHour = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        throw new Error("Invalid date provided");
    }

    return date.toLocaleTimeString(i18n.language, {
        hour: "2-digit",
        minute: "2-digit",
    });
};
