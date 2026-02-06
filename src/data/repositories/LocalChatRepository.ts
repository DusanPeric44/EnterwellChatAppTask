import { Message } from "../../domain/models/Message";
import { ChatRepository } from "./ChatRepository";
import messagesData from '../sources/localMessages.json';

export class LocalChatRepository implements ChatRepository {
    private messages: Message[] = (messagesData as any[]).map((m) => ({
        ...m,
        type: m.type as 0 | 1,
        from: m.from as 0 | 1,
        reactions: Array.isArray(m.reactions) ? m.reactions : [m.reactions],
    }));
    private intervalId: NodeJS.Timeout | null = null;

    async getInitialMessages(): Promise<Message[]> {
        return this.messages;
    }

    subscribeToMessages(onMessage: (msg: Message) => void): () => void {
        this.intervalId = setInterval(() => {
            const randomMessage = this.getRandomMessage();
            this.messages = [...this.messages, randomMessage];
            onMessage(randomMessage);
        }, this.getRandomDelay());

        return () => {
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }
        };
    }

    private getRandomDelay() {
        return Math.random() * 4000 + 1000; // Delay između 1 i 5 sekunda
    }

    private getRandomMessage() {
        const randomIndex = Math.floor(Math.random() * this.messages.length);
        return this.messages[randomIndex];
    }
}
