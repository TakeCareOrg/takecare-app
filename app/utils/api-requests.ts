type ComplexityLevel = "simple" | "normal" | "complex";

export const buildTogetherRequest = (
    base64Image: string,
    context: string,
    complexity: ComplexityLevel,
) => {
    const model =
        complexity === "complex"
            ? "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8"
            : "google/gemma-3n-E4B-it";

    const systemPrompt =
        complexity === "complex"
            ? `You are an educational AI assistant specializing in health information. Provide detailed educational analysis for informational purposes only. This is NOT medical advice.`
            : `You are an educational health information assistant. Analyze this image and provide general health information for educational purposes only. This is NOT medical advice.`;

    return {
        model: model,
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `${systemPrompt}
                        
                        Context: ${context}
                        
                        For educational purposes, please provide:
                        1. What you observe in the image
                        2. General health information related to these observations
                        3. Educational recommendations
                        4. When to consult healthcare professionals
                        
                        IMPORTANT: This is for educational and informational purposes only.`,
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
};

export const buildGeminiRequest = (base64Image: string, context: string) => {
    return {
        contents: [
            {
                parts: [
                    {
                        text: `You are an educational health information assistant. Analyze this image and provide general health information for educational purposes.

                                Context: ${context}
                                
                                Provide:
                                1. Detailed observations from the image
                                2. General health information related to observations
                                3. Recommendations for next steps
                                4. When to seek healthcare professional advice
                                
                                IMPORTANT: This is for educational and informational purposes only, not medical advice.`,
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
};

export const analyzeWithTogether = async (
    base64Image: string,
    context: string,
    complexity: ComplexityLevel,
): Promise<{ diagnosis: string; modelUsed: string }> => {
    const apiKey = process.env.EXPO_PUBLIC_TOGETHER_API_KEY;

    if (!apiKey) {
        throw new Error("Missing Together API key");
    }

    const requestBody = buildTogetherRequest(base64Image, context, complexity);

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

    return {
        diagnosis,
        modelUsed: requestBody.model,
    };
};

export const analyzeWithGemini = async (
    base64Image: string,
    context: string,
): Promise<string> => {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("Missing Gemini API key");
    }

    const requestBody = buildGeminiRequest(base64Image, context);

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
};
