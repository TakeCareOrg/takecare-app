import { useCallback, useState } from "react";

import { File } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

import {
    buildGeminiRequest,
    buildTogetherRequest,
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

const analyzeWithTogether = async (
    base64Image: string,
    context: string,
    complexity: ComplexityLevel,
): Promise<string> => {
    const apiKey = process.env.EXPO_PUBLIC_TOGETHER_API_KEY;

    if (!apiKey) {
        throw new Error("Missing Together API key");
    }

    const requestBody = buildTogetherRequest(base64Image, context, complexity);

    try {
        const response = await fetch(
            "https://api.together.xyz/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify(requestBody),
            },
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Together analysis failed: ${response.status} - ${errorText}`,
            );
        }

        const data = await response.json();
        const diagnosis =
            data.choices?.[0]?.message?.content || "No analysis available";

        return diagnosis;
    } catch (error) {
        throw error;
    }
};

const analyzeWithGeminiFlash = async (
    base64Image: string,
    context: string,
): Promise<string> => {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("Missing Gemini API key");
    }

    const requestBody = buildGeminiRequest(base64Image, context);

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            },
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Gemini analysis failed: ${response.status} - ${errorText}`,
            );
        }

        const data = await response.json();
        const diagnosis =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No analysis available";

        return diagnosis;
    } catch (error) {
        throw error;
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
                    diagnosis = await analyzeWithTogether(
                        base64Image,
                        context,
                        finalComplexity,
                    );
                    modelUsed =
                        finalComplexity === "complex"
                            ? "Llama 4 Maverick (17Bx128E)"
                            : "Llama 4 Scout (17Bx16E)";
                } catch (togetherError) {
                    try {
                        diagnosis = await analyzeWithGeminiFlash(
                            base64Image,
                            context,
                        );
                        modelUsed = "Gemini 1.5 Flash";
                    } catch (geminiError) {
                        throw new Error(
                            `All analysis services failed.\n` +
                                `Together: ${getErrorMessage(togetherError)}\n` +
                                `Gemini: ${getErrorMessage(geminiError)}`,
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
