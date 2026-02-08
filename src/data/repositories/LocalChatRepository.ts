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

    async getMessageById(id: number): Promise<Message | undefined> {
        return this.messages.find((m) => m.id === id);
    }

    async updateMessage(message: Message): Promise<void> {
        const index = this.messages.findIndex((m) => m.id === message.id);
        if (index === -1) {
            throw new Error("Message not found");
        }
        this.messages[index] = message;
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
