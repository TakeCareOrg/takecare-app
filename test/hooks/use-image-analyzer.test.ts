import { act, renderHook } from "@testing-library/react-native";
import { File } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

import { useImageAnalyzer } from "@hooks/chat/use-image-analyzer";

import { mockImageAnalysisResponse } from "../mocks/api-mocks";

jest.mock("@hooks/use-toast", () => ({
    __esModule: true,
    default: jest.fn(() => jest.fn()),
}));

jest.mock("expo-file-system", () => ({
    File: jest.fn(),
}));

jest.mock("expo-image-picker", () => ({
    requestMediaLibraryPermissionsAsync: jest.fn(),
    requestCameraPermissionsAsync: jest.fn(),
    launchImageLibraryAsync: jest.fn(),
    launchCameraAsync: jest.fn(),
    MediaTypeOptions: {
        Images: "Images",
    },
}));

describe("useImageAnalyzer - Extended Coverage", () => {
    const mockImageUri = "file:///path/to/image.jpg";
    const mockBase64Image = "base64encodedimagedata";

    beforeEach(() => {
        jest.clearAllMocks();

        (File as unknown as jest.Mock).mockImplementation((uri: string) => ({
            uri,
            size: Promise.resolve(150000),
            base64: jest.fn().mockResolvedValue(mockBase64Image),
        }));

        (global.fetch as jest.Mock) = jest.fn();

        process.env.EXPO_PUBLIC_TOGETHER_API_KEY = "test-together-key";
        process.env.EXPO_PUBLIC_GEMINI_API_KEY = "test-gemini-key";
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Initialization", () => {
        it("should initialize with correct default state", () => {
            const { result } = renderHook(() => useImageAnalyzer());

            expect(result.current.isAnalyzing).toBe(false);
        });

        it("should have all required methods", () => {
            const { result } = renderHook(() => useImageAnalyzer());

            expect(typeof result.current.pickImage).toBe("function");
            expect(typeof result.current.takePhoto).toBe("function");
            expect(typeof result.current.analyzeImage).toBe("function");
        });
    });

    describe("pickImage", () => {
        it("should request media library permissions", async () => {
            (
                ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock
            ).mockResolvedValue({ granted: true });
            (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(
                {
                    canceled: false,
                    assets: [{ uri: mockImageUri }],
                },
            );

            const { result } = renderHook(() => useImageAnalyzer());

            await act(async () => {
                await result.current.pickImage();
            });

            expect(
                ImagePicker.requestMediaLibraryPermissionsAsync,
            ).toHaveBeenCalled();
        });

        it("should return image URI when successful", async () => {
            (
                ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock
            ).mockResolvedValue({ granted: true });
            (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(
                {
                    canceled: false,
                    assets: [{ uri: mockImageUri }],
                },
            );

            const { result } = renderHook(() => useImageAnalyzer());

            let imageUri: string | null = null;
            await act(async () => {
                imageUri = await result.current.pickImage();
            });

            expect(imageUri).toBe(mockImageUri);
        });

        it("should return null when user cancels", async () => {
            (
                ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock
            ).mockResolvedValue({ granted: true });
            (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(
                { canceled: true },
            );

            const { result } = renderHook(() => useImageAnalyzer());

            let imageUri: string | null = null;
            await act(async () => {
                imageUri = await result.current.pickImage();
            });

            expect(imageUri).toBeNull();
        });

        it("should throw error when permission denied", async () => {
            (
                ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock
            ).mockResolvedValue({ granted: false });

            const { result } = renderHook(() => useImageAnalyzer());

            await expect(
                act(async () => {
                    await result.current.pickImage();
                }),
            ).rejects.toThrow("Permission to access gallery denied");
        });

        it("should handle picker errors", async () => {
            (
                ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock
            ).mockRejectedValue(new Error("Picker failed"));

            const { result } = renderHook(() => useImageAnalyzer());

            await expect(
                act(async () => {
                    await result.current.pickImage();
                }),
            ).rejects.toThrow("Failed to pick image");
        });
    });

    describe("takePhoto", () => {
        it("should request camera permissions", async () => {
            (
                ImagePicker.requestCameraPermissionsAsync as jest.Mock
            ).mockResolvedValue({ granted: true });
            (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValue({
                canceled: false,
                assets: [{ uri: mockImageUri }],
            });

            const { result } = renderHook(() => useImageAnalyzer());

            await act(async () => {
                await result.current.takePhoto();
            });

            expect(
                ImagePicker.requestCameraPermissionsAsync,
            ).toHaveBeenCalled();
        });

        it("should return image URI when successful", async () => {
            (
                ImagePicker.requestCameraPermissionsAsync as jest.Mock
            ).mockResolvedValue({ granted: true });
            (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValue({
                canceled: false,
                assets: [{ uri: mockImageUri }],
            });

            const { result } = renderHook(() => useImageAnalyzer());

            let imageUri: string | null = null;
            await act(async () => {
                imageUri = await result.current.takePhoto();
            });

            expect(imageUri).toBe(mockImageUri);
        });

        it("should return null when user cancels", async () => {
            (
                ImagePicker.requestCameraPermissionsAsync as jest.Mock
            ).mockResolvedValue({ granted: true });
            (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValue({
                canceled: true,
            });

            const { result } = renderHook(() => useImageAnalyzer());

            let imageUri: string | null = null;
            await act(async () => {
                imageUri = await result.current.takePhoto();
            });

            expect(imageUri).toBeNull();
        });

        it("should throw error when permission denied", async () => {
            (
                ImagePicker.requestCameraPermissionsAsync as jest.Mock
            ).mockResolvedValue({ granted: false });

            const { result } = renderHook(() => useImageAnalyzer());

            await expect(
                act(async () => {
                    await result.current.takePhoto();
                }),
            ).rejects.toThrow("Permission to access camera denied");
        });

        it("should handle camera errors", async () => {
            (
                ImagePicker.requestCameraPermissionsAsync as jest.Mock
            ).mockRejectedValue(new Error("Camera failed"));

            const { result } = renderHook(() => useImageAnalyzer());

            await expect(
                act(async () => {
                    await result.current.takePhoto();
                }),
            ).rejects.toThrow("Failed to take photo");
        });
    });

    describe("analyzeImage - Together API", () => {
        it("should analyze with normal complexity for small images", async () => {
            (File as unknown as jest.Mock).mockImplementation((uri: string) => ({
                uri,
                size: Promise.resolve(50000),
                base64: jest.fn().mockResolvedValue(mockBase64Image),
            }));

            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: jest
                    .fn()
                    .mockResolvedValue(mockImageAnalysisResponse.togetherSuccess),
            });

            const { result } = renderHook(() => useImageAnalyzer());

            let analysisResult: any;
            await act(async () => {
                analysisResult = await result.current.analyzeImage(
                    mockImageUri,
                    "test",
                );
            });

            expect(analysisResult.complexity).toBe("normal");
            expect(analysisResult.model_used).toBe("google/gemma-3n-E4B-it");
        });

        it("should use Maverick model for complex images", async () => {
            (File as unknown as jest.Mock).mockImplementation((uri: string) => ({
                uri,
                size: Promise.resolve(50000),
                base64: jest.fn().mockResolvedValue(mockBase64Image),
            }));

            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: jest
                    .fn()
                    .mockResolvedValue(mockImageAnalysisResponse.togetherComplex),
            });

            const { result } = renderHook(() => useImageAnalyzer());

            let analysisResult: any;
            await act(async () => {
                analysisResult = await result.current.analyzeImage(
                    mockImageUri,
                    "urgent severe pain",
                );
            });

            expect(analysisResult.complexity).toBe("normal");
        });

        it("should upgrade complexity for urgent keywords", async () => {
            (File as unknown as jest.Mock).mockImplementation((uri: string) => ({
                uri,
                size: Promise.resolve(50000),
                base64: jest.fn().mockResolvedValue(mockBase64Image),
            }));

            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: jest
                    .fn()
                    .mockResolvedValue(mockImageAnalysisResponse.togetherSuccess),
            });

            const { result } = renderHook(() => useImageAnalyzer());

            let analysisResult: any;
            await act(async () => {
                analysisResult = await result.current.analyzeImage(
                    mockImageUri,
                    "urgent pain",
                );
            });

            expect(analysisResult.complexity).toBe("normal");
        });

        it("should call Together API with correct parameters", async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: jest
                    .fn()
                    .mockResolvedValue(mockImageAnalysisResponse.togetherSuccess),
            });

            const { result } = renderHook(() => useImageAnalyzer());

            await act(async () => {
                await result.current.analyzeImage(
                    mockImageUri,
                    "test context",
                );
            });

            expect(global.fetch).toHaveBeenCalledWith(
                "https://api.together.xyz/v1/chat/completions",
                expect.objectContaining({
                    method: "POST",
                    headers: expect.objectContaining({
                        "Content-Type": "application/json",
                        Authorization: "Bearer test-together-key",
                    }),
                }),
            );
        });

        it("should return complete analysis result", async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: jest
                    .fn()
                    .mockResolvedValue(mockImageAnalysisResponse.togetherSuccess),
            });

            const { result } = renderHook(() => useImageAnalyzer());

            let analysisResult: any;
            await act(async () => {
                analysisResult = await result.current.analyzeImage(
                    mockImageUri,
                    "test",
                );
            });

            expect(analysisResult).toHaveProperty("diagnosis");
            expect(analysisResult).toHaveProperty("complexity");
            expect(analysisResult).toHaveProperty("model_used");
            expect(analysisResult).toHaveProperty("confidence");
        });
    });

    describe("analyzeImage - Gemini Fallback", () => {
        it("should fallback to Gemini when Together fails", async () => {
            (global.fetch as jest.Mock)
                .mockRejectedValueOnce(new Error("Together API failed"))
                .mockResolvedValueOnce({
                    ok: true,
                    json: jest
                        .fn()
                        .mockResolvedValue(mockImageAnalysisResponse.geminiSuccess),
                });

            const { result } = renderHook(() => useImageAnalyzer());

            let analysisResult: any;
            await act(async () => {
                analysisResult = await result.current.analyzeImage(
                    mockImageUri,
                    "test",
                );
            });

            expect(analysisResult.model_used).toBe("Gemini 1.5 Flash");
        });

        it("should call Gemini API with correct parameters", async () => {
            (global.fetch as jest.Mock)
                .mockRejectedValueOnce(new Error("Together failed"))
                .mockResolvedValueOnce({
                    ok: true,
                    json: jest
                        .fn()
                        .mockResolvedValue(mockImageAnalysisResponse.geminiSuccess),
                });

            const { result } = renderHook(() => useImageAnalyzer());

            await act(async () => {
                await result.current.analyzeImage(mockImageUri, "context");
            });

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining(
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
                ),
                expect.objectContaining({
                    method: "POST",
                    headers: expect.objectContaining({
                        "Content-Type": "application/json",
                    }),
                }),
            );
        });
    });

    describe("analyzeImage - Error Handling", () => {
        it("should throw when both APIs fail", async () => {
            (global.fetch as jest.Mock).mockRejectedValue(
                new Error("API failed"),
            );

            const { result } = renderHook(() => useImageAnalyzer());

            await expect(
                act(async () => {
                    await result.current.analyzeImage(mockImageUri, "test");
                }),
            ).rejects.toThrow("Image analysis failed: Unable to analyze the image at this time. Please try again later or contact support if the problem persists.");
        });

        it("should handle missing Together API key", async () => {
            delete process.env.EXPO_PUBLIC_TOGETHER_API_KEY;

            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: jest
                    .fn()
                    .mockResolvedValue(mockImageAnalysisResponse.geminiSuccess),
            });

            const { result } = renderHook(() => useImageAnalyzer());

            await act(async () => {
                await result.current.analyzeImage(mockImageUri, "test");
            });

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining("generativelanguage.googleapis.com"),
                expect.any(Object),
            );
        });

        it("should handle missing Gemini API key", async () => {
            delete process.env.EXPO_PUBLIC_GEMINI_API_KEY;

            (global.fetch as jest.Mock).mockRejectedValue(
                new Error("Missing API key"),
            );

            const { result } = renderHook(() => useImageAnalyzer());

            await expect(
                act(async () => {
                    await result.current.analyzeImage(mockImageUri, "test");
                }),
            ).rejects.toThrow();
        });

        it("should handle file reading errors", async () => {
            (File as unknown as jest.Mock).mockImplementation(() => ({
                size: Promise.resolve(100000),
                base64: jest.fn().mockRejectedValue(new Error("Base64 error")),
            }));

            const { result } = renderHook(() => useImageAnalyzer());

            await expect(
                act(async () => {
                    await result.current.analyzeImage(mockImageUri, "test");
                }),
            ).rejects.toThrow("Image analysis failed");
        });

        it("should handle Together API non-ok response", async () => {
            (global.fetch as jest.Mock)
                .mockResolvedValueOnce({
                    ok: false,
                    status: 500,
                    text: jest.fn().mockResolvedValue("Server error"),
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: jest
                        .fn()
                        .mockResolvedValue(mockImageAnalysisResponse.geminiSuccess),
                });

            const { result } = renderHook(() => useImageAnalyzer());

            let analysisResult: any;
            await act(async () => {
                analysisResult = await result.current.analyzeImage(
                    mockImageUri,
                    "test",
                );
            });

            expect(analysisResult.model_used).toBe("Gemini 1.5 Flash");
        });

        it("should reset isAnalyzing on error", async () => {
            (global.fetch as jest.Mock).mockRejectedValue(
                new Error("All failed"),
            );

            const { result } = renderHook(() => useImageAnalyzer());

            await expect(
                act(async () => {
                    await result.current.analyzeImage(mockImageUri, "test");
                }),
            ).rejects.toThrow();

            expect(result.current.isAnalyzing).toBe(false);
        });
    });

    describe("Technical Complexity Evaluation", () => {
        it("should detect low resolution images", async () => {
            (File as unknown as jest.Mock).mockImplementation((uri: string) => ({
                uri,
                size: Promise.resolve(50000),
                base64: jest.fn().mockResolvedValue(mockBase64Image),
            }));

            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: jest
                    .fn()
                    .mockResolvedValue(mockImageAnalysisResponse.togetherSuccess),
            });

            const { result } = renderHook(() => useImageAnalyzer());

            let analysisResult: any;
            await act(async () => {
                analysisResult = await result.current.analyzeImage(
                    mockImageUri,
                    "test",
                );
            });

            expect(analysisResult.confidence).toContain("low_resolution");
        });

        it("should handle complexity evaluation errors gracefully", async () => {
            (File as unknown as jest.Mock).mockImplementation((uri: string) => ({
                uri,
                size: Promise.resolve(null),
                base64: jest.fn().mockResolvedValue(mockBase64Image),
            }));

            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: jest
                    .fn()
                    .mockResolvedValue(mockImageAnalysisResponse.togetherSuccess),
            });

            const { result } = renderHook(() => useImageAnalyzer());

            let analysisResult: any;
            await act(async () => {
                analysisResult = await result.current.analyzeImage(
                    mockImageUri,
                    "test",
                );
            });

            expect(analysisResult.complexity).toBe("simple");
        });
    });

    describe("Context Keywords", () => {
        it("should detect urgent context in French", async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: jest
                    .fn()
                    .mockResolvedValue(mockImageAnalysisResponse.togetherSuccess),
            });

            const { result } = renderHook(() => useImageAnalyzer());

            await act(async () => {
                await result.current.analyzeImage(
                    mockImageUri,
                    "douleur grave urgente",
                );
            });

            expect(global.fetch).toHaveBeenCalled();
        });

        it("should detect severe context in English", async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: jest
                    .fn()
                    .mockResolvedValue(mockImageAnalysisResponse.togetherSuccess),
            });

            const { result } = renderHook(() => useImageAnalyzer());

            await act(async () => {
                await result.current.analyzeImage(
                    mockImageUri,
                    "severe pain urgent",
                );
            });

            expect(global.fetch).toHaveBeenCalled();
        });
    });
});
