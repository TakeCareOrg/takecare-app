type ComplexityLevel = "simple" | "normal" | "complex";

export const buildTogetherRequest = (
    base64Image: string,
    context: string,
    complexity: ComplexityLevel,
) => {
    const model =
        complexity === "complex"
            ? "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8"
            : "meta-llama/Llama-4-Scout-17B-16E-Instruct";

    const systemPrompt =
        complexity === "complex"
            ? `You are an expert medical AI assistant. Analyze this complex medical image in detail with differential diagnosis.`
            : `You are a medical AI assistant. Analyze this medical image clearly and provide practical recommendations.`;

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
};

export const buildGeminiRequest = (base64Image: string, context: string) => {
    return {
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
};
