import { useCallback } from "react";
import { Alert } from "react-native";

import { Message } from "@dtypes/chatbot/chatbot-types";

import { useImageAnalyzer } from "./use-image-analyzer";

interface UseChatImageFlowOptions {
    locale: string;
    messageText: string;
    setMessageText: (text: string) => void;
    addMessage: (message: Message) => void;
    removeMessage: (id: string) => void;
    t: (key: string) => string;
}

export const useChatImageFlow = ({
    locale,
    messageText,
    setMessageText,
    addMessage,
    removeMessage,
    t,
}: UseChatImageFlowOptions) => {
    const { isAnalyzing, pickImage, takePhoto, analyzeImage } =
        useImageAnalyzer();

    const processImage = useCallback(
        async (imageUri: string | null) => {
            if (!imageUri) return;

            const contextText = messageText.trim();

            addMessage({
                id: Date.now().toString(),
                content: contextText || t("CHAT.IMAGE_MESSAGE"),
                role: "user",
                timestamp: new Date(),
                imageUri,
            });

            const tempId = `${Date.now()}-temp`;
            addMessage({
                id: tempId,
                content: t("CHAT.ANALYZING_IMAGE"),
                role: "assistant",
                timestamp: new Date(),
            });
            setMessageText("");

            try {
                const context = contextText
                    ? `User language: ${locale}. Context: ${contextText}`
                    : `User language: ${locale}. Analyze this medical image in ${locale}.`;
                const result = await analyzeImage(imageUri, context);

                removeMessage(tempId);
                addMessage({
                    id: `${Date.now()}-analysis`,
                    content: `${t("CHAT.IMAGE_ANALYSIS_PREFIX")}\n\n${result.diagnosis}\n\n${t("CHAT.IMAGE_ANALYSIS_SUFFIX")}`,
                    role: "assistant",
                    timestamp: new Date(),
                });
            } catch {
                removeMessage(tempId);
                addMessage({
                    id: `${Date.now()}-error`,
                    content: t("CHAT.IMAGE_ANALYSIS_ERROR"),
                    role: "assistant",
                    timestamp: new Date(),
                });
            }
        },
        [
            messageText,
            addMessage,
            removeMessage,
            setMessageText,
            analyzeImage,
            locale,
            t,
        ],
    );

    const handleImagePress = useCallback(() => {
        Alert.alert(
            t("CHAT.IMAGE_UPLOAD_TITLE"),
            t("CHAT.IMAGE_UPLOAD_MESSAGE"),
            [
                {
                    text: t("CHAT.TAKE_PHOTO"),
                    onPress: () => takePhoto().then(processImage),
                },
                {
                    text: t("CHAT.SELECT_FROM_GALLERY"),
                    onPress: () => pickImage().then(processImage),
                },
                { text: t("COMMON.CANCEL"), style: "cancel" },
            ],
        );
    }, [t, takePhoto, pickImage, processImage]);

    return { isAnalyzing, handleImagePress };
};
