import { useEffect, useState } from "react";
import { Message } from "../../domain/models/Message";
import { LocalChatRepository } from "../../data/repositories/LocalChatRepository";
import { ChatRepository } from "../../data/repositories/ChatRepository";
import { ReactionType } from "../../domain/enums/ReactionType";
import { addReaction } from "../../domain/useCases/addReaction";


const useChatViewModel = (
    // Ovjde zamijeniti LocalChatRepository sa RemoteChatRepository
    // za API funkcionalnost
    repository: ChatRepository = new LocalChatRepository()
) => {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        repository.getInitialMessages().then(setMessages);

        const unsubscribe = repository.subscribeToMessages(msg => setMessages(prevMessages => [...prevMessages, msg]));

        return unsubscribe;
    }, []);

    const onReact = async (messageId: number, reaction: ReactionType) => {
        const message = messages.find((m) => m.id === messageId);
        if (!message) {
            return;
        }

        const updated = await addReaction(repository)(message, reaction);
        if (updated) {
            setMessages((prevMessages) =>
                prevMessages.map((m) =>
                    m.id === messageId ? updated : m
                )
            );
        }
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
            const nextId = Math.floor(Math.random() * 1000000) + 50;

            const newMessage: Message = {
                id: nextId,
                type: 0,
                from: 0,
                text: trimmed,
                url: null,
                replyTo: replyToId ?? null,
                reactions: { value: 0, count: 0 },
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
