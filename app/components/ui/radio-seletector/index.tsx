import { RadioItem } from "./item";

type HealthGoalsProps = {
    values: {
        value: string | number;
        text: string | number;
    }[];
    onChange: (selected: string | number) => void;
};

export const RadioSelector = ({ values, onChange }: HealthGoalsProps) => {
    return (
        values &&
        values.map((e, i) => {
            return (
                <RadioItem
                    key={`${e?.value}-${i}`}
                    option={{ label: e?.text, value: e?.value }}
                    isSelected={
                        values?.some((item) => item.value === e.value) ?? false
                    }
                    onSelect={(e) => {
                        onChange?.(e);
                    }}
                />
            );
        })
    );
};
