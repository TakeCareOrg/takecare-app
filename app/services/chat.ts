import { Message } from "@stores/chat";

import axios, { AxiosPromise } from "axios";

export class ChatService {
    static async sendMessages(messages: Message[]): AxiosPromise {
        return axios.post<{ token: string }>("/chat/new-message", {
            messages,
        });
    }
}
