export const useSystemDateFormat = () => {
    const formattedDate = new Intl.DateTimeFormat().formatToParts(new Date());
    const parts = formattedDate
        .filter(
            ({ type }) => type === "day" || type === "month" || type === "year"
        )
        .map(({ type }) => {
            switch (type) {
                case "day":
                    return "DD";
                case "month":
                    return "MM";
                case "year":
                    return "YYYY";
                default:
                    return "";
            }
        });

    return parts.join("/");
};
