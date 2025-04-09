import { StyleSheet } from "react-native";

export const fontWeightsStyle = (font: string, style: string) => {
    //? Techna font has only one style

    if (font === "Techna") {
        return StyleSheet.create({
            regular: {
                fontFamily: "Techna Sans Regular",
            },
        });
    }

    if (style === "italic") {
        style = "Italic";
    } else {
        style = "";
    }

    return StyleSheet.create({
        thin: {
            fontFamily: `${font} Thin${style}`,
        },
        light: {
            fontFamily: `${font} Light${style}`,
        },
        regular: {
            fontFamily: `${font} Regular${style}`,
        },
        medium: {
            fontFamily: `${font} Medium${style}`,
        },
        semibold: {
            fontFamily: `${font} SemiBold${style}`,
        },
        bold: {
            fontFamily: `${font} Bold${style}`,
        },
        extrabold: {
            fontFamily: `${font} ExtraBold${style}`,
        },
        black: {
            fontFamily: `${font} Black${style}`,
        },
        extraLight: {
            fontFamily: `${font} ExtraLight${style}`,
        },
    });
};
