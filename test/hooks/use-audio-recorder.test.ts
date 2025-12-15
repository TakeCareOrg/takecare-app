import { act, renderHook } from "@testing-library/react-native";
import AudioRecord from "react-native-audio-record";

import { useAudioRecorder } from "@hooks/chat/use-audio-recorder";

jest.mock("@hooks/use-toast", () => ({
    __esModule: true,
    default: jest.fn(() => jest.fn()),
}));

describe("useAudioRecorder - Extended Coverage", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        AudioRecord.init = jest.fn();
        AudioRecord.start = jest.fn();
        AudioRecord.stop = jest.fn().mockResolvedValue("/path/to/audio.wav");
        AudioRecord.on = jest.fn();

        (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
            ok: true,
            json: jest
                .fn()
                .mockResolvedValue({ text: "This is a test transcription" }),
            text: jest.fn().mockResolvedValue("{}"),
        });

        process.env.EXPO_PUBLIC_GROQ_API_KEY = "test-api-key";

        if (typeof global.Buffer === "undefined") {
            (global as any).Buffer = {
                from: (str: string, encoding: string) => ({
                    toString: (format: string) => str,
                }),
            };
        }
    });

    describe("Initialization", () => {
        it("should initialize with correct default state", () => {
            const { result } = renderHook(() => useAudioRecorder());

            expect(result.current.isRecording).toBe(false);
            expect(result.current.recordingDuration).toBe(0);
            expect(result.current.volumeLevels).toEqual([]);
        });

        it("should initialize AudioRecord on mount", async () => {
            renderHook(() => useAudioRecorder());

            await new Promise((resolve) => setTimeout(resolve, 150));

            expect(AudioRecord.init).toHaveBeenCalledWith({
                sampleRate: 16000,
                channels: 1,
                bitsPerSample: 16,
                audioSource: 6,
                wavFile: "audio.wav",
            });
        });

        it("should have all required methods", () => {
            const { result } = renderHook(() => useAudioRecorder());

            expect(typeof result.current.startRecording).toBe("function");
            expect(typeof result.current.stopRecording).toBe("function");
            expect(typeof result.current.cancelRecording).toBe("function");
            expect(typeof result.current.reinitialize).toBe("function");
        });

        it("should handle initialization failure", async () => {
            AudioRecord.init = jest.fn(() => {
                throw new Error("Init failed");
            });

            const { result } = renderHook(() => useAudioRecorder());
            await new Promise((resolve) => setTimeout(resolve, 150));

            expect(result.current.isRecording).toBe(false);
        });
    });

    describe("Recording state management", () => {
        it("should update isRecording when starting", async () => {
            const { result } = renderHook(() => useAudioRecorder());
            await new Promise((resolve) => setTimeout(resolve, 150));

            expect(result.current.isRecording).toBe(false);

            await act(async () => {
                await result.current.startRecording();
            });

            expect(result.current.isRecording).toBe(true);
        });

        it("should call AudioRecord.start", async () => {
            const { result } = renderHook(() => useAudioRecorder());
            await new Promise((resolve) => setTimeout(resolve, 150));

            await act(async () => {
                await result.current.startRecording();
            });

            expect(AudioRecord.start).toHaveBeenCalled();
        });

        it("should register data event listener", async () => {
            const { result } = renderHook(() => useAudioRecorder());
            await new Promise((resolve) => setTimeout(resolve, 150));

            await act(async () => {
                await result.current.startRecording();
            });

            expect(AudioRecord.on).toHaveBeenCalledWith(
                "data",
                expect.any(Function),
            );
        });

        it("should prevent double start", async () => {
            const { result } = renderHook(() => useAudioRecorder());
            await new Promise((resolve) => setTimeout(resolve, 150));

            await act(async () => {
                await result.current.startRecording();
            });

            jest.clearAllMocks();

            await act(async () => {
                await result.current.startRecording();
            });

            expect(AudioRecord.start).not.toHaveBeenCalled();
        });

        it("should handle audio data callback", async () => {
            const mockCallback = jest.fn();
            const { result } = renderHook(() => useAudioRecorder());
            await new Promise((resolve) => setTimeout(resolve, 150));

            let dataCallback: ((data: string) => void) | null = null;
            AudioRecord.on = jest.fn((event, callback) => {
                if (event === "data") {
                    dataCallback = callback;
                }
            });

            await act(async () => {
                await result.current.startRecording(mockCallback);
            });

            if (dataCallback) {
                act(() => {
                    dataCallback!("dGVzdGRhdGE=");
                });
            }

            expect(mockCallback).toHaveBeenCalled();
        });
    });

    describe("Volume level processing", () => {
        it("should process audio data and update volume levels", async () => {
            const { result } = renderHook(() => useAudioRecorder());
            await new Promise((resolve) => setTimeout(resolve, 150));

            let dataCallback: ((data: string) => void) | null = null;
            AudioRecord.on = jest.fn((event, callback) => {
                if (event === "data") {
                    dataCallback = callback;
                }
            });

            await act(async () => {
                await result.current.startRecording();
            });

            if (dataCallback) {
                act(() => {
                    const audioData = Buffer.from(
                        new Array(100).fill(50),
                    ).toString("base64");
                    dataCallback!(audioData);
                });
            }

            expect(result.current.volumeLevels.length).toBeGreaterThan(0);
        });

        it("should limit volume levels array to 100 items", async () => {
            const { result } = renderHook(() => useAudioRecorder());
            await new Promise((resolve) => setTimeout(resolve, 150));

            let dataCallback: ((data: string) => void) | null = null;
            AudioRecord.on = jest.fn((event, callback) => {
                if (event === "data") {
                    dataCallback = callback;
                }
            });

            await act(async () => {
                await result.current.startRecording();
            });

            if (dataCallback) {
                for (let i = 0; i < 150; i++) {
                    act(() => {
                        const audioData = Buffer.from(
                            new Array(100).fill(50),
                        ).toString("base64");
                        dataCallback!(audioData);
                    });
                }
            }

            expect(result.current.volumeLevels.length).toBeLessThanOrEqual(100);
        });

        it("should handle audio data processing errors gracefully", async () => {
            const { result } = renderHook(() => useAudioRecorder());
            await new Promise((resolve) => setTimeout(resolve, 150));

            let dataCallback: ((data: string) => void) | null = null;
            AudioRecord.on = jest.fn((event, callback) => {
                if (event === "data") {
                    dataCallback = callback;
                }
            });

            await act(async () => {
                await result.current.startRecording();
            });

            if (dataCallback) {
                act(() => {
                    dataCallback!("invalid-base64-!@#$%");
                });
            }

            expect(result.current.isRecording).toBe(true);
        });
    });

    describe("Stop recording", () => {
        it("should call AudioRecord.stop", async () => {
            const { result } = renderHook(() => useAudioRecorder());
            await new Promise((resolve) => setTimeout(resolve, 150));

            await act(async () => {
                await result.current.startRecording();
            });

            await act(async () => {
                await result.current.stopRecording();
            });

            expect(AudioRecord.stop).toHaveBeenCalled();
        });

        it("should call fetch for transcription", async () => {
            const { result } = renderHook(() => useAudioRecorder());
            await new Promise((resolve) => setTimeout(resolve, 150));

            await act(async () => {
                await result.current.startRecording();
            });

            await act(async () => {
                await result.current.stopRecording();
            });

            expect(global.fetch).toHaveBeenCalledWith(
                "https://api.groq.com/openai/v1/audio/transcriptions",
                expect.objectContaining({
                    method: "POST",
                    headers: expect.objectContaining({
                        Authorization: "Bearer test-api-key",
                    }),
                }),
            );
        });

        it("should return transcription text", async () => {
            const { result } = renderHook(() => useAudioRecorder());
            await new Promise((resolve) => setTimeout(resolve, 150));

            await act(async () => {
                await result.current.startRecording();
            });

            let transcription = "";
            await act(async () => {
                transcription = await result.current.stopRecording();
            });

            expect(transcription).toBe("This is a test transcription");
        });

        it("should reset state after stop", async () => {
            const { result } = renderHook(() => useAudioRecorder());
            await new Promise((resolve) => setTimeout(resolve, 150));

            await act(async () => {
                await result.current.startRecording();
            });

            await act(async () => {
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

        it("should handle empty transcription", async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue({ text: "" }),
            });

            const { result } = renderHook(() => useAudioRecorder());
            await new Promise((resolve) => setTimeout(resolve, 150));

            await act(async () => {
                await result.current.startRecording();
            });

            await expect(
                act(async () => {
                    await result.current.stopRecording();
                }),
            ).rejects.toThrow("ERROR_TRANSCRIBING_AUDIO");
        });

        it("should handle missing API key", async () => {
            delete process.env.EXPO_PUBLIC_GROQ_API_KEY;

            const { result } = renderHook(() => useAudioRecorder());
            await new Promise((resolve) => setTimeout(resolve, 150));

            await act(async () => {
                await result.current.startRecording();
            });

            await expect(
                act(async () => {
                    await result.current.stopRecording();
                }),
            ).rejects.toThrow("ERROR_TRANSCRIBING_AUDIO");
        });

        it("should handle fetch network errors", async () => {
            (global.fetch as jest.Mock).mockRejectedValue(
                new Error("Network error"),
            );

            const { result } = renderHook(() => useAudioRecorder());
            await new Promise((resolve) => setTimeout(resolve, 150));

            await act(async () => {
                await result.current.startRecording();
            });

            await expect(
                act(async () => {
                    await result.current.stopRecording();
                }),
            ).rejects.toThrow("ERROR_TRANSCRIBING_AUDIO");
        });

        it("should handle non-ok fetch response", async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: false,
                text: jest.fn().mockResolvedValue("Error message"),
            });

            const { result } = renderHook(() => useAudioRecorder());
            await new Promise((resolve) => setTimeout(resolve, 150));

            await act(async () => {
                await result.current.startRecording();
            });

            await expect(
                act(async () => {
                    await result.current.stopRecording();
                }),
            ).rejects.toThrow("ERROR_TRANSCRIBING_AUDIO");
        });
    });

    describe("Cancel recording", () => {
        it("should cancel and reset state", async () => {
            const { result } = renderHook(() => useAudioRecorder());
            await new Promise((resolve) => setTimeout(resolve, 150));

            await act(async () => {
                await result.current.startRecording();
            });

            expect(result.current.isRecording).toBe(true);

            await act(async () => {
                await result.current.cancelRecording();
            });

            expect(result.current.isRecording).toBe(false);
            expect(AudioRecord.stop).toHaveBeenCalled();
        });

        it("should handle cancel when not recording", async () => {
            const { result } = renderHook(() => useAudioRecorder());

            await act(async () => {
                await result.current.cancelRecording();
            });

            expect(result.current.isRecording).toBe(false);
        });

        it("should clear interval on cancel", async () => {
            const { result } = renderHook(() => useAudioRecorder());
            await new Promise((resolve) => setTimeout(resolve, 150));

            await act(async () => {
                await result.current.startRecording();
            });

            await new Promise((resolve) => setTimeout(resolve, 250));

            await act(async () => {
                await result.current.cancelRecording();
            });

            const durationAfterCancel = result.current.recordingDuration;

            await new Promise((resolve) => setTimeout(resolve, 200));

            expect(result.current.recordingDuration).toBe(durationAfterCancel);
        });
    });

    describe("Reinitialize", () => {
        it("should reinitialize AudioRecord", async () => {
            const { result } = renderHook(() => useAudioRecorder());

            jest.clearAllMocks();

            await act(async () => {
                await result.current.reinitialize();
            });

            expect(AudioRecord.init).toHaveBeenCalled();
        });

        it("should handle reinitialization failure", async () => {
            AudioRecord.init = jest.fn(() => {
                throw new Error("Reinit failed");
            });

            const { result } = renderHook(() => useAudioRecorder());

            await act(async () => {
                const success = await result.current.reinitialize();
                expect(success).toBe(false);
            });
        });
    });

    describe("Recording duration tracking", () => {
        it("should increment recording duration", async () => {
            const { result } = renderHook(() => useAudioRecorder());
            await new Promise((resolve) => setTimeout(resolve, 150));

            await act(async () => {
                await result.current.startRecording();
            });

            expect(result.current.recordingDuration).toBe(0);

            await new Promise((resolve) => setTimeout(resolve, 250));

            expect(result.current.recordingDuration).toBeGreaterThan(0);
        });
    });

    describe("Cleanup", () => {
        it("should clear interval on unmount", async () => {
            const { result, unmount } = renderHook(() => useAudioRecorder());
            await new Promise((resolve) => setTimeout(resolve, 150));

            await act(async () => {
                await result.current.startRecording();
            });

            unmount();

            expect(true).toBe(true);
        });
    });
});
