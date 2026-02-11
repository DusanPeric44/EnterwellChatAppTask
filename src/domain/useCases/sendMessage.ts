import { ChatRepository } from "../repositories/ChatRepository";
import { Message } from "../models/Message";

export type SendMessageInput = Omit<
    Message,
    'id' | 'reactions' | 'type' | 'from' | 'url'
>;

export function sendMessage(repository: ChatRepository) {
    return async (
        input: SendMessageInput
    ): Promise<Message> => {
        const message: Message = {
            ...input,
            id: Date.now(),
            reactions: undefined,
            type: 0,
            from: 0,
            url: null,
        };

        // Postaviti ovo nakon implementacije API
        await repository.sendMessage(message);

        return message;
    };
}
