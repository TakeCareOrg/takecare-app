import { act, renderHook } from "@testing-library/react-native";
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
    },
    useSpeechRecognitionEvent: jest.fn(),
}));

describe("useSpeechRecognition - Extended Coverage", () => {
    let eventHandlers: Record<string, Function>;

    beforeEach(() => {
        jest.resetAllMocks();

        // Simuler le stockage des event handlers
        eventHandlers = {};
        (useSpeechRecognitionEvent as jest.Mock).mockImplementation(
            (event: string, handler: Function) => {
                eventHandlers[event] = handler;
            },
        );

        // Mock par défaut: permissions accordées
        (
            ExpoSpeechRecognitionModule.requestPermissionsAsync as jest.Mock
        ).mockResolvedValue({ granted: true });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("Initialization", () => {
        it("should initialize with correct default state", () => {
            const { result } = renderHook(() => useSpeechRecognition());

            expect(result.current.isRecording).toBe(false);
            expect(result.current.recordingDuration).toBe(0);
        });

        it("should have all required methods", () => {
            const { result } = renderHook(() => useSpeechRecognition());

            expect(typeof result.current.startRecording).toBe("function");
            expect(typeof result.current.stopRecording).toBe("function");
            expect(typeof result.current.cancelRecording).toBe("function");
        });

        it("should register all event handlers", () => {
            renderHook(() => useSpeechRecognition());

            expect(useSpeechRecognitionEvent).toHaveBeenCalledWith(
                "start",
                expect.any(Function),
            );
            expect(useSpeechRecognitionEvent).toHaveBeenCalledWith(
                "end",
                expect.any(Function),
            );
            expect(useSpeechRecognitionEvent).toHaveBeenCalledWith(
                "result",
                expect.any(Function),
            );
            expect(useSpeechRecognitionEvent).toHaveBeenCalledWith(
                "error",
                expect.any(Function),
            );
        });
    });

    describe("startRecording", () => {
        it("should request microphone permissions", async () => {
            const { result } = renderHook(() => useSpeechRecognition());

            await act(async () => {
                await result.current.startRecording();
            });

            expect(
                ExpoSpeechRecognitionModule.requestPermissionsAsync,
            ).toHaveBeenCalled();
        });

        it("should start recording with default locale", async () => {
            const { result } = renderHook(() => useSpeechRecognition());

            await act(async () => {
                await result.current.startRecording();
            });

            expect(ExpoSpeechRecognitionModule.start).toHaveBeenCalledWith({
                lang: "en-US",
                interimResults: true,
                maxAlternatives: 1,
                continuous: false,
            });
        });

        it("should start recording with custom locale", async () => {
            const { result } = renderHook(() =>
                useSpeechRecognition({ locale: "fr-FR" }),
            );

            await act(async () => {
                await result.current.startRecording();
            });

            expect(ExpoSpeechRecognitionModule.start).toHaveBeenCalledWith({
                lang: "fr-FR",
                interimResults: true,
                maxAlternatives: 1,
                continuous: false,
            });
        });

        it("should return true when recording starts successfully", async () => {
            const { result } = renderHook(() => useSpeechRecognition());

            let success: boolean = false;
            await act(async () => {
                success = await result.current.startRecording();
            });

            expect(success).toBe(true);
        });

        it("should return false when permission is denied", async () => {
            (
                ExpoSpeechRecognitionModule.requestPermissionsAsync as jest.Mock
            ).mockResolvedValue({ granted: false });

            const { result } = renderHook(() => useSpeechRecognition());

            let success: boolean = true;
            await act(async () => {
                success = await result.current.startRecording();
            });

            expect(success).toBe(false);
            expect(ExpoSpeechRecognitionModule.start).not.toHaveBeenCalled();
        });

        it("should call onError when permission is denied", async () => {
            (
                ExpoSpeechRecognitionModule.requestPermissionsAsync as jest.Mock
            ).mockResolvedValue({ granted: false });

            const onError = jest.fn();
            const { result } = renderHook(() =>
                useSpeechRecognition({ onError }),
            );

            await act(async () => {
                await result.current.startRecording();
            });

            expect(onError).toHaveBeenCalledWith(
                "Microphone permission required",
            );
        });

        it("should return false when start throws an error", async () => {
            (ExpoSpeechRecognitionModule.start as jest.Mock).mockImplementation(
                () => {
                    throw new Error("Start failed");
                },
            );

            const { result } = renderHook(() => useSpeechRecognition());

            let success: boolean = true;
            await act(async () => {
                success = await result.current.startRecording();
            });

            expect(success).toBe(false);
        });

        it("should call onError when start fails", async () => {
            (ExpoSpeechRecognitionModule.start as jest.Mock).mockImplementation(
                () => {
                    throw new Error("Start failed");
                },
            );

            const onError = jest.fn();
            const { result } = renderHook(() =>
                useSpeechRecognition({ onError }),
            );

            await act(async () => {
                await result.current.startRecording();
            });

            expect(onError).toHaveBeenCalledWith("Start failed");
        });

        it("should handle generic errors", async () => {
            (ExpoSpeechRecognitionModule.start as jest.Mock).mockImplementation(
                () => {
                    throw "Non-Error object";
                },
            );

            const onError = jest.fn();
            const { result } = renderHook(() =>
                useSpeechRecognition({ onError }),
            );

            await act(async () => {
                await result.current.startRecording();
            });

            expect(onError).toHaveBeenCalledWith("Failed to start recording");
        });
    });

    describe("stopRecording", () => {
        it("should call stop on the module", () => {
            const { result } = renderHook(() => useSpeechRecognition());

            act(() => {
                result.current.stopRecording();
            });

            expect(ExpoSpeechRecognitionModule.stop).toHaveBeenCalled();
        });

        it("should be callable multiple times safely", () => {
            const { result } = renderHook(() => useSpeechRecognition());

            act(() => {
                result.current.stopRecording();
                result.current.stopRecording();
            });

            expect(ExpoSpeechRecognitionModule.stop).toHaveBeenCalledTimes(2);
        });
    });

    describe("cancelRecording", () => {
        it("should call abort on the module", () => {
            const { result } = renderHook(() => useSpeechRecognition());

            act(() => {
                result.current.cancelRecording();
            });

            expect(ExpoSpeechRecognitionModule.abort).toHaveBeenCalled();
        });

        it("should reset isRecording state", () => {
            const { result } = renderHook(() => useSpeechRecognition());

            // Simuler le démarrage
            act(() => {
                eventHandlers.start?.();
            });

            expect(result.current.isRecording).toBe(true);

            // Annuler
            act(() => {
                result.current.cancelRecording();
            });

            expect(result.current.isRecording).toBe(false);
        });

        it("should reset recordingDuration state", () => {
            const { result } = renderHook(() => useSpeechRecognition());

            // Simuler le démarrage
            act(() => {
                eventHandlers.start?.();
            });

            // Annuler
            act(() => {
                result.current.cancelRecording();
            });

            expect(result.current.recordingDuration).toBe(0);
        });
    });

    describe("Event Handlers - start", () => {
        it("should set isRecording to true on start event", () => {
            const { result } = renderHook(() => useSpeechRecognition());

            act(() => {
                eventHandlers.start?.();
            });

            expect(result.current.isRecording).toBe(true);
        });

        it("should reset recordingDuration on start event", () => {
            const { result } = renderHook(() => useSpeechRecognition());

            act(() => {
                eventHandlers.start?.();
            });

            expect(result.current.recordingDuration).toBe(0);
        });
    });

    describe("Event Handlers - end", () => {
        it("should set isRecording to false on end event", () => {
            const { result } = renderHook(() => useSpeechRecognition());

            // Démarrer d'abord
            act(() => {
                eventHandlers.start?.();
            });

            expect(result.current.isRecording).toBe(true);

            // Puis terminer
            act(() => {
                eventHandlers.end?.();
            });

            expect(result.current.isRecording).toBe(false);
        });

        it("should reset recordingDuration on end event", () => {
            const { result } = renderHook(() => useSpeechRecognition());

            act(() => {
                eventHandlers.start?.();
            });

            act(() => {
                eventHandlers.end?.();
            });

            expect(result.current.recordingDuration).toBe(0);
        });
    });

    describe("Event Handlers - result", () => {
        it("should call onTranscript with transcription result", () => {
            const onTranscript = jest.fn();
            renderHook(() => useSpeechRecognition({ onTranscript }));

            act(() => {
                eventHandlers.result?.({
                    results: [{ transcript: "Hello world" }],
                });
            });

            expect(onTranscript).toHaveBeenCalledWith("Hello world");
        });

        it("should handle empty results array", () => {
            const onTranscript = jest.fn();
            renderHook(() => useSpeechRecognition({ onTranscript }));

            act(() => {
                eventHandlers.result?.({ results: [] });
            });

            expect(onTranscript).not.toHaveBeenCalled();
        });

        it("should handle undefined transcript", () => {
            const onTranscript = jest.fn();
            renderHook(() => useSpeechRecognition({ onTranscript }));

            act(() => {
                eventHandlers.result?.({
                    results: [{ transcript: undefined }],
                });
            });

            expect(onTranscript).not.toHaveBeenCalled();
        });

        it("should not crash when onTranscript is not provided", () => {
            renderHook(() => useSpeechRecognition());

            expect(() => {
                act(() => {
                    eventHandlers.result?.({
                        results: [{ transcript: "Hello" }],
                    });
                });
            }).not.toThrow();
        });

        it("should handle multiple results", () => {
            const onTranscript = jest.fn();
            renderHook(() => useSpeechRecognition({ onTranscript }));

            act(() => {
                eventHandlers.result?.({
                    results: [
                        { transcript: "First" },
                        { transcript: "Second" },
                    ],
                });
            });

            // Devrait prendre le premier résultat
            expect(onTranscript).toHaveBeenCalledWith("First");
            expect(onTranscript).toHaveBeenCalledTimes(1);
        });

        it("should handle French transcription", () => {
            const onTranscript = jest.fn();
            renderHook(() =>
                useSpeechRecognition({ onTranscript, locale: "fr-FR" }),
            );

            act(() => {
                eventHandlers.result?.({
                    results: [{ transcript: "Bonjour le monde" }],
                });
            });

            expect(onTranscript).toHaveBeenCalledWith("Bonjour le monde");
        });
    });

    describe("Event Handlers - error", () => {
        it("should call onError with error message", () => {
            const onError = jest.fn();
            renderHook(() => useSpeechRecognition({ onError }));

            act(() => {
                eventHandlers.error?.({ error: "Network error" });
            });

            expect(onError).toHaveBeenCalledWith("Network error");
        });

        it("should use default error message when error is undefined", () => {
            const onError = jest.fn();
            renderHook(() => useSpeechRecognition({ onError }));

            act(() => {
                eventHandlers.error?.({ error: undefined });
            });

            expect(onError).toHaveBeenCalledWith("Speech recognition error");
        });

        it("should set isRecording to false on error", () => {
            const { result } = renderHook(() => useSpeechRecognition());

            // Démarrer
            act(() => {
                eventHandlers.start?.();
            });

            expect(result.current.isRecording).toBe(true);

            // Erreur
            act(() => {
                eventHandlers.error?.({ error: "Error occurred" });
            });

            expect(result.current.isRecording).toBe(false);
        });

        it("should reset recordingDuration on error", () => {
            const { result } = renderHook(() => useSpeechRecognition());

            act(() => {
                eventHandlers.start?.();
            });

            act(() => {
                eventHandlers.error?.({ error: "Error occurred" });
            });

            expect(result.current.recordingDuration).toBe(0);
        });

        it("should not crash when onError is not provided", () => {
            renderHook(() => useSpeechRecognition());

            expect(() => {
                act(() => {
                    eventHandlers.error?.({ error: "Error" });
                });
            }).not.toThrow();
        });

        it("should handle permission denied error", () => {
            const onError = jest.fn();
            renderHook(() => useSpeechRecognition({ onError }));

            act(() => {
                eventHandlers.error?.({
                    error: "Permission denied by user",
                });
            });

            expect(onError).toHaveBeenCalledWith("Permission denied by user");
        });

        it("should handle audio session error", () => {
            const onError = jest.fn();
            renderHook(() => useSpeechRecognition({ onError }));

            act(() => {
                eventHandlers.error?.({ error: "Audio session error" });
            });

            expect(onError).toHaveBeenCalledWith("Audio session error");
        });
    });

    describe("Integration Scenarios", () => {
        it("should handle complete recording flow", async () => {
            const onTranscript = jest.fn();
            const onError = jest.fn();
            const { result } = renderHook(() =>
                useSpeechRecognition({ onTranscript, onError }),
            );

            // Démarrer
            let success: boolean = false;
            await act(async () => {
                success = await result.current.startRecording();
            });

            expect(success).toBe(true);

            // Simuler le démarrage
            act(() => {
                eventHandlers.start?.();
            });

            expect(result.current.isRecording).toBe(true);

            // Recevoir un résultat
            act(() => {
                eventHandlers.result?.({
                    results: [{ transcript: "Test message" }],
                });
            });

            expect(onTranscript).toHaveBeenCalledWith("Test message");

            // Arrêter
            act(() => {
                result.current.stopRecording();
            });

            // Simuler la fin
            act(() => {
                eventHandlers.end?.();
            });

            expect(result.current.isRecording).toBe(false);
            expect(onError).not.toHaveBeenCalled();
        });

        it("should handle cancelled recording flow", async () => {
            const onTranscript = jest.fn();
            const { result } = renderHook(() =>
                useSpeechRecognition({ onTranscript }),
            );

            // Démarrer
            await act(async () => {
                await result.current.startRecording();
            });

            act(() => {
                eventHandlers.start?.();
            });

            expect(result.current.isRecording).toBe(true);

            // Annuler
            act(() => {
                result.current.cancelRecording();
            });

            expect(result.current.isRecording).toBe(false);
            expect(ExpoSpeechRecognitionModule.abort).toHaveBeenCalled();
        });

        it("should handle error during recording", async () => {
            const onError = jest.fn();
            const { result } = renderHook(() =>
                useSpeechRecognition({ onError }),
            );

            // Démarrer
            await act(async () => {
                await result.current.startRecording();
            });

            act(() => {
                eventHandlers.start?.();
            });

            expect(result.current.isRecording).toBe(true);

            // Erreur pendant l'enregistrement
            act(() => {
                eventHandlers.error?.({ error: "Recording interrupted" });
            });

            expect(result.current.isRecording).toBe(false);
            expect(onError).toHaveBeenCalledWith("Recording interrupted");
        });

        it("should handle multiple start/stop cycles", async () => {
            const { result } = renderHook(() => useSpeechRecognition());

            // Premier cycle
            await act(async () => {
                await result.current.startRecording();
            });
            act(() => eventHandlers.start?.());
            act(() => result.current.stopRecording());
            act(() => eventHandlers.end?.());

            expect(result.current.isRecording).toBe(false);

            // Deuxième cycle
            await act(async () => {
                await result.current.startRecording();
            });
            act(() => eventHandlers.start?.());

            expect(result.current.isRecording).toBe(true);
        });
    });

    describe("Locale Configuration", () => {
        it("should accept en-US locale", async () => {
            const { result } = renderHook(() =>
                useSpeechRecognition({ locale: "en-US" }),
            );

            await act(async () => {
                await result.current.startRecording();
            });

            expect(ExpoSpeechRecognitionModule.start).toHaveBeenCalledWith(
                expect.objectContaining({ lang: "en-US" }),
            );
        });

        it("should accept fr-FR locale", async () => {
            const { result } = renderHook(() =>
                useSpeechRecognition({ locale: "fr-FR" }),
            );

            await act(async () => {
                await result.current.startRecording();
            });

            expect(ExpoSpeechRecognitionModule.start).toHaveBeenCalledWith(
                expect.objectContaining({ lang: "fr-FR" }),
            );
        });

        it("should accept es-ES locale", async () => {
            const { result } = renderHook(() =>
                useSpeechRecognition({ locale: "es-ES" }),
            );

            await act(async () => {
                await result.current.startRecording();
            });

            expect(ExpoSpeechRecognitionModule.start).toHaveBeenCalledWith(
                expect.objectContaining({ lang: "es-ES" }),
            );
        });
    });

    describe("Edge Cases", () => {
        it("should handle rapid start/cancel/start sequence", async () => {
            const { result } = renderHook(() => useSpeechRecognition());

            await act(async () => {
                await result.current.startRecording();
            });

            act(() => {
                result.current.cancelRecording();
            });

            await act(async () => {
                await result.current.startRecording();
            });

            expect(ExpoSpeechRecognitionModule.start).toHaveBeenCalledTimes(2);
            expect(ExpoSpeechRecognitionModule.abort).toHaveBeenCalledTimes(1);
        });

        it("should handle stop without start", () => {
            const { result } = renderHook(() => useSpeechRecognition());

            expect(() => {
                act(() => {
                    result.current.stopRecording();
                });
            }).not.toThrow();
        });

        it("should handle cancel without start", () => {
            const { result } = renderHook(() => useSpeechRecognition());

            expect(() => {
                act(() => {
                    result.current.cancelRecording();
                });
            }).not.toThrow();
        });

        it("should handle event before initialization", () => {
            expect(() => {
                renderHook(() => useSpeechRecognition());
                // Les event handlers sont enregistrés pendant l'initialisation
            }).not.toThrow();
        });
    });
});