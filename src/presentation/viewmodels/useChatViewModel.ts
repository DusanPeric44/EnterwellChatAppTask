import { useEffect, useState } from "react";
import { Message } from "../../domain/models/Message";
import { ChatRepository } from "../../domain/repositories/ChatRepository";
import { ReactionType } from "../../domain/enums/ReactionType";
import { addReaction } from "../../domain/useCases/addReaction";
import { getMessages } from "../../domain/useCases/getMessages";
import { sendMessage } from "../../domain/useCases/sendMessage";
import { ChatError } from "../../domain/errors/ChatError";


const useChatViewModel = (
    repository: ChatRepository
) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [error, setError] = useState<ChatError | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isCancelled = false;
        let unsubscribeFn: (() => void) | undefined;

        const bufferedMessages: Message[] = [];
        let isReady = false;

        const init = async () => {
            setLoading(true);
            setError(null);
            try {
                const { initialMessages, unsubscribe } =
                    await getMessages(repository)(msg => {
                        if (isCancelled) return;

                        if (!isReady) {
                            bufferedMessages.push(msg);
                        } else {
                            setMessages(prev => {
                                if (prev.some(m => m.id === msg.id)) return prev;
                                return [...prev, msg];
                            });
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
            } catch (e) {
                if (!isCancelled) {
                    setError(e as ChatError);
                    setLoading(false);
                }
            }
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

        setMessages((prevMessages) => {
            if (prevMessages.some(m => m.id === sent.id)) return prevMessages;
            return [...prevMessages, sent];
        });
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
