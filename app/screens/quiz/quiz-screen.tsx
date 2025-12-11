import { useEffect, useState } from "react";
import {
    BackHandler,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BubbleBlurView } from "@app/components/ui/bubble-blur-view";
import { Text } from "@app/components/ui/text";
import { UserDataProvider } from "@app/contexts/user-data-context";
import { useColorTheme } from "@app/hooks/use-color-theme";
import { useResponsive } from "@app/hooks/use-reponsive";

import { QuestionRenderer } from "./components/question-renderer";
import { QuizFooter } from "./components/utils/quiz-footer";
import { QuizHeader } from "./components/utils/quiz-header";
import { QuizFlowProvider, useQuizFlow } from "./quiz-context";

const QuizScreenContent = () => {
    const { text, isDark } = useColorTheme();
    const [keyboardOpen, setKeyboardOpen] = useState<boolean>(false);
    const responsivePadding = useResponsive({
        smallScreenValue: 12,
        largeScreenValue: 16,
        threshold: 700,
    });
    const { currentQuestion } = useQuizFlow();

    useEffect(() => {
        const showSubscription = Keyboard.addListener(
            "keyboardWillShow",
            () => {
                setKeyboardOpen(true);
            },
        );
        const hideSubscription = Keyboard.addListener(
            "keyboardWillHide",
            () => {
                setKeyboardOpen(false);
            },
        );

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                // This will be handled by QuizHeader
                return true;
            },
        );

        return () => backHandler.remove();
    }, []);

    return (
        <BubbleBlurView
            intensity={100}
            tint={isDark ? "dark" : "light"}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={styles.safeArea}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
                        style={{
                            flex: 1,
                            justifyContent: "space-between",
                            paddingHorizontal: responsivePadding,
                        }}
                    >
                        <View style={{ flex: 1, gap: 32 }}>
                            <QuizHeader />
                            <Text fontSize={18} weight="600" color={text}>
                                {currentQuestion?.question}
                            </Text>
                            <View style={{ justifyContent: "center" }}>
                                <QuestionRenderer />
                            </View>
                        </View>

                        <View style={{ marginTop: keyboardOpen ? 32 : 0 }}>
                            <QuizFooter />
                        </View>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </SafeAreaView>
        </BubbleBlurView>
    );
};

export const QuizScreen = () => {
    return (
        <UserDataProvider>
            <QuizFlowProvider>
                <QuizScreenContent />
            </QuizFlowProvider>
        </UserDataProvider>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
});
