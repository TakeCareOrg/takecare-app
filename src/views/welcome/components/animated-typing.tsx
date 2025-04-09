import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

interface AnimatedTypingProps {
    text: string;
    fontSize?: number;
    customStyle?: object;
    onComplete?: () => void;
}

export const AnimatedTyping: React.FC<AnimatedTypingProps> = (props) => {
    const [text, setText] = useState<string>("");
    const [cursorColor, setCursorColor] = useState<string>("transparent");
    const [textIndex, setTextIndex] = useState<number>(0);
    const [timeouts, setTimeouts] = useState<{
        cursorTimeout?: NodeJS.Timeout;
        typingTimeout?: NodeJS.Timeout;
    }>({});

    const textRef = useRef<string>(text);
    textRef.current = text;

    const textIndexRef = useRef<number>(textIndex);
    textIndexRef.current = textIndex;

    const timeoutsRef = useRef<{
        cursorTimeout?: NodeJS.Timeout;
        typingTimeout?: NodeJS.Timeout;
    }>({});
    timeoutsRef.current = timeouts;

    const typingAnimation = () => {
        if (textIndexRef.current < props.text.length) {
            setText(textRef.current + props.text.charAt(textIndexRef.current));
            setTextIndex(textIndexRef.current + 1);

            const updatedTimeouts = { ...timeoutsRef.current };
            updatedTimeouts.typingTimeout = setTimeout(typingAnimation, 50);
            setTimeouts(updatedTimeouts);
        } else {
            clearInterval(timeoutsRef.current.cursorTimeout!);
            setCursorColor("transparent");

            if (props.onComplete) {
                props.onComplete();
            }
        }
    };

    const cursorAnimation = () => {
        setCursorColor((prevColor) =>
            prevColor === "transparent" ? "#0C0C0C" : "transparent"
        );
    };

    useEffect(() => {
        const updatedTimeouts = { ...timeoutsRef.current };
        updatedTimeouts.typingTimeout = setTimeout(typingAnimation, 500);
        updatedTimeouts.cursorTimeout = setInterval(cursorAnimation, 250);
        setTimeouts(updatedTimeouts);

        return () => {
            clearTimeout(timeoutsRef.current.typingTimeout!);
            clearInterval(timeoutsRef.current.cursorTimeout!);
        };
    }, []);

    return (
        <View
            style={{
                ...styles.container,
                ...(props.customStyle || {}),
            }}
        >
            <Text
                style={{
                    ...styles.text,
                    fontSize: props.fontSize || 16,
                }}
            >
                {text}
                <Text
                    style={{
                        color: cursorColor,
                        fontSize: props.fontSize || 16,
                    }}
                >
                    |
                </Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
    },
    text: {
        color: "#0C0C0C",
        fontFamily: "Poppins-Regular",
    },
});
