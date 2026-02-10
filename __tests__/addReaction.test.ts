import { addReaction } from '../src/domain/useCases/addReaction';
import { MockChatRepository } from '../src/data/repositories/MockChatRepository';
import { Message } from '../src/domain/models/Message';
import { ReactionType } from '../src/domain/enums/ReactionType';

describe('addReaction', () => {
    let mockRepository: MockChatRepository;

    beforeEach(() => {
        mockRepository = new MockChatRepository();
    });

    it('should add a new reaction if none exists', async () => {
        const message: Message = {
            id: 1,
            type: 0,
            from: 0,
            text: 'Hello',
            url: null,
            replyTo: null,
        };
        mockRepository = new MockChatRepository([message]);

        const reaction = ReactionType.Love;

        const useCase = addReaction(mockRepository);
        const result = await useCase(message, reaction);

        expect(result).toBeDefined();
        expect(result?.reactions).toEqual({ value: reaction, count: 1 });

        const storedMessage = await mockRepository.getMessageById(message.id);
        expect(storedMessage?.reactions).toEqual({ value: reaction, count: 1 });
    });

    it('should increment count if same reaction exists', async () => {
        const reaction = ReactionType.Like;
        const message: Message = {
            id: 1,
            type: 0,
            from: 0,
            text: 'Hello',
            url: null,
            replyTo: null,
            reactions: { value: reaction, count: 5 },
        };
        mockRepository = new MockChatRepository([message]);

        const useCase = addReaction(mockRepository);
        const result = await useCase(message, reaction);

        expect(result?.reactions).toEqual({ value: reaction, count: 6 });

        const storedMessage = await mockRepository.getMessageById(message.id);
        expect(storedMessage?.reactions).toEqual({ value: reaction, count: 6 });
    });

    it('should replace reaction and reset count if different reaction exists', async () => {
        const oldReaction = ReactionType.Like;
        const newReaction = ReactionType.Angry;
        const message: Message = {
            id: 1,
            type: 0,
            from: 0,
            text: 'Hello',
            url: null,
            replyTo: null,
            reactions: { value: oldReaction, count: 5 },
        };
        mockRepository = new MockChatRepository([message]);

        const useCase = addReaction(mockRepository);
        const result = await useCase(message, newReaction);

        expect(result?.reactions).toEqual({ value: newReaction, count: 1 });

        const storedMessage = await mockRepository.getMessageById(message.id);
        expect(storedMessage?.reactions).toEqual({ value: newReaction, count: 1 });
    });
});
