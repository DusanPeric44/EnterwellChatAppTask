import { renderHook, waitFor, act } from '@testing-library/react-native';
import { MockChatRepository } from "../src/data/repositories/MockChatRepository";
import { ReactionType } from "../src/domain/enums/ReactionType";
import { Message } from "../src/domain/models/Message";
import useChatViewModel from "../src/presentation/viewmodels/useChatViewModel";

describe('useChatViewModel', () => {
    let repo: MockChatRepository;

    beforeEach(() => {
        repo = new MockChatRepository();
    });

    it('loads initial messages', async () => {
        const message: Message = {
            id: 1,
            text: 'Hello',
            type: 0,
            from: 1,
            url: null,
            replyTo: null,
        };
        repo = new MockChatRepository([message]);

        const { result } = renderHook(() => useChatViewModel(repo));

        // Initial loading state might be true
        // await waitFor(() => expect(result.current.loading).toBe(true)); 
        // Depending on how fast it is, we might miss the loading=true state.

        await waitFor(() => {
            expect(result.current.messages).toHaveLength(1);
        });

        expect(result.current.messages[0]).toEqual(message);
        expect(result.current.loading).toBe(false);
    });

    it('sends a message', async () => {
        const { result } = renderHook(() => useChatViewModel(repo));

        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.sendMessage('New message');
        });

        await waitFor(() => {
            expect(result.current.messages).toHaveLength(1);
        });

        expect(result.current.messages[0].text).toBe('New message');
        expect(repo.messages).toHaveLength(1);
    });

    it('adds a reaction to a message', async () => {
        const message: Message = {
            id: 1,
            text: 'Hello',
            type: 0,
            from: 1,
            url: null,
            replyTo: null,
        };
        repo = new MockChatRepository([message]);

        const { result } = renderHook(() => useChatViewModel(repo));

        await waitFor(() => expect(result.current.messages).toHaveLength(1));

        await act(async () => {
            await result.current.onReact(1, ReactionType.Love);
        });

        await waitFor(() => {
            expect(result.current.messages[0].reactions).toEqual({
                value: ReactionType.Love,
                count: 1
            });
        });

        const storedMessage = await repo.getMessageById(1);
        expect(storedMessage?.reactions).toEqual({
            value: ReactionType.Love,
            count: 1
        });
    });

    it('updates messages when new message is received from repository', async () => {
        const { result } = renderHook(() => useChatViewModel(repo));

        await waitFor(() => expect(result.current.loading).toBe(false));

        const newMessage: Message = {
            id: 2,
            text: 'Incoming',
            type: 0,
            from: 1,
            url: null,
            replyTo: null,
        };

        await act(async () => {
            repo.emitMessage(newMessage);
        });

        await waitFor(() => {
            expect(result.current.messages).toContainEqual(newMessage);
        });
    });
});
