import { useCallback, useState } from "react";

import {
    ExpoSpeechRecognitionModule,
    useSpeechRecognitionEvent,
} from "expo-speech-recognition";

interface UseSpeechRecognitionOptions {
    onTranscript?: (text: string) => void;
    onError?: (error: string) => void;
    locale?: string;
}

interface UseSpeechRecognitionReturn {
    isRecording: boolean;
    recordingDuration: number;
    startRecording: () => Promise<boolean>;
    stopRecording: () => void;
    cancelRecording: () => void;
}

export const useSpeechRecognition = ({
    onTranscript,
    onError,
    locale = "en-US",
}: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionReturn => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);

    // Handle recording start
    useSpeechRecognitionEvent("start", () => {
        setIsRecording(true);
        setRecordingDuration(0);
    });

    // Handle recording end
    useSpeechRecognitionEvent("end", () => {
        setIsRecording(false);
        setRecordingDuration(0);
    });

    // Handle transcription results
    useSpeechRecognitionEvent("result", (event) => {
        const transcription = event.results[0]?.transcript;
        if (transcription && onTranscript) {
            onTranscript(transcription);
        }
    });

    // Handle errors
    useSpeechRecognitionEvent("error", (event) => {
        const errorMessage = event.error || "Speech recognition error";
        if (onError) {
            onError(errorMessage);
        }
        setIsRecording(false);
        setRecordingDuration(0);
    });

    // Start recording
    const startRecording = useCallback(async (): Promise<boolean> => {
        try {
            const result =
                await ExpoSpeechRecognitionModule.requestPermissionsAsync();

            if (!result.granted) {
                if (onError) {
                    onError("Microphone permission required");
                }
                return false;
            }

            ExpoSpeechRecognitionModule.start({
                lang: locale,
                interimResults: true,
                maxAlternatives: 1,
                continuous: false,
            });

            return true;
        } catch (error) {
            if (onError) {
                onError(
                    error instanceof Error
                        ? error.message
                        : "Failed to start recording",
                );
            }
            return false;
        }
    }, [locale, onError]);

    // Stop recording
    const stopRecording = useCallback(() => {
        ExpoSpeechRecognitionModule.stop();
    }, []);

    // Cancel recording
    const cancelRecording = useCallback(() => {
        ExpoSpeechRecognitionModule.abort();
        setIsRecording(false);
        setRecordingDuration(0);
    }, []);

    return {
        isRecording,
        recordingDuration,
        startRecording,
        stopRecording,
        cancelRecording,
    };
};
