import { useCallback, useRef, useState } from "react";

import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

const MAX_RECORDING_DURATION = 90000;

export const useAudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const recordingRef = useRef<Audio.Recording | null>(null);
    const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);

    const startRecording = useCallback(async () => {
        try {
            const permission = await Audio.requestPermissionsAsync();
            if (!permission.granted) {
                throw new Error("PERMISSION_DENIED");
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY,
            );
            await recording.startAsync();

            recordingRef.current = recording;
            setIsRecording(true);
            setRecordingDuration(0);
            startTimeRef.current = Date.now();

            // Mettre à jour la durée toutes les 100ms
            durationIntervalRef.current = setInterval(() => {
                const elapsed = Date.now() - startTimeRef.current;
                setRecordingDuration(elapsed);

                // Arrêter automatiquement à 1m30
                if (elapsed >= MAX_RECORDING_DURATION) {
                    stopRecording();
                }
            }, 100);
        } catch (error) {
            throw error;
        }
    }, []);

    const stopRecording = useCallback(async (): Promise<string | null> => {
        try {
            if (!recordingRef.current) return null;

            if (durationIntervalRef.current) {
                clearInterval(durationIntervalRef.current);
                durationIntervalRef.current = null;
            }

            await recordingRef.current.stopAndUnloadAsync();
            const uri = recordingRef.current.getURI();

            if (!uri) {
                throw new Error("NO_RECORDING_URI");
            }

            // Convertir en base64
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            recordingRef.current = null;
            setIsRecording(false);
            setRecordingDuration(0);

            return base64;
        } catch (error) {
            setIsRecording(false);
            setRecordingDuration(0);
            throw error;
        }
    }, []);

    const cancelRecording = useCallback(async () => {
        try {
            if (durationIntervalRef.current) {
                clearInterval(durationIntervalRef.current);
                durationIntervalRef.current = null;
            }

            if (recordingRef.current) {
                await recordingRef.current.stopAndUnloadAsync();
                recordingRef.current = null;
            }

            setIsRecording(false);
            setRecordingDuration(0);
        } catch (error) {
            throw error;
        }
    }, []);

    return {
        isRecording,
        recordingDuration,
        startRecording,
        stopRecording,
        cancelRecording,
    };
};
