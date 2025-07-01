import React from "react";
import { View } from "react-native";

import Svg, {
    Defs,
    Rect,
    Stop,
    LinearGradient as SvgLinearGradient,
} from "react-native-svg";

type LinearGradientProps = {
    colors?: string[];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
    style?: object;
    children?: React.ReactNode;
};

const LinearGradient = ({
    colors = ["#000", "#fff"],
    start = { x: 0, y: 0 },
    end = { x: 1, y: 0 },
    style = {},
    children = null,
    ...props
}: LinearGradientProps) => {
    // Convertir les coordonnées start/end en format SVG
    const x1 = `${start.x * 100}%`;
    const y1 = `${start.y * 100}%`;
    const x2 = `${end.x * 100}%`;
    const y2 = `${end.y * 100}%`;

    // Générer un ID unique pour éviter les conflits
    const gradientId = `gradient_${Math.random().toString(36).substr(2, 9)}`;

    return (
        <View style={[{ overflow: "hidden" }, style]} {...props}>
            <Svg width="100%" height="100%" style={{ position: "absolute" }}>
                <Defs>
                    <SvgLinearGradient
                        id={gradientId}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                    >
                        {colors.map((color, index) => (
                            <Stop
                                key={index}
                                offset={`${(index / (colors.length - 1)) * 100}%`}
                                stopColor={color}
                                stopOpacity="1"
                            />
                        ))}
                    </SvgLinearGradient>
                </Defs>
                <Rect width="100%" height="100%" fill={`url(#${gradientId})`} />
            </Svg>
            {children && <View style={{ flex: 1, zIndex: 1 }}>{children}</View>}
        </View>
    );
};

export default LinearGradient;
