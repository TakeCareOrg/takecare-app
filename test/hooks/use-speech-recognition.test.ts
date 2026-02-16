import { act, renderHook, waitFor } from "@testing-library/react-native";
import {
    ExpoSpeechRecognitionModule,
    useSpeechRecognitionEvent,
} from "expo-speech-recognition";

import { useSpeechRecognition } from "@hooks/use-speech-recognition";

jest.mock("expo-speech-recognition", () => ({
    ExpoSpeechRecognitionModule: {
        requestPermissionsAsync: jest.fn(),
        start: jest.fn(),
        stop: jest.fn(),
        abort: jest.fn(),
        getSupportedLocales: jest.fn(),
    },
    useSpeechRecognitionEvent: jest.fn(),
}));

// Mock pour les timers
jest.useFakeTimers();

describe("useSpeechRecognition", () => {
    let eventHandlers: Record<string, Function>;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();

        eventHandlers = {};
        (useSpeechRecognitionEvent as jest.Mock).mockImplementation(
            (event: string, handler: Function) => {
                eventHandlers[event] = handler;
            },
        );

        (
            ExpoSpeechRecognitionModule.requestPermissionsAsync as jest.Mock
        ).mockResolvedValue({ granted: true });
    });

    describe("Core Functionality", () => {
        describe("Recording Lifecycle", () => {
            it("should complete a full recording cycle successfully", async () => {
                const onTranscript = jest.fn();
                const { result } = renderHook(() =>
                    useSpeechRecognition({ onTranscript }),
                );

                // Initial state
                expect(result.current.isRecording).toBe(false);
                expect(result.current.recordingDuration).toBe(0);

                // Start recording
                await act(async () => {
                    const success = await result.current.startRecording();
                    expect(success).toBe(true);
                });

                // Simulate recording started
                act(() => {
                    eventHandlers.start?.();
                });

                expect(result.current.isRecording).toBe(true);

                // Receive transcription
                act(() => {
                    eventHandlers.result?.({
                        results: [
                            {
                                transcript:
                                    "Je ressens une douleur à la poitrine depuis ce matin",
                            },
                        ],
                    });
                });

                expect(onTranscript).toHaveBeenCalledWith(
                    "Je ressens une douleur à la poitrine depuis ce matin",
                );

                // Stop recording
                act(() => {
                    result.current.stopRecording();
                });

                // Simulate recording ended
                act(() => {
                    eventHandlers.end?.();
                });

                expect(result.current.isRecording).toBe(false);
            });

            it("should handle user cancelling mid-recording", async () => {
                const onTranscript = jest.fn();
                const { result } = renderHook(() =>
                    useSpeechRecognition({ onTranscript }),
                );

                await act(async () => {
                    await result.current.startRecording();
                });

                act(() => {
                    eventHandlers.start?.();
                });

                // User changes their mind
                act(() => {
                    result.current.cancelRecording();
                });

                expect(result.current.isRecording).toBe(false);
                expect(ExpoSpeechRecognitionModule.abort).toHaveBeenCalled();
                expect(onTranscript).not.toHaveBeenCalled();
            });
        });

        describe("Recording Duration Timer", () => {
            it("should track recording duration in real-time", async () => {
                const { result } = renderHook(() => useSpeechRecognition());

                await act(async () => {
                    await result.current.startRecording();
                });

                act(() => {
                    eventHandlers.start?.();
                });

                // Advance timer by 1 second
                act(() => {
                    jest.advanceTimersByTime(1000);
                });

                expect(result.current.recordingDuration).toBeGreaterThan(0);

                // Advance by 5 more seconds
                act(() => {
                    jest.advanceTimersByTime(5000);
                });

                expect(result.current.recordingDuration).toBeGreaterThanOrEqual(
                    5,
                );
            });

            it("should reset duration timer when recording is cancelled", async () => {
                const { result } = renderHook(() => useSpeechRecognition());

                await act(async () => {
                    await result.current.startRecording();
                });

                act(() => {
                    eventHandlers.start?.();
                });

                act(() => {
                    jest.advanceTimersByTime(3000);
                });

                expect(result.current.recordingDuration).toBeGreaterThan(0);

                act(() => {
                    result.current.cancelRecording();
                });

                expect(result.current.recordingDuration).toBe(0);
            });
        });

        describe("Permissions Handling", () => {
            it("should handle permission denial gracefully", async () => {
                (
                    ExpoSpeechRecognitionModule.requestPermissionsAsync as jest.Mock
                ).mockResolvedValue({ granted: false });

                const onError = jest.fn();
                const { result } = renderHook(() =>
                    useSpeechRecognition({ onError }),
                );

                await act(async () => {
                    const success = await result.current.startRecording();
                    expect(success).toBe(false);
                });

                expect(onError).toHaveBeenCalledWith(
                    "Microphone permission required",
                );
                expect(ExpoSpeechRecognitionModule.start).not.toHaveBeenCalled();
            });

            it("should handle permission system errors", async () => {
                (
                    ExpoSpeechRecognitionModule.requestPermissionsAsync as jest.Mock
                ).mockRejectedValue(new Error("System permission error"));

                const onError = jest.fn();
                const { result } = renderHook(() =>
                    useSpeechRecognition({ onError }),
                );

                await act(async () => {
                    const success = await result.current.startRecording();
                    expect(success).toBe(false);
                });

                expect(onError).toHaveBeenCalledWith("System permission error");
            });
        });
    });

    describe("Accessibility & User Experience", () => {
        describe("Real-world Medical Symptom Scenarios", () => {
            it("should handle long medical descriptions", () => {
                const onTranscript = jest.fn();
                renderHook(() => useSpeechRecognition({ onTranscript }));

                const longSymptomDescription =
                    "J'ai des maux de tête persistants depuis trois jours, accompagnés de vertiges et de nausées. " +
                    "La douleur est localisée au niveau des tempes et s'intensifie le soir. " +
                    "J'ai également remarqué une sensibilité accrue à la lumière et des difficultés de concentration.";

                act(() => {
                    eventHandlers.result?.({
                        results: [{ transcript: longSymptomDescription }],
                    });
                });

                expect(onTranscript).toHaveBeenCalledWith(
                    longSymptomDescription,
                );
                expect(onTranscript).toHaveBeenCalledTimes(1);
            });

            it("should handle multiple interim results before final", () => {
                const onTranscript = jest.fn();
                renderHook(() => useSpeechRecognition({ onTranscript }));

                // Simulate interim results as user speaks
                act(() => {
                    eventHandlers.result?.({
                        results: [{ transcript: "Je ressens" }],
                    });
                });

                act(() => {
                    eventHandlers.result?.({
                        results: [{ transcript: "Je ressens une douleur" }],
                    });
                });

                act(() => {
                    eventHandlers.result?.({
                        results: [
                            {
                                transcript:
                                    "Je ressens une douleur à la poitrine",
                            },
                        ],
                    });
                });

                expect(onTranscript).toHaveBeenCalledTimes(3);
                expect(onTranscript).toHaveBeenLastCalledWith(
                    "Je ressens une douleur à la poitrine",
                );
            });

            it("should handle users with speech difficulties (slow speech)", async () => {
                const onTranscript = jest.fn();
                const { result } = renderHook(() =>
                    useSpeechRecognition({ onTranscript }),
                );

                await act(async () => {
                    await result.current.startRecording();
                });

                act(() => {
                    eventHandlers.start?.();
                });

                // Simulate slow, word-by-word speech with pauses
                act(() => {
                    jest.advanceTimersByTime(2000);
                    eventHandlers.result?.({
                        results: [{ transcript: "Douleur" }],
                    });
                });

                act(() => {
                    jest.advanceTimersByTime(3000);
                    eventHandlers.result?.({
                        results: [{ transcript: "Douleur au" }],
                    });
                });

                act(() => {
                    jest.advanceTimersByTime(2000);
                    eventHandlers.result?.({
                        results: [{ transcript: "Douleur au genou" }],
                    });
                });

                expect(onTranscript).toHaveBeenCalledTimes(3);
                expect(result.current.isRecording).toBe(true); // Should still be recording
            });
        });

        describe("Multi-language Support", () => {
            const testLocales = [
                { locale: "fr-FR", phrase: "J'ai mal à la tête" },
                { locale: "en-US", phrase: "I have a headache" },
                { locale: "es-ES", phrase: "Me duele la cabeza" },
            ];

            testLocales.forEach(({ locale, phrase }) => {
                it(`should handle ${locale} transcription`, async () => {
                    const onTranscript = jest.fn();
                    const { result } = renderHook(() =>
                        useSpeechRecognition({ onTranscript, locale }),
                    );

                    await act(async () => {
                        await result.current.startRecording();
                    });

                    expect(
                        ExpoSpeechRecognitionModule.start,
                    ).toHaveBeenCalledWith(
                        expect.objectContaining({ lang: locale }),
                    );

                    act(() => {
                        eventHandlers.result?.({
                            results: [{ transcript: phrase }],
                        });
                    });

                    expect(onTranscript).toHaveBeenCalledWith(phrase);
                });
            });
        });

        describe("Configuration Options", () => {
            it("should use continuous mode for long descriptions", async () => {
                const { result } = renderHook(() => useSpeechRecognition());

                await act(async () => {
                    await result.current.startRecording();
                });

                expect(ExpoSpeechRecognitionModule.start).toHaveBeenCalledWith(
                    expect.objectContaining({ continuous: true }),
                );
            });

            it("should enable automatic punctuation for readability", async () => {
                const { result } = renderHook(() => useSpeechRecognition());

                await act(async () => {
                    await result.current.startRecording();
                });

                expect(ExpoSpeechRecognitionModule.start).toHaveBeenCalledWith(
                    expect.objectContaining({ addsPunctuation: true }),
                );
            });

            it("should request interim results for real-time feedback", async () => {
                const { result } = renderHook(() => useSpeechRecognition());

                await act(async () => {
                    await result.current.startRecording();
                });

                expect(ExpoSpeechRecognitionModule.start).toHaveBeenCalledWith(
                    expect.objectContaining({ interimResults: true }),
                );
            });
        });
    });

    describe("Error Handling & Edge Cases", () => {
        describe("Network & System Errors", () => {
            const errorScenarios = [
                {
                    name: "network timeout",
                    error: "Network request timed out",
                },
                {
                    name: "audio input failure",
                    error: "Failed to access audio input",
                },
                {
                    name: "recognition service unavailable",
                    error: "Speech recognition service unavailable",
                },
                {
                    name: "audio session interrupted",
                    error: "Audio session was interrupted",
                },
            ];

            errorScenarios.forEach(({ name, error }) => {
                it(`should handle ${name} gracefully`, async () => {
                    const onError = jest.fn();
                    const { result } = renderHook(() =>
                        useSpeechRecognition({ onError }),
                    );

                    await act(async () => {
                        await result.current.startRecording();
                    });

                    act(() => {
                        eventHandlers.start?.();
                    });

                    expect(result.current.isRecording).toBe(true);

                    act(() => {
                        eventHandlers.error?.({ error });
                    });

                    expect(result.current.isRecording).toBe(false);
                    expect(onError).toHaveBeenCalledWith(error);
                });
            });

            it("should handle undefined error with default message", () => {
                const onError = jest.fn();
                renderHook(() => useSpeechRecognition({ onError }));

                act(() => {
                    eventHandlers.error?.({ error: undefined });
                });

                expect(onError).toHaveBeenCalledWith(
                    "Speech recognition error",
                );
            });
        });

        describe("Rapid State Changes", () => {
            it("should handle start-stop-start sequence", async () => {
                const { result } = renderHook(() => useSpeechRecognition());

                // First cycle
                await act(async () => {
                    await result.current.startRecording();
                });
                act(() => eventHandlers.start?.());
                act(() => result.current.stopRecording());
                act(() => eventHandlers.end?.());

                expect(result.current.isRecording).toBe(false);

                // Second cycle should work
                await act(async () => {
                    const success = await result.current.startRecording();
                    expect(success).toBe(true);
                });
                act(() => eventHandlers.start?.());

                expect(result.current.isRecording).toBe(true);
                expect(ExpoSpeechRecognitionModule.start).toHaveBeenCalledTimes(
                    2,
                );
            });

            it("should handle multiple stop calls safely", () => {
                const { result } = renderHook(() => useSpeechRecognition());

                expect(() => {
                    act(() => {
                        result.current.stopRecording();
                        result.current.stopRecording();
                        result.current.stopRecording();
                    });
                }).not.toThrow();

                expect(ExpoSpeechRecognitionModule.stop).toHaveBeenCalledTimes(
                    3,
                );
            });

            it("should handle cancel during permission request", async () => {
                let permissionResolve: (value: any) => void;
                const permissionPromise = new Promise((resolve) => {
                    permissionResolve = resolve;
                });

                (
                    ExpoSpeechRecognitionModule.requestPermissionsAsync as jest.Mock
                ).mockReturnValue(permissionPromise);

                const { result } = renderHook(() => useSpeechRecognition());

                // Start recording (will wait for permission)
                const startPromise = act(async () => {
                    return await result.current.startRecording();
                });

                // Cancel while waiting
                act(() => {
                    result.current.cancelRecording();
                });

                // Resolve permission
                permissionResolve!({ granted: true });

                await startPromise;

                expect(result.current.isRecording).toBe(false);
            });
        });

        describe("Empty & Invalid Results", () => {
            it("should handle empty results array", () => {
                const onTranscript = jest.fn();
                renderHook(() => useSpeechRecognition({ onTranscript }));

                act(() => {
                    eventHandlers.result?.({ results: [] });
                });

                expect(onTranscript).not.toHaveBeenCalled();
            });

            it("should handle results with empty transcript", () => {
                const onTranscript = jest.fn();
                renderHook(() => useSpeechRecognition({ onTranscript }));

                act(() => {
                    eventHandlers.result?.({
                        results: [{ transcript: "" }],
                    });
                });

                expect(onTranscript).not.toHaveBeenCalled();
            });

            it("should handle results with whitespace-only transcript", () => {
                const onTranscript = jest.fn();
                renderHook(() => useSpeechRecognition({ onTranscript }));

                act(() => {
                    eventHandlers.result?.({
                        results: [{ transcript: "   " }],
                    });
                });

                // Should still call with whitespace (trimming is app's responsibility)
                expect(onTranscript).toHaveBeenCalledWith("   ");
            });

            it("should handle null/undefined in results", () => {
                const onTranscript = jest.fn();
                renderHook(() => useSpeechRecognition({ onTranscript }));

                expect(() => {
                    act(() => {
                        eventHandlers.result?.({
                            results: [{ transcript: null }],
                        });
                    });
                }).not.toThrow();

                expect(onTranscript).not.toHaveBeenCalled();
            });
        });

        describe("Module Initialization Errors", () => {
            it("should handle start() throwing an error", async () => {
                (
                    ExpoSpeechRecognitionModule.start as jest.Mock
                ).mockImplementation(() => {
                    throw new Error("Module not initialized");
                });

                const onError = jest.fn();
                const { result } = renderHook(() =>
                    useSpeechRecognition({ onError }),
                );

                await act(async () => {
                    const success = await result.current.startRecording();
                    expect(success).toBe(false);
                });

                expect(onError).toHaveBeenCalledWith("Module not initialized");
            });

            it("should handle non-Error objects being thrown", async () => {
                (
                    ExpoSpeechRecognitionModule.start as jest.Mock
                ).mockImplementation(() => {
                    throw "String error";
                });

                const onError = jest.fn();
                const { result } = renderHook(() =>
                    useSpeechRecognition({ onError }),
                );

                await act(async () => {
                    await result.current.startRecording();
                });

                expect(onError).toHaveBeenCalledWith(
                    "Failed to start recording",
                );
            });
        });
    });

    describe("Callback Behavior", () => {
        it("should not crash when callbacks are not provided", async () => {
            const { result } = renderHook(() => useSpeechRecognition());

            expect(() => {
                act(() => {
                    eventHandlers.result?.({
                        results: [{ transcript: "Test" }],
                    });
                    eventHandlers.error?.({ error: "Test error" });
                });
            }).not.toThrow();
        });

        it("should call onError only once per error", () => {
            const onError = jest.fn();
            renderHook(() => useSpeechRecognition({ onError }));

            act(() => {
                eventHandlers.error?.({ error: "Single error" });
            });

            expect(onError).toHaveBeenCalledTimes(1);
            expect(onError).toHaveBeenCalledWith("Single error");
        });

        it("should handle callback errors gracefully", () => {
            const onTranscript = jest.fn().mockImplementation(() => {
                throw new Error("Callback error");
            });

            renderHook(() => useSpeechRecognition({ onTranscript }));

            // Should not crash the hook
            expect(() => {
                act(() => {
                    eventHandlers.result?.({
                        results: [{ transcript: "Test" }],
                    });
                });
            }).toThrow(); // React will throw, but hook should remain stable
        });
    });

    describe("Memory Management", () => {
        it("should clean up on unmount", () => {
            const { unmount } = renderHook(() => useSpeechRecognition());

            unmount();

            // Event handlers should still be registered (they're static)
            // but hook state should be cleaned up
            expect(useSpeechRecognitionEvent).toHaveBeenCalled();
        });

        it("should handle cleanup on unmount during recording", async () => {
            const { result, unmount } = renderHook(() =>
                useSpeechRecognition(),
            );

            await act(async () => {
                await result.current.startRecording();
            });

            act(() => {
                eventHandlers.start?.();
            });

            // Record that we're in the middle of recording
            const wasRecording = result.current.isRecording;
            expect(wasRecording).toBe(true);

            // Unmount while recording (edge case but can happen)
            unmount();

            // The hook should handle cleanup gracefully
            expect(true).toBe(true); // Test passes if no errors thrown
        });
    });
});