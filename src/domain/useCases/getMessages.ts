import { ChatRepository } from "../../data/repositories/ChatRepository";
import { ChatError } from "../errors/ChatError";
import { Message } from "../models/Message";

export function getMessages(repository: ChatRepository) {
    return async (
        onNewMessage: (message: Message) => void
    ) => {
        try {
            const initialMessages = await repository.getInitialMessages();
            const unsubscribe = repository.subscribeToMessages(onNewMessage);
            return {
                initialMessages,
                unsubscribe,
            };
        } catch (error) {
            throw error as ChatError;
        }
    };
}