import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import DatePicker from "react-native-date-picker";

import { useColorTheme } from "@app/hooks/use-color-theme";
import i18n from "@app/i18n";
import { DateTimeFormat, fullDateFormatWithTime } from "@app/utils/date";
import { capitalizeFirstLetter } from "@app/utils/text";

import { Text } from "../text";

type DatePickerInputProps = {
    value: Date;
    onChange: (date: Date | undefined) => void;
    maximumDate?: Date;
    minimumDate?: Date;
    isModal?: boolean;
    confirmText?: string;
    cancelText?: string;
    title?: string;
    mode?: "date" | "time" | "datetime";
    variant?: "primary" | "outline";
};

export const DatePickerInput = ({
    value,
    onChange,
    maximumDate = new Date(),
    minimumDate = new Date(1900, 0, 1),
    isModal = true,
    confirmText,
    cancelText,
    title,
    mode = "date",
    variant = "primary",
}: DatePickerInputProps) => {
    const locale = i18n.language;
    const [isVisible, setIsVisible] = useState(false);
    const { t } = useTranslation("full_trads");
    const confirmLabel = confirmText ?? t("COMMON.CONFIRM");
    const cancelLabel = cancelText ?? t("COMMON.CANCEL");
    const titleLabel = title ?? t("COMMON.SELECT_DATE");
    const { blue, isDark, border, background } = useColorTheme();

    const formatOptions =
        mode === "date"
            ? { year: "numeric", month: "long", day: "numeric" }
            : mode === "time"
              ? DateTimeFormat
              : fullDateFormatWithTime;

    const handleOpen = () => {
        setIsVisible(true);
    };

    const handleClose = (date?: Date) => {
        onChange(date);
        setIsVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={handleOpen}
                style={[
                    styles.input,
                    variant === "outline" && { borderColor: border },
                    variant === "primary" && {
                        backgroundColor: background,
                        borderColor: border,
                    },
                ]}
            >
                <Text weight="500">
                    {capitalizeFirstLetter(
                        value.toLocaleString(
                            locale,
                            formatOptions as Intl.DateTimeFormatOptions,
                        ),
                    )}
                </Text>
            </TouchableOpacity>
            {isVisible && (
                <DatePicker
                    modal={isModal}
                    open={isModal ? isVisible : undefined}
                    date={new Date(value)}
                    onDateChange={(date) => {
                        if (!isModal) {
                            handleClose(date);
                        }
                    }}
                    mode={mode}
                    locale={locale}
                    maximumDate={maximumDate}
                    minimumDate={minimumDate}
                    onCancel={() => handleClose()}
                    onConfirm={(date) => handleClose(date)}
                    confirmText={confirmLabel}
                    cancelText={cancelLabel}
                    title={titleLabel}
                    buttonColor={blue[300]}
                    dividerColor={blue[300]}
                    theme={isDark ? "dark" : "light"}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    input: {
        borderRadius: 16,
        borderWidth: 2,
        paddingHorizontal: 10,
        paddingVertical: 12,
    },
});
