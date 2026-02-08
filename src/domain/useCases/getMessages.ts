import { ChatRepository } from "../../data/repositories/ChatRepository";
import { Message } from "../models/Message";

export function getMessages(repository: ChatRepository) {
    return async (
        onNewMessage: (message: Message) => void
    ) => {
        const initialMessages = await repository.getInitialMessages();
        const unsubscribe = repository.subscribeToMessages(onNewMessage);
        return {
            initialMessages,
            unsubscribe,
        };
    };
}