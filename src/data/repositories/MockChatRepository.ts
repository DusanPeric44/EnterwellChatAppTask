import { ChatRepository } from './ChatRepository';
import { Message } from '../../domain/models/Message';

export class MockChatRepository implements ChatRepository {
    public messages: Message[] = [];

    private subscribers = new Set<
        (message: Message) => void
    >();

    constructor(initialMessages: Message[] = []) {
        this.messages = [...initialMessages];
    }
    getMessageById(id: number): Promise<Message | undefined> {
        return Promise.resolve(this.messages.find(msg => msg.id === id));
    }
    updateMessage(message: Message): Promise<void> {
        const index = this.messages.findIndex(msg => msg.id === message.id);
        if (index === -1) {
            throw new Error('Message not found.');
        }
        this.messages[index] = message;
        return Promise.resolve();
    }

    async getInitialMessages(): Promise<Message[]> {
        return [...this.messages];
    }

    subscribeToMessages(
        onMessage: (message: Message) => void
    ): () => void {
        this.subscribers.add(onMessage);

        return () => {
            this.subscribers.delete(onMessage);
        };
    }

    async sendMessage(message: Message): Promise<void> {
        // Simulacija realtime emit-a
        this.emitMessage(message);
    }

    emitMessage(message: Message) {
        this.messages.push(message);

        this.subscribers.forEach(cb => cb(message));
    }

    clear() {
        this.messages = [];
        this.subscribers.clear();
    }
}