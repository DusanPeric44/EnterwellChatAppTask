import { Message } from "../../domain/models/Message";
import { apiClient } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";
import { ChatRepository } from "./ChatRepository";


export class RemoteChatRepository implements ChatRepository {
    getInitialMessages(): Promise<Message[]> {
        return apiClient.get(ENDPOINTS.MESSAGES);
    }

    subscribeToMessages(
        onMessage: (message: Message) => void
    ): () => void {
        apiClient.connect(raw => {
            // Ovdje ide kastovanje po potrebi u poruku sa domain layera
            const message = raw as Message;
            return onMessage(message)
        }
        );
        return () => apiClient.disconnect();
    }

    async getMessageById(id: number): Promise<Message | undefined> {
        return apiClient.get(`${ENDPOINTS.MESSAGES}/${id}`);
    }
    async updateMessage(message: Message): Promise<void> {
        return apiClient.put(`${ENDPOINTS.MESSAGES}/${message.id}`, message);
    }
}