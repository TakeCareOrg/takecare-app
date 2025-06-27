import React from "react";
import { DimensionValue, View, ViewStyle } from "react-native";

type LineVariant = "solid" | "dashed" | "dotted";

interface LineComponentProps {
    variant?: LineVariant;
    color?: string;
    height?: number;
    segmentSize?: number;
    gapSize?: number;
    style?: ViewStyle;
    width?: DimensionValue;
}

export const LineComponent = ({
    variant = "solid",
    color = "black",
    height = 1,
    segmentSize = 2,
    gapSize = 4,
    style,
    width = "100%",
}: LineComponentProps) => {
    if (variant === "dotted" || variant === "dashed") {
        const totalWidth = typeof width === "number" ? width : 1000;
        const elementWidth =
            variant === "dotted" ? segmentSize : segmentSize * 3;
        const count = Math.ceil(totalWidth / (elementWidth + gapSize));

        return (
            <View
                style={[
                    {
                        height,
                        width,
                        flexDirection: "row",
                        alignItems: "center",
                    },
                    style,
                ]}
            >
                {Array.from({ length: count }).map((_, i) => (
                    <View
                        key={i}
                        style={{
                            width: elementWidth,
                            height,
                            borderRadius: variant === "dotted" ? height / 2 : 0,
                            marginRight: gapSize,
                            borderWidth: 0.8,
                            borderColor: color,
                        }}
                    />
                ))}
            </View>
        );
    }

    console.log("test");

    // Pour les lignes solides, utiliser l'approche simple
    return (
        <View
            style={[
                {
                    height,
                    width,
                    backgroundColor: color,
                } as ViewStyle,
                style,
            ]}
        />
    );
};

export default LineComponent;

// Les exports nommés restent inchangés
export const DottedLine = (props: Omit<LineComponentProps, "variant">) => (
    <LineComponent {...props} variant="dotted" />
);

export const DashedLine = (props: Omit<LineComponentProps, "variant">) => (
    <LineComponent {...props} variant="dashed" />
);

export const SolidLine = (props: Omit<LineComponentProps, "variant">) => (
    <LineComponent {...props} variant="solid" />
);
