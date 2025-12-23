import i18n from "i18next";

export const fullDateFormat = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
} satisfies Intl.DateTimeFormatOptions;

export const mediumDateFormat = {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "short",
} satisfies Intl.DateTimeFormatOptions;

export const shortDateFormat = {
    year: "numeric",
    month: "short",
    day: "numeric",
} satisfies Intl.DateTimeFormatOptions;

export const fullDateFormatWithTime = {
    ...fullDateFormat,
    hour: "numeric",
    minute: "numeric",
} satisfies Intl.DateTimeFormatOptions;

export const DateTimeFormat = {
    hour: "numeric",
    minute: "numeric",
};

export function safeFormatDate(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        throw new Error("Invalid date provided");
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Returns date in YYYY-MM-DD format (local time)
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

export const formatFullDate = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        throw new Error("Invalid date provided");
    }

    return date.toLocaleDateString(i18n.language, mediumDateFormat);
};
