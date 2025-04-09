import React, { createContext, useState } from "react";

const VisibilityContext = createContext({
    isVisible: true,
    toggleVisibility: () => {},
    toggleInvisibility: () => {},
});

const VisibilityProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [isVisible, setIsVisible] = useState(true);

    function toggleVisibility() {
        setIsVisible(true);
    }
    function toggleInvisibility() {
        setIsVisible(false);
    }

    return (
        <VisibilityContext.Provider
            value={{ isVisible, toggleVisibility, toggleInvisibility }}
        >
            {children}
        </VisibilityContext.Provider>
    );
};

export { VisibilityProvider, VisibilityContext };
