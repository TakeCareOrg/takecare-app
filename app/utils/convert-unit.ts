import { HeightUnit, WeightUnit } from "@dtypes/quiz-types";

const CM_TO_FT = 1 / 30.48; // 1 cm = 0.0328084 ft
const FT_TO_CM = 30.48; // 1 ft = 30.48 cm

const KG_TO_LBS = 2.20462262185; // 1 kg = 2.20462262185 lbs
const LBS_TO_KG = 1 / 2.20462262185; // 1 lbs = 0.45359237 kg

/**
 *? Convert height between cm and ft
 */
export const convertHeight = (
    value: number,
    fromUnit: HeightUnit,
    toUnit: HeightUnit,
): number => {
    if (isNaN(value) || value === null || value === undefined) {
        return 0;
    }

    if (fromUnit === toUnit) {
        return value;
    }

    if (fromUnit === "cm" && toUnit === "ft") {
        const ftValue = value * CM_TO_FT;
        return Math.round(ftValue * 10) / 10; // Round to 1 decimal place
    } else {
        const cmValue = value * FT_TO_CM;
        return Math.round(cmValue); // Round to nearest whole number
    }
};

/**
 *? Convert weight between kg and lbs
 */
export const convertWeight = (
    value: number,
    fromUnit: WeightUnit,
    toUnit: WeightUnit,
): number => {
    if (isNaN(value) || value === null || value === undefined) {
        return 0;
    }

    if (fromUnit === toUnit) {
        return value;
    }

    if (fromUnit === "kg" && toUnit === "lbs") {
        const lbsValue = value * KG_TO_LBS;
        return Math.round(lbsValue * 5) / 5; // Round to nearest 0.2
    } else {
        const kgValue = value * LBS_TO_KG;
        return Math.round(kgValue * 5) / 5; // Round to nearest 0.2
    }
};

/**
 *? Format display value based on unit
 */
export const formatDisplayValue = (
    value: number,
    unit: HeightUnit | WeightUnit,
): number => {
    if (unit === "cm") {
        return Math.round(value);
    } else if (unit === "ft") {
        return Math.round(value * 10) / 10;
    } else {
        // For weight, always display as is (already rounded in conversion)
        return value;
    }
};
