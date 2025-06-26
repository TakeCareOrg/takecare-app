

import axios, { AxiosPromise } from "axios";
import { Message, ChatResponse } from "../types/chatbot/chatbot.types";

export class ChatService {
    static async sendMessages(messages: Message[]): AxiosPromise<ChatResponse> {
        return axios.post<ChatResponse>("/chat/new-message", {
            messages,
        });
    }
}
