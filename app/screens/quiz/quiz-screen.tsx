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

import { QuizFooter } from "@components/health-quiz/utils/quiz-footer";
import { QuizHeader } from "@components/health-quiz/utils/quiz-header";
import { BubbleBlurView } from "@components/ui/bubble-blur-view";
import { Text } from "@components/ui/text";
import { QuizFlowProvider, useQuizFlow } from "@contexts/quiz/quiz-context";
import { UserQuizDataProvider } from "@contexts/quiz/user-quiz-data-context";
import { useColorTheme } from "@hooks/use-color-theme";
import { useResponsive } from "@hooks/use-reponsive";

import { QuestionRenderer } from "./question-renderer";

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
            tint={
                isDark
                    ? "systemChromeMaterialDark"
                    : "systemUltraThinMaterialLight"
            }
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
        <UserQuizDataProvider>
            <QuizFlowProvider>
                <QuizScreenContent />
            </QuizFlowProvider>
        </UserQuizDataProvider>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
});
