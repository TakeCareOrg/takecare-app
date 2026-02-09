import { useEffect, useRef, useState, useCallback } from "react";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AuthData } from "../types/auth.types";

/**
 * Optimized vocal recording hook that pre-warms the audio session
 * to eliminate cold-start delays on first press.
 *
 * Key performance optimizations:
 * 1. Audio session is initialized on mount (not on first record press)
 * 2. Microphone permissions are requested eagerly on mount
 * 3. Recording uses speech-optimized settings (low bitrate, mono, compressed)
 *    to minimize file size and speed up transcription upload
 * 4. Uses m4a/AAC format for best compression-to-quality ratio for speech
 */

/** Speech-optimized recording preset: mono, low sample rate, compressed */
const SPEECH_RECORDING_OPTIONS: Audio.RecordingOptions = {
    isMeteringEnabled: false,
    android: {
        extension: ".m4a",
        outputFormat: Audio.AndroidOutputFormat.MPEG_4,
        audioEncoder: Audio.AndroidAudioEncoder.AAC,
        sampleRate: 16000,
        numberOfChannels: 1,
        bitRate: 64000,
    },
    ios: {
        extension: ".m4a",
        outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
        audioQuality: Audio.IOSAudioQuality.LOW,
        sampleRate: 16000,
        numberOfChannels: 1,
        bitRate: 64000,
    },
    web: {
        mimeType: "audio/webm",
        bitsPerSecond: 64000,
    },
};

interface UseVocalRecordingOptions {
    onTranscriptionComplete?: (text: string) => void;
    onTranscriptionError?: (error: string) => void;
    onRecordingStateChange?: (isRecording: boolean) => void;
}

interface UseVocalRecordingReturn {
    isRecording: boolean;
    isTranscribing: boolean;
    isReady: boolean;
    startRecording: () => Promise<void>;
    stopRecordingAndTranscribe: () => Promise<void>;
    cancelRecording: () => Promise<void>;
    hasPermission: boolean;
}

export const useVocalRecording = (
    options: UseVocalRecordingOptions = {},
): UseVocalRecordingReturn => {
    const { onTranscriptionComplete, onTranscriptionError, onRecordingStateChange } =
        options;

    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);

    const recordingRef = useRef<Audio.Recording | null>(null);
    const isSessionInitialized = useRef(false);

    /**
     * PRE-WARM: Initialize audio session on mount.
     * This is the main optimization that eliminates the cold-start delay
     * users experience on their first vocal press.
     */
    useEffect(() => {
        const initAudioSession = async () => {
            try {
                // 1. Request permissions early
                const { status } = await Audio.requestPermissionsAsync();
                const granted = status === "granted";
                setHasPermission(granted);

                if (!granted) {
                    console.warn(
                        "[VocalRecording] Microphone permission not granted",
                    );
                    return;
                }

                // 2. Pre-configure audio mode for recording
                // This is the expensive operation that causes cold-start delay
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                    interruptionModeIOS: InterruptionModeIOS.DoNotMix,
                    interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
                    shouldDuckAndroid: true,
                    playThroughEarpieceAndroid: false,
                });

                isSessionInitialized.current = true;
                setIsReady(true);
            } catch (error) {
                console.error(
                    "[VocalRecording] Failed to initialize audio session:",
                    error,
                );
            }
        };

        initAudioSession();

        // Cleanup on unmount
        return () => {
            if (recordingRef.current) {
                recordingRef.current
                    .stopAndUnloadAsync()
                    .catch(() => {});
            }
        };
    }, []);

    const searchForToken = async (): Promise<string> => {
        const token = await AsyncStorage.getItem("@AuthData");
        if (token) {
            const authData: AuthData = JSON.parse(token);
            return authData.token;
        }
        return "";
    };

    const startRecording = useCallback(async () => {
        try {
            // Ensure audio session is initialized (should already be done)
            if (!isSessionInitialized.current) {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                    interruptionModeIOS: InterruptionModeIOS.DoNotMix,
                    interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
                    shouldDuckAndroid: true,
                    playThroughEarpieceAndroid: false,
                });
                isSessionInitialized.current = true;
            }

            // Create and start recording with speech-optimized settings
            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync(SPEECH_RECORDING_OPTIONS);
            await recording.startAsync();

            recordingRef.current = recording;
            setIsRecording(true);
            onRecordingStateChange?.(true);
        } catch (error) {
            console.error("[VocalRecording] Failed to start recording:", error);
            onTranscriptionError?.("Failed to start recording. Please try again.");
        }
    }, [onRecordingStateChange, onTranscriptionError]);

    const stopRecordingAndTranscribe = useCallback(async () => {
        if (!recordingRef.current) return;

        try {
            setIsRecording(false);
            onRecordingStateChange?.(false);

            // Stop the recording
            await recordingRef.current.stopAndUnloadAsync();
            const uri = recordingRef.current.getURI();
            recordingRef.current = null;

            if (!uri) {
                onTranscriptionError?.("Recording failed - no audio file produced.");
                return;
            }

            // Send to transcription API
            setIsTranscribing(true);

            const formData = new FormData();
            formData.append("audio", {
                uri,
                type: "audio/m4a",
                name: "vocal_message.m4a",
            } as any);

            const token = await searchForToken();
            const response = await axios.post(
                `${process.env.EXPO_PUBLIC_BACKEND_URL}/chat/transcribe`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                    // Timeout optimized for speech transcription
                    timeout: 30000,
                },
            );

            const transcribedText = response.data?.text || response.data?.transcription;
            if (transcribedText) {
                onTranscriptionComplete?.(transcribedText);
            } else {
                onTranscriptionError?.(
                    "Could not transcribe audio. Please try again.",
                );
            }
        } catch (error: any) {
            console.error("[VocalRecording] Transcription error:", error);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Transcription failed. Please try again.";
            onTranscriptionError?.(message);
        } finally {
            setIsTranscribing(false);
        }
    }, [onTranscriptionComplete, onTranscriptionError, onRecordingStateChange]);

    const cancelRecording = useCallback(async () => {
        if (!recordingRef.current) return;

        try {
            await recordingRef.current.stopAndUnloadAsync();
            recordingRef.current = null;
            setIsRecording(false);
            onRecordingStateChange?.(false);
        } catch (error) {
            console.error("[VocalRecording] Failed to cancel recording:", error);
        }
    }, [onRecordingStateChange]);

    return {
        isRecording,
        isTranscribing,
        isReady,
        startRecording,
        stopRecordingAndTranscribe,
        cancelRecording,
        hasPermission,
    };
};
