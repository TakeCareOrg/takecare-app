import axios, { AxiosPromise } from "axios";

import { ChatResponse, Message } from "@dtypes/chatbot/chatbot-types";

export class ChatService {
    static async sendMessages(messages: Message[]): AxiosPromise<ChatResponse> {
        return axios.post<ChatResponse>("/chat/new-message", { messages });
    }

    static async sendVocals(audioUri: string): AxiosPromise<ChatResponse> {
        const formData = new FormData();
        formData.append("audio", {
            uri: audioUri,
            type: "audio/m4a",
            name: "recording.m4a",
        } as any);

        return axios.post<ChatResponse>("/chat/new-vocal", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    }
}
