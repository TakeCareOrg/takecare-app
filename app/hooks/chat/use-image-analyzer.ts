import { useCallback, useState } from "react";

import { File } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

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

    const model =
        complexity === "complex"
            ? "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8"
            : "meta-llama/Llama-4-Scout-17B-16E-Instruct";

    const systemPrompt =
        complexity === "complex"
            ? `You are an expert medical AI assistant. Analyze this complex medical image in detail with differential diagnosis.`
            : `You are a medical AI assistant. Analyze this medical image clearly and provide practical recommendations.`;

    const requestBody = {
        model: model,
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `${systemPrompt}
                        Context: ${context}
                        
                        Provide:
                        1. What you observe in the image
                        2. Possible diagnoses with reasoning
                        3. Recommendations
                        4. When to seek medical attention
                        
                        Be professional and precise.`,
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:image/jpeg;base64,${base64Image}`,
                        },
                    },
                ],
            },
        ],
        max_tokens: complexity === "complex" ? 2000 : 1000,
        temperature: 0.2,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1.0,
    };

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

    const requestBody = {
        contents: [
            {
                parts: [
                    {
                        text: `You are a medical AI assistant. Analyze this medical image and provide a professional assessment.

Context: ${context}

Provide:
1. Detailed observations from the image
2. Possible diagnoses with reasoning
3. Recommendations for next steps
4. When to seek immediate medical attention

Be thorough and precise. Clearly state confidence levels and limitations.`,
                    },
                    {
                        inline_data: {
                            mime_type: "image/jpeg",
                            data: base64Image,
                        },
                    },
                ],
            },
        ],
        generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1500,
        },
    };

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
