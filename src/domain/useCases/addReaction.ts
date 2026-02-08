import { ChatRepository } from "../../data/repositories/ChatRepository";
import { ReactionType } from "../enums/ReactionType";
import { Message } from "../models/Message";

export function addReaction(repository: ChatRepository) {
    return async (message: Message, reaction: ReactionType): Promise<Message | undefined> => {
        if (!message) {
            return undefined;
        }

        if (message.reactions?.value === reaction) {
            message.reactions.count++;
        } else {
            message.reactions = { value: reaction, count: 1 };
        }

        await repository.updateMessage(message);

        return message;
    }
}