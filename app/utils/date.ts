export function safeFormatDate(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        throw new Error("Invalid date provided");
    }
    return date.toISOString().split("T")[0]; // Returns date in YYYY-MM-DD format
}
