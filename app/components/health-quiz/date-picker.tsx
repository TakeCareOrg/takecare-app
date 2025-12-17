import { useMemo } from "react";

import { DatePickerInput } from "@components/ui/date/date-picker";
import { InputQuizProps, QuizUserResponse } from "@dtypes/quiz-types";

type DatePickerBlockProps = InputQuizProps & {
    value?: Date;
};

export const BirthDayPicker = ({ value, onChange }: DatePickerBlockProps) => {
    const dateValue = useMemo(() => value ?? undefined, [value]);

    return (
        <DatePickerInput
            onChange={(date) => {
                onChange((prev: QuizUserResponse) => ({
                    ...prev,
                    birth_date: date,
                }));
            }}
            value={dateValue}
        />
    );
};
