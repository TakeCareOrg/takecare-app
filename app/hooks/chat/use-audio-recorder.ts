import Groq from "groq-sdk";
import { useCallback, useRef, useState } from "react";

import {
    AudioModule,
    RecordingPresets,
    setAudioModeAsync,
    useAudioRecorder as useExpoAudioRecorder,
} from "expo-audio";

interface UseAudioRecorderReturn {
    isRecording: boolean;
    recordingDuration: number;
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<string>;
    cancelRecording: () => Promise<void>;
}

const groq = new Groq({ apiKey: process.env.EXPO_PUBLIC_GROQ_API_KEY });

export const useAudioRecorder = (): UseAudioRecorderReturn => {
    const recorder = useExpoAudioRecorder(RecordingPresets.HIGH_QUALITY);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startRecording = useCallback(async () => {
        const perm = await AudioModule.requestRecordingPermissionsAsync();
        if (!perm.granted) throw new Error("Permission denied");
        await setAudioModeAsync({ allowsRecording: true });
        await recorder.prepareToRecordAsync();
        recorder.record();
        setRecordingDuration(0);
        intervalRef.current = setInterval(() => {
            setRecordingDuration((prev) => prev + 100);
        }, 100);
    }, [recorder]);

    const stopRecording = useCallback(async (): Promise<string> => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        await recorder.stop();
        const uri = recorder.uri;
        if (!uri) throw new Error("No URI");
        const transcription = await transcribeWithGroq(uri);
        return transcription;
    }, [recorder]);

    const cancelRecording = useCallback(async () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        try {
            await recorder.stop();
        } catch {}
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
    const file = await fetch(uri);
    const blob = await file.blob();
    const audioFile = new File([blob], "audio.wav", { type: "audio/wav" });

    const response = await groq.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-large-v3",
    });

    return response.text;
};
