import { Message } from "../models/Message";

export interface ChatRepository {
    getInitialMessages(): Promise<Message[]>;
    subscribeToMessages(cb: (msg: Message) => void): () => void;
    getMessageById(id: number): Promise<Message | undefined>;
    updateMessage(message: Message): Promise<void>;
    sendMessage(message: Message): Promise<void>;
}
