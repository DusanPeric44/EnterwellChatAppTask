import { ChatRepository } from "../repositories/ChatRepository";
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
            const chatError = toChatError(error);
            throw chatError;
        }
    };
}

function toChatError(error: unknown): ChatError {
    if (!error) {
        return { type: "unknown" };
    }

    const candidate = error as ChatError;
    if (candidate.type) {
        return candidate;
    }

    if (error instanceof Error) {
        return { type: "unknown", message: error.message };
    }

    return { type: "unknown" };
}
