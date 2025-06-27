import { ChatResponse, Message } from "@dtypes/chatbot/chatbot-types";

import axios, { AxiosPromise } from "axios";

export class ChatService {
    static async sendMessages(messages: Message[]): AxiosPromise<ChatResponse> {
        return axios.post<ChatResponse>("/chat/new-message", {
            messages,
        });
    }
}
