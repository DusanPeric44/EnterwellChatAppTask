import { Message } from "../../domain/models/Message";

interface ChatRepository {
    getMessages(): Promise<Message[]>;
    subscribeToMessages(cb: (msg: Message) => void): () => void;
}