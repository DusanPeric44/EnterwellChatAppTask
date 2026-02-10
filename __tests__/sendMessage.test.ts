import { MockChatRepository } from "../src/data/repositories/MockChatRepository";
import { Message } from "../src/domain/models/Message";

it('stores and emits sent message', async () => {
    const repo = new MockChatRepository();

    const message: Message = {
        id: 1,
        text: 'Test',
        type: 0,
        from: 0,
        url: null,
        replyTo: null,
        reactions: undefined,
    };

    await repo.sendMessage(message);

    expect(repo.messages).toContainEqual(message);
});
