import { useCallback, useState } from "react";

import { File } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

import {
    analyzeWithGemini,
    analyzeWithTogether,
} from "../../utils/api-requests";

type ComplexityLevel = "simple" | "normal" | "complex";

interface ImageAnalysisResult {
    diagnosis: string;
    complexity: ComplexityLevel;
    model_used: string;
    confidence?: string;
}

interface TechnicalComplexity {
    level: ComplexityLevel;
    flags: {
        low_resolution?: boolean;
        blurry?: boolean;
        low_contrast?: boolean;
    };
}

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    if (typeof error === "string") return error;
    if (error && typeof error === "object" && "message" in error)
        return String((error as { message: unknown }).message);
    return "An unknown error occurred";
};

const evaluateTechnicalComplexity = async (
    imageUri: string,
): Promise<TechnicalComplexity> => {
    try {
        const file = new File(imageUri);
        const size = await file.size;

        let score = 0;
        const flags: TechnicalComplexity["flags"] = {};

        if (size && size < 100000) {
            score += 1;
            flags.low_resolution = true;
        }

        let level: ComplexityLevel;
        if (score <= 1) {
            level = "simple";
        } else if (score <= 2) {
            level = "normal";
        } else {
            level = "complex";
        }

        return { level, flags };
    } catch {
        return { level: "normal", flags: {} };
    }
};

export const useImageAnalyzer = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const pickImage = useCallback(async (): Promise<string | null> => {
        try {
            const permissionResult =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permissionResult.granted) {
                throw new Error("Permission to access gallery denied");
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
                base64: false,
            });

            if (!result.canceled && result.assets?.[0]) {
                return result.assets[0].uri;
            }

            return null;
        } catch (error) {
            throw new Error(`Failed to pick image: ${getErrorMessage(error)}`);
        }
    }, []);

    const takePhoto = useCallback(async (): Promise<string | null> => {
        try {
            const permissionResult =
                await ImagePicker.requestCameraPermissionsAsync();

            if (!permissionResult.granted) {
                throw new Error("Permission to access camera denied");
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                quality: 0.8,
                base64: false,
            });

            if (!result.canceled && result.assets?.[0]) {
                return result.assets[0].uri;
            }

            return null;
        } catch (error) {
            throw new Error(`Failed to take photo: ${getErrorMessage(error)}`);
        }
    }, []);

    const analyzeImage = useCallback(
        async (
            imageUri: string,
            context: string = "",
        ): Promise<ImageAnalysisResult> => {
            setIsAnalyzing(true);

            try {
                const file = new File(imageUri);
                const base64Image = await file.base64();

                const techComplexity =
                    await evaluateTechnicalComplexity(imageUri);

                let finalComplexity: ComplexityLevel = techComplexity.level;

                const urgentKeywords = [
                    "urgent",
                    "douleur",
                    "pain",
                    "severe",
                    "grave",
                ];
                const isUrgent = urgentKeywords.some((keyword) =>
                    context.toLowerCase().includes(keyword),
                );

                if (techComplexity.flags.low_resolution || isUrgent) {
                    if (finalComplexity === "simple") {
                        finalComplexity = "normal";
                    } else if (finalComplexity === "normal") {
                        finalComplexity = "complex";
                    }
                }

                let diagnosis: string;
                let modelUsed: string;

                try {
                    const togetherResult = await analyzeWithTogether(
                        base64Image,
                        context,
                        finalComplexity,
                    );
                    diagnosis = togetherResult.diagnosis;
                    modelUsed = togetherResult.modelUsed;
                } catch {
                    try {
                        diagnosis = await analyzeWithGemini(
                            base64Image,
                            context,
                        );
                        modelUsed = "Gemini 1.5 Flash";
                    } catch {
                        throw new Error(
                            "Unable to analyze the image at this time. Please try again later or contact support if the problem persists.",
                        );
                    }
                }

                const result: ImageAnalysisResult = {
                    diagnosis,
                    complexity: finalComplexity,
                    model_used: modelUsed,
                    confidence: `Technical flags: ${JSON.stringify(techComplexity.flags)}`,
                };

                return result;
            } catch (error) {
                throw new Error(
                    `Image analysis failed: ${getErrorMessage(error)}`,
                );
            } finally {
                setIsAnalyzing(false);
            }
        },
        [],
    );

    return {
        isAnalyzing,
        pickImage,
        takePhoto,
        analyzeImage,
    };
};
