import {
    ExpoSpeechRecognitionModule,
    useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

import useToast from "@hooks/use-toast";

export const useAudioRecorder = () => {
    const toast = useToast();
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [volumeLevels, setVolumeLevels] = useState<number[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const transcriptionRef = useRef<string>("");
    const isProcessing = useRef(false);

    useSpeechRecognitionEvent("result", (event) => {
        const transcript = event.results[0]?.transcript;
        if (transcript) {
            transcriptionRef.current = transcript;
        }
    });

    useSpeechRecognitionEvent("volumechange", (event) => {
        const rawVolume = event.value ?? 0;
        const normalized = Math.max(0, Math.min(100, (rawVolume + 2) * 12));
        setVolumeLevels((prev) => {
            const newArray = [...prev, normalized];
            return newArray.length > 100 ? newArray.slice(-100) : newArray;
        });
    });

    useSpeechRecognitionEvent("error", (event) => {
        if (event.error !== "no-speech") {
            console.warn("Speech recognition error:", event.error);
        }
    });

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const startRecording = useCallback(
        async (locale?: string) => {
            if (isRecording || isProcessing.current) return;
            isProcessing.current = true;

            try {
                transcriptionRef.current = "";
                setVolumeLevels([]);
                setRecordingDuration(0);

                const { granted } =
                    await ExpoSpeechRecognitionModule.requestPermissionsAsync();
                if (!granted) {
                    toast({
                        type: "error",
                        title: "Permission Required",
                        message:
                            "Microphone and speech recognition permissions are required.",
                    });
                    isProcessing.current = false;
                    return;
                }

                ExpoSpeechRecognitionModule.start({
                    lang: locale || "en-US",
                    interimResults: true,
                    continuous: true,
                });

                setIsRecording(true);

                intervalRef.current = setInterval(() => {
                    setRecordingDuration((p) => p + 100);

                    if (Platform.OS === "ios") {
                        setVolumeLevels((prev) => {
                            const last = prev.length ? prev[prev.length - 1] : 30;
                            const target = 20 + Math.random() * 40;
                            const smoothed = last * 0.6 + target * 0.4;
                            const newArray = [
                                ...prev,
                                Math.min(smoothed, 100),
                            ];
                            return newArray.length > 100
                                ? newArray.slice(-100)
                                : newArray;
                        });
                    }
                }, 100);

                isProcessing.current = false;
            } catch (err) {
                isProcessing.current = false;
                setIsRecording(false);
                toast({
                    type: "error",
                    title: "Error",
                    message: "Unable to start voice recognition",
                });
                throw err;
            }
        },
        [isRecording, toast],
    );

    const stopRecording = useCallback(async (): Promise<string> => {
        if (!isRecording) {
            throw new Error("NO_RECORDING_IN_PROGRESS");
        }

        try {
            if (intervalRef.current) clearInterval(intervalRef.current);

            ExpoSpeechRecognitionModule.stop();

            setIsRecording(false);
            setRecordingDuration(0);

            await new Promise((resolve) => setTimeout(resolve, 300));

            const transcription = transcriptionRef.current.trim();
            setVolumeLevels([]);

            if (!transcription) {
                throw new Error("NO_SPEECH_DETECTED");
            }

            return transcription;
        } catch (err) {
            setIsRecording(false);
            setRecordingDuration(0);
            setVolumeLevels([]);
            throw err;
        }
    }, [isRecording]);

    const cancelRecording = useCallback(async () => {
        try {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (isRecording) {
                ExpoSpeechRecognitionModule.abort();
            }
            setIsRecording(false);
            setRecordingDuration(0);
            setVolumeLevels([]);
            transcriptionRef.current = "";
            isProcessing.current = false;
        } catch {
            // Ignore cancel errors
        }
    }, [isRecording]);

    const reinitialize = useCallback(async () => {
        try {
            transcriptionRef.current = "";
            isProcessing.current = false;
            return true;
        } catch {
            return false;
        }
    }, []);

    return {
        isRecording,
        recordingDuration,
        volumeLevels,
        startRecording,
        stopRecording,
        cancelRecording,
        reinitialize,
        audioFile: "",
    };
};
