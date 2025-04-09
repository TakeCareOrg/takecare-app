import React, { createContext, useState, useEffect, ReactNode } from "react";
import { Dimensions, PixelRatio } from "react-native";

// Définir les types pour les fonctions de calcul
type ResponsiveFunctions = {
    fontSizeBasedPixel: (fontSize: number) => number;
    screenWidth: number;
};

interface ResponsiveProviderProps {
    children: ReactNode;
}

// Créez le contexte avec une valeur par défaut
export const ResponsiveContext = createContext<ResponsiveFunctions>({
    fontSizeBasedPixel: () => 18,
    screenWidth: Dimensions.get("window").width,
});

const calculateFontSize = (fontSize: number, screenWidth: number): number => {
    const BASE_WIDTH = 428;
    const scale = screenWidth / BASE_WIDTH;
    if (scale > 1.2) {
        return Math.round(PixelRatio.roundToNearestPixel(fontSize * 1.2));
    }

    const newSize = fontSize * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const ResponsiveProvider = ({ children }: ResponsiveProviderProps) => {
    const [screenWidth, setScreenWidth] = useState(
        Dimensions.get("window").width
    );

    useEffect(() => {
        const handleDimensionsChange = ({
            window,
        }: {
            window: { width: number };
        }) => {
            console.log("Dimensions changed");
            setScreenWidth(window.width);
        };

        const subscription = Dimensions.addEventListener(
            "change",
            handleDimensionsChange
        );

        return () => {
            subscription?.remove();
        };
    }, []);

    const fontSizeBasedPixel = (fontSize: number): number =>
        calculateFontSize(fontSize, screenWidth);

    return (
        <ResponsiveContext.Provider value={{ fontSizeBasedPixel, screenWidth }}>
            {children}
        </ResponsiveContext.Provider>
    );
};
