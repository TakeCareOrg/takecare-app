import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useDebouncedCallback } from "use-debounce";
import { BackArrowIcon } from "../../../../assets/icons/BackArrowIcon";
import { useAuth } from "../../../contexts/auth-context";
import { useColors } from "../../../styles/Colors";
import { userHealthProps } from "../../../types/auth.types";
import { Question, QuizUserResponse } from "../../../types/quiz.types";
import { NavigateProps } from "../../../types/router.types";
import Loading from "../../../ui/loading";
import { TextComponent } from "../../../ui/text-component";
import { QuestionsQuiz } from "../../../utils/questions-quiz";
import { RenderInputQuiz } from "../../../utils/render-input-quiz";

type RouteParams = {
    params: {
        dataKey: string;
    };
};

export const UpdateUserScreen: React.FC<NavigateProps> = ({ navigation }) => {
    const { main } = useColors();
    const questions: Array<Question> = QuestionsQuiz();
    const { makeAPICall, user, updateUserHealthData } = useAuth();
    const route = useRoute<RouteProp<RouteParams>>();
    const { dataKey } = route.params;
    const { t } = useTranslation();

    const [data, setData] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);

    const getLang = async () => {
        try {
            const lang = await AsyncStorage.getItem("@Lang");
            return lang || "en";
        } catch (error) {
            console.error("Error getting language", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!dataKey) return;

            const lang = await getLang();
            setLoading(true);

            try {
                let fetchedData = null;

                switch (dataKey) {
                    case "allergies":
                        fetchedData = await makeAPICall(
                            "GET",
                            `/medical/allergies?lang=${lang}`,
                        );
                        break;
                    case "professional_help":
                        fetchedData = await makeAPICall(
                            "GET",
                            `/medical/jobs?lang=${lang}`,
                        );
                        break;
                    case "practice_sports":
                        fetchedData = await makeAPICall(
                            "GET",
                            `/medical/sports?lang=${lang}`,
                        );
                        break;
                    case "chronic_illnesses":
                        fetchedData = await makeAPICall(
                            "GET",
                            `/medical/chronic_illnesses?lang=${lang}`,
                        );
                        break;
                    case "surgery_before":
                        fetchedData = await makeAPICall(
                            "GET",
                            `/medical/surgical_interventions?lang=${lang}`,
                        );
                        break;
                    default:
                        break;
                }

                let key = dataKey;
                if (dataKey === "professional_help") {
                    key = "jobs";
                } else if (dataKey === "practice_sports") {
                    key = "sports";
                } else if (dataKey === "chronic_illnesses") {
                    key = "chronic_illnesses";
                } else if (dataKey === "surgery_before") {
                    key = "surgical_interventions";
                } else {
                    key = dataKey;
                }

                setData({ [key]: fetchedData });
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dataKey]);

    const [userResponse, setUserResponse] = useState<userHealthProps>(
        user?.health || {},
    );

    const updateData = useDebouncedCallback(
        (data: { [key: string]: number | string }) => {
            updateUserHealthData(data);
        },
        500,
    );

    const updateUserResponse = (
        key: keyof QuizUserResponse,
        value: string | number,
    ) => {
        console.log("updateUserResponse", key, value);

        setUserResponse((prev) => ({
            ...prev,
            [key]: value,
        }));

        updateData({
            [key]: value,
        });
    };

    const question = questions.find((q) => q.key === dataKey);

    if (!question || loading) {
        return <Loading />;
    }

    return (
        <SafeAreaView
            style={[styles.safeArea, { backgroundColor: main.background }]}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
                    style={{ flex: 1, padding: 20 }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            rowGap: 8,
                            alignItems: "center",
                            marginBottom: 24,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Profile")}
                        >
                            <BackArrowIcon
                                width={18}
                                height={18}
                                style={{ marginRight: 16 }}
                            />
                        </TouchableOpacity>

                        <TextComponent fontSize={26}>
                            {t(`PROFILE.UPDATE_USER.${dataKey.toUpperCase()}`)}
                        </TextComponent>
                    </View>

                    <View style={{ flex: 1 }}>
                        <RenderInputQuiz
                            data={data}
                            loading={loading}
                            question={question}
                            updateUserResponse={updateUserResponse}
                            userResponse={userResponse}
                            setUserResponse={setUserResponse}
                        />
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
});
