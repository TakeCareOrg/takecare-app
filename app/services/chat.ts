import axios, { AxiosPromise } from "axios";

import { ChatResponse, Message } from "@dtypes/chatbot/chatbot-types";

export class ChatService {
    static sendMessages(messages: Message[]): AxiosPromise<ChatResponse> {
        return axios.post<ChatResponse>("/chat/new-message", { messages });
    }
}
