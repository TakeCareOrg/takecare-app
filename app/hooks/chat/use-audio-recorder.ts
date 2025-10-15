import { useCallback, useEffect, useRef, useState } from "react";

import {
    AudioModule,
    RecordingPresets,
    setAudioModeAsync,
    useAudioRecorder as useExpoAudioRecorder,
} from "expo-audio";

export const useAudioRecorder = () => {
    const recorder = useExpoAudioRecorder(RecordingPresets.HIGH_QUALITY);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const isProcessing = useRef(false);

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const startRecording = useCallback(async () => {
        if (recorder.isRecording || isProcessing.current) return;
        isProcessing.current = true;

        const perm = await AudioModule.requestRecordingPermissionsAsync();
        if (!perm.granted) throw new Error("Permission denied");

        await setAudioModeAsync({ allowsRecording: true });
        await recorder.prepareToRecordAsync();
        await recorder.record();

        setRecordingDuration(0);

        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(
            () => setRecordingDuration((p) => p + 100),
            100,
        );

        isProcessing.current = false;
    }, [recorder]);

    const stopRecording = useCallback(async (): Promise<string> => {
        if (!recorder.isRecording) throw new Error("NO_RECORDING_IN_PROGRESS");
        isProcessing.current = true;

        if (intervalRef.current) clearInterval(intervalRef.current);

        await recorder.stop();
        await setAudioModeAsync({ allowsRecording: false });

        const uri = recorder.uri;
        if (!uri) throw new Error("NO_URI");

        const transcription = await transcribeWithGroq(uri);

        isProcessing.current = false;
        return transcription;
    }, [recorder]);

    const cancelRecording = useCallback(async () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (recorder.isRecording) await recorder.stop();
        await setAudioModeAsync({ allowsRecording: false });
        setRecordingDuration(0);
        isProcessing.current = false;
    }, [recorder]);

    return {
        isRecording: recorder.isRecording,
        recordingDuration,
        startRecording,
        stopRecording,
        cancelRecording,
    };
};

const transcribeWithGroq = async (uri: string): Promise<string> => {
    try {
        const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
        if (!apiKey) throw new Error("Missing GROQ API key");

        const formData = new FormData();
        formData.append("file", {
            uri,
            name: "audio.wav",
            type: "audio/wav",
        } as any);
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
    } catch (error) {
        throw new Error("ERROR_TRANSCRIBING_AUDIO");
    }
};
