import { track } from "@amplitude/analytics-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { NavigateProps } from "../../types/router.types";
import CustomButton from "../../ui/buttons/custom-button";
import LoadingDots from "../../ui/loading/loading-dots";
import BlueWave from "../../../assets/images/BlueWave.png";
import Logo from "../../../assets/images/logo.png";
import { AnimatedTyping } from "./components/animated-typing";
import { MessageBubble } from "./components/message-bubble";

export const WelcomeScreen: React.FC<NavigateProps> = ({ navigation }) => {
    const [writtingCompleted, setWrittingCompleted] = useState(false);

    const firstBubbleTranslateY = useSharedValue(-1000); // Initial value outside the screen
    const secondBubbleTranslateY = useSharedValue(-1000); // Initial value outside the screen
    const buttonsTranslateY = useSharedValue(1000);

    const [canDisplayTyping, setCanDisplayTyping] = useState(false);
    const [canDisplayDots, setCanDisplayDots] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (__DEV__) {
            track("App Launched", { mode: "development" });
        } else {
            track("App Launched", { mode: "production" });
        }
        firstBubbleTranslateY.value = withSpring(-275, {
            damping: 5,
            stiffness: 10,
        });

        setTimeout(() => {
            setCanDisplayTyping(true);
        }, 2500);

        if (writtingCompleted) {
            secondBubbleTranslateY.value = withSpring(-200, {
                damping: 5,
                stiffness: 15,
            });

            setTimeout(() => {
                setCanDisplayDots(true);
            }, 2500);
        }

        if (canDisplayDots) {
            setTimeout(() => {
                setCanDisplayDots(true);
            }, 2500);

            buttonsTranslateY.value = withSpring(400, {
                damping: 5,
                stiffness: 15,
            });
        }
    }, [writtingCompleted]);

    const firstBubbleAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: firstBubbleTranslateY.value }],
        };
    });

    const secondBubbleAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: secondBubbleTranslateY.value }],
        };
    });

    // const imageHeight = useMemo(() => {}, [screenHeight]);

    return (
        <View style={styles.container}>
            <Image source={BlueWave} style={styles.image} />

            <View style={{ paddingHorizontal: 20 }}>
                <Animated.View style={[firstBubbleAnimatedStyle]}>
                    <MessageBubble
                        customMessage={
                            canDisplayTyping && (
                                <AnimatedTyping
                                    text={t("AUTH.WELCOME")}
                                    onComplete={() =>
                                        setWrittingCompleted(true)
                                    }
                                />
                            )
                        }
                        customStyle={{ position: "absolute", minWidth: 50 }}
                        borderRadius="left"
                    />
                    <Image
                        source={Logo}
                        style={{
                            width: 50,
                            height: 50,
                            position: "absolute",
                            bottom: 75,
                            left: 150,
                            resizeMode: "contain",
                        }}
                    />
                </Animated.View>
                {writtingCompleted && (
                    <Animated.View style={[secondBubbleAnimatedStyle]}>
                        <MessageBubble
                            customMessage={
                                canDisplayDots && (
                                    <LoadingDots
                                        dots={3}
                                        colors={[
                                            "#0C0C0C",
                                            "#0C0C0C",
                                            "#0C0C0C",
                                        ]}
                                        size={8}
                                        bounceHeight={6}
                                    />
                                )
                            }
                            customStyle={styles.messageBubble}
                            borderRadius="right"
                        />
                    </Animated.View>
                )}
            </View>
            <View style={{ flex: 1, paddingHorizontal: 20 }}>
                <CustomButton
                    title={t("AUTH.LOGIN_BUTTON")}
                    onPress={() => navigation.replace("Login")}
                    customStyle={{ marginTop: 20 }}
                />

                <CustomButton
                    title={t("AUTH.REGISTER_BUTTON")}
                    onPress={() => navigation.replace("Register")}
                    customStyle={{ marginTop: 20 }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    image: {
        width: "100%",
        height: "55%",
        resizeMode: "stretch",
    },
    messageBubble: {
        position: "absolute",
        alignSelf: "flex-end",
        minWidth: 50,
    },
});
