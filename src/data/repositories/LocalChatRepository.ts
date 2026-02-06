import { Message } from "../../domain/models/Message";
import { ChatRepository } from "./ChatRepository";
import messagesData from "../sources/localMessages.json";

export class LocalChatRepository implements ChatRepository {
    private messages: Message[] = [];
    private intervalId: NodeJS.Timeout | null = null;
    private nextId: number = 1;

    async getInitialMessages(): Promise<Message[]> {
        return this.messages;
    }

    subscribeToMessages(onMessage: (msg: Message) => void): () => void {
        const scheduleNext = () => {
            const nextMessage = this.getNextMessage();
            if (!nextMessage) {
                return;
            }
            this.messages = [...this.messages, nextMessage];
            onMessage(nextMessage);
            this.intervalId = setTimeout(scheduleNext, this.getRandomDelay());
        };

        this.intervalId = setTimeout(scheduleNext, this.getRandomDelay());

        return () => {
            if (this.intervalId) {
                clearTimeout(this.intervalId);
            }
        };
    }

    private getRandomDelay() {
        return Math.random() * 4000 + 1000;
    }

    private getNextMessage(): Message | undefined {
        const nextMessage = messagesData.find((m) => m.id === this.nextId);
        if (!nextMessage) {
            return undefined;
        }
        this.nextId++;

        return this.mapToMessage(nextMessage);
    }

    private mapToMessage(data: any): Message | undefined {
        return {
            id: data.id,
            type: data.type,
            from: data.from,
            text: data.text,
            url: data.url,
            replyTo: data.replyTo,
            reactions: data.reactions,
        };
    }
}
