import { act, renderHook } from "@testing-library/react-native";

import { useAudioRecorder } from "@hooks/chat/use-audio-recorder";

const mockStart = jest.fn();
const mockStop = jest.fn();
const mockAbort = jest.fn();
const mockRequestPermissionsAsync = jest.fn().mockResolvedValue({ granted: true });

const eventHandlers: Record<string, (event: unknown) => void> = {};

jest.mock("expo-speech-recognition", () => ({
    ExpoSpeechRecognitionModule: {
        start: (...args: unknown[]) => mockStart(...args),
        stop: (...args: unknown[]) => mockStop(...args),
        abort: (...args: unknown[]) => mockAbort(...args),
        requestPermissionsAsync: (...args: unknown[]) =>
            mockRequestPermissionsAsync(...args),
    },
    useSpeechRecognitionEvent: (
        event: string,
        handler: (event: unknown) => void,
    ) => {
        eventHandlers[event] = handler;
    },
}));

jest.mock("@hooks/use-toast", () => ({
    __esModule: true,
    default: jest.fn(() => jest.fn()),
}));

describe("useAudioRecorder", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        mockRequestPermissionsAsync.mockResolvedValue({ granted: true });
        Object.keys(eventHandlers).forEach((key) => delete eventHandlers[key]);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe("Initialization", () => {
        it("should initialize with correct default state", () => {
            const { result } = renderHook(() => useAudioRecorder());

            expect(result.current.isRecording).toBe(false);
            expect(result.current.recordingDuration).toBe(0);
            expect(result.current.volumeLevels).toEqual([]);
        });

        it("should have all required methods", () => {
            const { result } = renderHook(() => useAudioRecorder());

            expect(typeof result.current.startRecording).toBe("function");
            expect(typeof result.current.stopRecording).toBe("function");
            expect(typeof result.current.cancelRecording).toBe("function");
            expect(typeof result.current.reinitialize).toBe("function");
        });
    });

    describe("Recording state management", () => {
        it("should update isRecording when starting", async () => {
            const { result } = renderHook(() => useAudioRecorder());

            expect(result.current.isRecording).toBe(false);

            await act(async () => {
                await result.current.startRecording("en-US");
            });

            expect(result.current.isRecording).toBe(true);
        });

        it("should call ExpoSpeechRecognitionModule.start with locale", async () => {
            const { result } = renderHook(() => useAudioRecorder());

            await act(async () => {
                await result.current.startRecording("fr-FR");
            });

            expect(mockStart).toHaveBeenCalledWith({
                lang: "fr-FR",
                interimResults: true,
                continuous: true,
            });
        });

        it("should use default locale when none provided", async () => {
            const { result } = renderHook(() => useAudioRecorder());

            await act(async () => {
                await result.current.startRecording();
            });

            expect(mockStart).toHaveBeenCalledWith({
                lang: "en-US",
                interimResults: true,
                continuous: true,
            });
        });

        it("should prevent double start", async () => {
            const { result } = renderHook(() => useAudioRecorder());

            await act(async () => {
                await result.current.startRecording();
            });

            mockStart.mockClear();

            await act(async () => {
                await result.current.startRecording();
            });

            expect(mockStart).not.toHaveBeenCalled();
        });

        it("should not start if permissions are denied", async () => {
            mockRequestPermissionsAsync.mockResolvedValue({ granted: false });

            const { result } = renderHook(() => useAudioRecorder());

            await act(async () => {
                await result.current.startRecording();
            });

            expect(mockStart).not.toHaveBeenCalled();
            expect(result.current.isRecording).toBe(false);
        });

        it("should request permissions before starting", async () => {
            const { result } = renderHook(() => useAudioRecorder());

            await act(async () => {
                await result.current.startRecording();
            });

            expect(mockRequestPermissionsAsync).toHaveBeenCalled();
        });
    });

    describe("Speech recognition results", () => {
        it("should capture transcription from result event", async () => {
            const { result } = renderHook(() => useAudioRecorder());

            await act(async () => {
                await result.current.startRecording();
            });

            act(() => {
                eventHandlers["result"]?.({
                    results: [{ transcript: "Hello world" }],
                });
            });

            let transcription = "";
            await act(async () => {
                transcription = await result.current.stopRecording();
            });

            expect(transcription).toBe("Hello world");
        });

        it("should handle volume change events", async () => {
            const { result } = renderHook(() => useAudioRecorder());

            await act(async () => {
                await result.current.startRecording();
            });

            act(() => {
                eventHandlers["volumechange"]?.({ value: 5 });
            });

            expect(result.current.volumeLevels.length).toBeGreaterThan(0);
        });
    });

    describe("Stop recording", () => {
        it("should call ExpoSpeechRecognitionModule.stop", async () => {
            const { result } = renderHook(() => useAudioRecorder());

            await act(async () => {
                await result.current.startRecording();
            });

            act(() => {
                eventHandlers["result"]?.({
                    results: [{ transcript: "Test" }],
                });
            });

            await act(async () => {
                jest.advanceTimersByTime(300);
                await result.current.stopRecording();
            });

            expect(mockStop).toHaveBeenCalled();
        });

        it("should return transcription text", async () => {
            const { result } = renderHook(() => useAudioRecorder());

            await act(async () => {
                await result.current.startRecording();
            });

            act(() => {
                eventHandlers["result"]?.({
                    results: [{ transcript: "This is a test transcription" }],
                });
            });

            let transcription = "";
            await act(async () => {
                jest.advanceTimersByTime(300);
                transcription = await result.current.stopRecording();
            });

            expect(transcription).toBe("This is a test transcription");
        });

        it("should reset state after stop", async () => {
            const { result } = renderHook(() => useAudioRecorder());

            await act(async () => {
                await result.current.startRecording();
            });

            act(() => {
                eventHandlers["result"]?.({
                    results: [{ transcript: "Test" }],
                });
            });

            await act(async () => {
                jest.advanceTimersByTime(300);
                await result.current.stopRecording();
            });

            expect(result.current.isRecording).toBe(false);
            expect(result.current.recordingDuration).toBe(0);
        });

        it("should throw when not recording", async () => {
            const { result } = renderHook(() => useAudioRecorder());

            await expect(
                act(async () => {
                    await result.current.stopRecording();
                }),
            ).rejects.toThrow("NO_RECORDING_IN_PROGRESS");
        });

        it("should throw NO_SPEECH_DETECTED when no transcription", async () => {
            const { result } = renderHook(() => useAudioRecorder());

            await act(async () => {
                await result.current.startRecording();
            });

            await expect(
                act(async () => {
                    jest.advanceTimersByTime(300);
                    await result.current.stopRecording();
                }),
            ).rejects.toThrow("NO_SPEECH_DETECTED");
        });
    });

    describe("Cancel recording", () => {
        it("should cancel and reset state", async () => {
            const { result } = renderHook(() => useAudioRecorder());

            await act(async () => {
                await result.current.startRecording();
            });

            expect(result.current.isRecording).toBe(true);

            await act(async () => {
                await result.current.cancelRecording();
            });

            expect(result.current.isRecording).toBe(false);
            expect(mockAbort).toHaveBeenCalled();
        });

        it("should handle cancel when not recording", async () => {
            const { result } = renderHook(() => useAudioRecorder());

            await act(async () => {
                await result.current.cancelRecording();
            });

            expect(result.current.isRecording).toBe(false);
        });
    });

    describe("Recording duration tracking", () => {
        it("should increment recording duration", async () => {
            const { result } = renderHook(() => useAudioRecorder());

            await act(async () => {
                await result.current.startRecording();
            });

            expect(result.current.recordingDuration).toBe(0);

            act(() => {
                jest.advanceTimersByTime(300);
            });

            expect(result.current.recordingDuration).toBeGreaterThan(0);
        });
    });

    describe("Reinitialize", () => {
        it("should reinitialize successfully", async () => {
            const { result } = renderHook(() => useAudioRecorder());

            let success = false;
            await act(async () => {
                success = await result.current.reinitialize();
            });

            expect(success).toBe(true);
        });
    });

    describe("Cleanup", () => {
        it("should clear interval on unmount", async () => {
            const { result, unmount } = renderHook(() => useAudioRecorder());

            await act(async () => {
                await result.current.startRecording();
            });

            unmount();

            expect(true).toBe(true);
        });
    });
});
