import axios, { AxiosPromise } from "axios";

import { ChatResponse, Message } from "@dtypes/chatbot/chatbot-types";

interface TranscriptionResponse {
    transcription: string;
}

export class ChatService {
    static async sendMessages(messages: Message[]): AxiosPromise<ChatResponse> {
        return axios.post<ChatResponse>("/chat/new-message", { messages });
    }

    static async transcribeAudio(
        audioBase64: string,
    ): AxiosPromise<TranscriptionResponse> {
        const formData = new FormData();
        formData.append("audio", {
            uri: `data:audio/m4a;base64,${audioBase64}`,
            type: "audio/m4a",
            name: "recording.m4a",
        } as any);

        return axios.post<TranscriptionResponse>("/chat/transcribe", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    }
}
