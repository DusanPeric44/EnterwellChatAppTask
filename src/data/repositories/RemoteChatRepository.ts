import { ApiError } from "../errors/ApiError";
import { ChatError } from "../../domain/errors/ChatError";
import { Message } from "../../domain/models/Message";
import { apiClient } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";
import { ChatRepository } from "./ChatRepository";


export class RemoteChatRepository implements ChatRepository {
    async sendMessage(message: Message): Promise<void> {
        try {
            await apiClient.post<void>(ENDPOINTS.MESSAGES, message);
        } catch (error) {
            throw this.mapError(error);
        }
    }
    async getInitialMessages(): Promise<Message[]> {
        try {
            const response = await apiClient.get<Message[]>(ENDPOINTS.MESSAGES);
            return response || [];
        } catch (error) {
            throw this.mapError(error);
        }
    }

    subscribeToMessages(
        onMessage: (message: Message) => void
    ): () => void {
        try {
            apiClient.connect(raw => {
                // Ovdje ide kastovanje po potrebi u poruku sa domain layera
                const message = raw as Message;
                return onMessage(message)
            }
            );
            return () => apiClient.disconnect();
        } catch (error) {
            throw this.mapError(error);
        }
    }

    async getMessageById(id: number): Promise<Message | undefined> {
        try {
            const response = await apiClient.get<Message>(`${ENDPOINTS.MESSAGES}/${id}`);
            return response;
        } catch (error) {
            throw this.mapError(error);
        }
    }
    async updateMessage(message: Message): Promise<void> {
        try {
            await apiClient.put<void>(`${ENDPOINTS.MESSAGES}/${message.id}`, message);
        } catch (error) {
            throw this.mapError(error);
        }
    }

    private mapError(error: unknown): ChatError {
        if (error instanceof ApiError) {
            if (!error.status) return { type: 'network' };
            if (error.status === 401) return { type: 'unauthorized' };
            if (error.status === 404) return { type: 'not_found' };
        }

        return { type: 'unknown' };
    }
}