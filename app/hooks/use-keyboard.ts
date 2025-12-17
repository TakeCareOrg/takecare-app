import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

/**
 * Custom hook to track keyboard visibility state
 * @returns boolean indicating whether the keyboard is currently visible
 */
export const useKeyboard = (): boolean => {
    const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);

    useEffect(() => {
        const showSubscription = Keyboard.addListener(
            "keyboardWillShow",
            () => {
                setIsKeyboardVisible(true);
            },
        );
        const hideSubscription = Keyboard.addListener(
            "keyboardWillHide",
            () => {
                setIsKeyboardVisible(false);
            },
        );

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    return isKeyboardVisible;
};
