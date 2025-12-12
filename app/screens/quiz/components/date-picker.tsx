import { useMemo } from "react";

import { DatePickerInput } from "@components/ui/date/date-picker";
import { InputQuizProps, QuizUserResponse } from "@dtypes/quiz-types";

type DatePickerBlockProps = InputQuizProps & {
    value?: number;
};

export const BirthDayPicker = ({ value, onChange }: DatePickerBlockProps) => {
    const dateValue = useMemo(
        () => (value ? new Date(value) : undefined),
        [value],
    );

    return (
        <DatePickerInput
            onChange={(date) => {
                onChange((prev: QuizUserResponse) => ({
                    ...prev,
                    age: date?.getTime() ?? undefined,
                }));
            }}
            value={dateValue}
        />
    );
};
