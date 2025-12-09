import React, { useEffect, useState } from "react";
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

import { UserDataProvider } from "@app/contexts/user-data-context";
import { useColorTheme } from "@hooks/use-color-theme";

import { QuestionRenderer } from "./components/question-renderer";
import { QuizFooter } from "./components/utils/quiz-footer";
import { QuizHeader } from "./components/utils/quiz-header";
import { QuizFlowProvider } from "./quiz-context";

const QuizScreenContent = () => {
    const { background } = useColorTheme();
    const [keyboardOpen, setKeyboardOpen] = useState<boolean>(false);

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
        <SafeAreaView
            style={[styles.safeArea, { backgroundColor: background }]}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
                    style={{
                        flex: 1,
                        padding: 20,
                        justifyContent: "space-between",
                    }}
                >
                    <QuizHeader />

                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <QuestionRenderer />
                    </View>

                    <View style={{ marginTop: keyboardOpen ? 32 : 0 }}>
                        <QuizFooter />
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
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
