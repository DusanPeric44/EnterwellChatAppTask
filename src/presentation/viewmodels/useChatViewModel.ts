import { useEffect, useState } from "react";
import { Message } from "../../domain/models/Message";
import { LocalChatRepository } from "../../data/repositories/LocalChatRepository";

// Ovjde zamijeniti LocalChatRepository sa RemoteChatRepository
// za API funkcionalnost
const repository = new LocalChatRepository();

const useChatViewModel = () => {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        repository.getInitialMessages().then(setMessages);

        const unsubscribe = repository.subscribeToMessages(msg => setMessages(prevMessages => [...prevMessages, msg]));

        return unsubscribe;
    }, []);

    const onReact = (message: Message, reaction: { value: number; count: number }) => {
        setMessages((prevMessages) =>
            prevMessages.map((m) =>
                m.id === message.id ? { ...m, reactions: [...m.reactions, reaction] } : m
            )
        );
    };
    const onReplyPress = (message: Message) => {
        setMessages((prevMessages) =>
            prevMessages.map((m) =>
                m.id === message.id ? { ...m, replyTo: message.id } : m
            )
        );
    };
    const sendMessage = (text: string, replyToId?: number | null) => {
        const trimmed = text.trim();
        if (!trimmed) {
            return;
        }

        setMessages((prevMessages) => {
            const nextId =
                prevMessages.length > 0
                    ? Math.max(...prevMessages.map((m) => m.id)) + 1
                    : 1;

            const newMessage: Message = {
                id: nextId,
                type: 0,
                from: 0,
                text: trimmed,
                url: null,
                replyTo: replyToId ?? null,
                reactions: [],
            };

            return [...prevMessages, newMessage];
        });
    };
    const scrollToMessage = (id: number) => {
        const message = messages.find((m) => m.id === id);
        if (message) {
            //scroll to message
        }
    };

    return {
        messages,
        onReact,
        onReplyPress,
        scrollToMessage,
        sendMessage
    }
}

export default useChatViewModel;
