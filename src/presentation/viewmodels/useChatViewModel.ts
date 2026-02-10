import { useEffect, useState, useMemo } from "react";
import { Message } from "../../domain/models/Message";
import { LocalChatRepository } from "../../data/repositories/LocalChatRepository";
import { ChatRepository } from "../../data/repositories/ChatRepository";
import { ReactionType } from "../../domain/enums/ReactionType";
import { addReaction } from "../../domain/useCases/addReaction";
import { getMessages } from "../../domain/useCases/getMessages";
import { sendMessage } from "../../domain/useCases/sendMessage";


const useChatViewModel = (
    repo?: ChatRepository
) => {
    // Ovjde zamijeniti LocalChatRepository sa RemoteChatRepository za API funkcionalnost
    const repository = useMemo(() => repo ?? new LocalChatRepository(), [repo]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isCancelled = false;
        let unsubscribeFn: (() => void) | undefined;

        const bufferedMessages: Message[] = [];
        let isReady = false;

        const init = async () => {
            setLoading(true);
            const { initialMessages, unsubscribe } =
                await getMessages(repository)(msg => {
                    if (isCancelled) return;

                    if (!isReady) {
                        bufferedMessages.push(msg);
                    } else {
                        setMessages(prev => [...prev, msg]);
                    }
                });

            if (isCancelled) {
                unsubscribe();
                return;
            }

            unsubscribeFn = unsubscribe;

            setMessages([...initialMessages, ...bufferedMessages]);
            isReady = true;
            setLoading(false);
        };

        init();

        return () => {
            isCancelled = true;
            unsubscribeFn?.();
            setError(null);
        };
    }, [repository]);

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

    const onSendMessage = async (text: string, replyToId?: number | null) => {
        const trimmed = text.trim();
        if (!trimmed) {
            return;
        }
        const sent = await sendMessage(repository)({
            text: trimmed,
            replyTo: replyToId ?? null,
        });

        setMessages((prevMessages) => [...prevMessages, sent]);
    };

    return {
        messages,
        onReact,
        sendMessage: onSendMessage,
        error,
        loading,
    }
}

export default useChatViewModel;
