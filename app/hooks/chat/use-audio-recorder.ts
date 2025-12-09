import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import AudioRecord from "react-native-audio-record";

import useToast from "@hooks/use-toast";

const base64ToUint8Array = (base64: string): Uint8Array => {
    const binaryString = global.atob
        ? global.atob(base64)
        : Buffer.from(base64, "base64").toString("binary");
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
};

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    if (typeof error === "string") return error;
    if (error && typeof error === "object" && "message" in error)
        return String((error as { message: unknown }).message);
    return "An unknown error occurred";
};

const AUDIO_RECORD_OPTIONS = {
    sampleRate: 16000,
    channels: 1,
    bitsPerSample: 16,
    audioSource: 6,
    wavFile: "audio.wav",
};

export const useAudioRecorder = () => {
    const toast = useToast();
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [volumeLevels, setVolumeLevels] = useState<number[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const isProcessing = useRef(false);
    const audioFile = useRef<string>("");
    const audioDataChunks = useRef<string[]>([]);
    const isInitialized = useRef(false);

    const initializeAudioRecord = useCallback(async () => {
        try {
            AudioRecord.init(AUDIO_RECORD_OPTIONS);
            await new Promise((resolve) => setTimeout(resolve, 100));
            isInitialized.current = true;
            return true;
        } catch {
            isInitialized.current = false;
            return false;
        }
    }, []);

    useEffect(() => {
        initializeAudioRecord();

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            isInitialized.current = false;
        };
    }, [initializeAudioRecord]);

    const startRecording = useCallback(
        async (onAudioData?: (data: string) => void) => {
            if (isRecording || isProcessing.current) return;

            if (!isInitialized.current) {
                const success = await initializeAudioRecord();
                if (!success) {
                    const errorMsg = "Failed to initialize audio recorder";
                    toast({
                        type: "error",
                        title: "Error",
                        message: errorMsg,
                    });
                    throw new Error(`AUDIO_INIT_FAILED: ${errorMsg}`);
                }
            }

            isProcessing.current = true;

            setVolumeLevels([]);
            setRecordingDuration(0);
            audioDataChunks.current = [];

            try {
                AudioRecord.start();
                setIsRecording(true);

                intervalRef.current = setInterval(() => {
                    setRecordingDuration((p) => p + 100);
                }, 100);

                AudioRecord.on("data", (data: string) => {
                    try {
                        audioDataChunks.current.push(data);

                        if (onAudioData) {
                            onAudioData(data);
                        }

                        const bytes = base64ToUint8Array(data);

                        let sum = 0;
                        let peak = 0;
                        const sampleCount = bytes.length / 2;

                        for (let i = 0; i < bytes.length; i += 2) {
                            const val =
                                ((bytes[i] | (bytes[i + 1] << 8)) << 16) >> 16;
                            sum += val * val;
                            peak = Math.max(peak, Math.abs(val));
                        }

                        const rms = Math.sqrt(sum / sampleCount);
                        const maxValue = 32768;

                        const rmsLevel = (rms / maxValue) * 100;
                        const peakLevel = (peak / maxValue) * 100;

                        const combinedLevel = rmsLevel * 0.7 + peakLevel * 0.3;

                        const noiseThreshold = 0.5;
                        let audioLevel =
                            combinedLevel > noiseThreshold ? combinedLevel : 0;

                        if (audioLevel > 0) {
                            const minVisibleLevel = 10;
                            const maxVisibleLevel = 90;

                            const logScale =
                                Math.log10(audioLevel + 1) / Math.log10(101);
                            audioLevel =
                                minVisibleLevel +
                                logScale * (maxVisibleLevel - minVisibleLevel);

                            if (audioLevel < 40) {
                                audioLevel = audioLevel * 1.3;
                            }
                        }

                        setVolumeLevels((prev) => {
                            const last = prev.length
                                ? prev[prev.length - 1]
                                : 0;
                            const smoothing = audioLevel > last ? 0.25 : 0.5;
                            const newVal =
                                last * smoothing + audioLevel * (1 - smoothing);

                            const newArray = [...prev, Math.min(newVal, 100)];
                            return newArray.length > 100
                                ? newArray.slice(-100)
                                : newArray;
                        });
                    } catch (err) {
                        toast({
                            type: "error",
                            title: "Error",
                            message: `Error processing audio data: ${getErrorMessage(
                                err,
                            )}`,
                        });
                    }
                });

                isProcessing.current = false;
            } catch (err) {
                isProcessing.current = false;
                setIsRecording(false);
                const errorMsg = getErrorMessage(err);
                toast({
                    type: "error",
                    title: "Error",
                    message: `Unable to start recording: ${errorMsg}`,
                });
                throw err;
            }
        },
        [isRecording, toast, initializeAudioRecord],
    );

    const stopRecording = useCallback(async (): Promise<string> => {
        if (!isRecording) {
            toast({
                type: "error",
                title: "Error",
                message: "No recording in progress",
            });
            throw new Error("NO_RECORDING_IN_PROGRESS");
        }
        isProcessing.current = true;

        try {
            if (intervalRef.current) clearInterval(intervalRef.current);

            audioFile.current = await AudioRecord.stop();
            setIsRecording(false);
            setRecordingDuration(0);

            const transcription = await transcribeWithGroq(audioFile.current);

            setVolumeLevels([]);
            audioDataChunks.current = [];
            isProcessing.current = false;
            return transcription;
        } catch (err) {
            isProcessing.current = false;
            setIsRecording(false);
            setRecordingDuration(0);
            setVolumeLevels([]);

            const errorMessage = getErrorMessage(err);

            let userMessage = "Error during transcription";
            if (errorMessage.includes("NO_SPEECH_DETECTED")) {
                userMessage = "No speech detected in recording";
            } else if (errorMessage.includes("Missing GROQ API key")) {
                userMessage = "Missing Groq API key";
            } else if (errorMessage.includes("Groq transcription failed")) {
                userMessage = "Transcription failed";
            }

            toast({
                type: "error",
                title: "Error",
                message: userMessage,
            });

            throw err;
        }
    }, [isRecording, toast]);

    const cancelRecording = useCallback(async () => {
        try {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (isRecording) await AudioRecord.stop();
            setIsRecording(false);
            setRecordingDuration(0);
            setVolumeLevels([]);
            audioDataChunks.current = [];
            isProcessing.current = false;
        } catch (err) {
            toast({
                type: "error",
                title: "Error",
                message: `Error during cancellation: ${getErrorMessage(err)}`,
            });
        }
    }, [isRecording, toast]);

    return {
        isRecording,
        recordingDuration,
        volumeLevels,
        startRecording,
        stopRecording,
        cancelRecording,
        reinitialize: initializeAudioRecord,
        audioFile: audioFile.current,
    };
};

const transcribeWithGroq = async (uri: string): Promise<string> => {
    try {
        const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
        if (!apiKey) throw new Error("Missing GROQ API key");

        const formData = new FormData();
        formData.append("file", {
            uri: Platform.OS === "android" ? `file://${uri}` : uri,
            name: "audio.wav",
            type: "audio/wav",
        } as unknown as Blob);
        formData.append("model", "whisper-large-v3");
        formData.append("temperature", "0.0");

        const response = await fetch(
            "https://api.groq.com/openai/v1/audio/transcriptions",
            {
                method: "POST",
                headers: { Authorization: `Bearer ${apiKey}` },
                body: formData,
            },
        );

        if (!response.ok)
            throw new Error(
                `Groq transcription failed: ${await response.text()}`,
            );
        const result = await response.json();
        if (!result.text || result.text.trim() === "")
            throw new Error("NO_SPEECH_DETECTED");

        return result.text.trim();
    } catch {
        throw new Error("ERROR_TRANSCRIBING_AUDIO");
    }
};
