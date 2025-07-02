import React, { createContext, useContext, useState } from "react";

type HomeScreenType = "Home" | "Steps";

interface NavigationContextType {
    currentHomeScreen: HomeScreenType;
    navigateToSteps: () => void;
    resetToHome: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
    undefined,
);

let globalResetToHome: (() => void) | null = null;

export const resetHomeFromOutside = () => {
    if (globalResetToHome) {
        globalResetToHome();
    }
};

export const NavigationProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [currentHomeScreen, setCurrentHomeScreen] =
        useState<HomeScreenType>("Home");

    const navigateToSteps = () => {
        setCurrentHomeScreen("Steps");
    };

    const resetToHome = () => {
        setCurrentHomeScreen("Home");
    };

    React.useEffect(() => {
        globalResetToHome = resetToHome;
        return () => {
            globalResetToHome = null;
        };
    }, []);

    return (
        <NavigationContext.Provider
            value={{
                currentHomeScreen,
                navigateToSteps,
                resetToHome,
            }}
        >
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigationContext = () => {
    const context = useContext(NavigationContext);
    if (context === undefined) {
        throw new Error(
            "useNavigationContext must be used within a NavigationProvider",
        );
    }
    return context;
};
