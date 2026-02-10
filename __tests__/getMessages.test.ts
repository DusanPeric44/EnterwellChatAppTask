import { MockChatRepository } from "../src/data/repositories/MockChatRepository";
import { Message } from "../src/domain/models/Message";
import { getMessages } from "../src/domain/useCases/getMessages";

it('receives messages through subscription', async () => {
    const repo = new MockChatRepository();

    const received: Message[] = [];

    const { unsubscribe } =
        await getMessages(repo)(msg => {
            received.push(msg);
        });

    repo.emitMessage({
        id: 1,
        text: 'Hello',
        type: 0,
        from: 1,
        url: null,
        replyTo: null,
        reactions: undefined,
    });

    expect(received).toHaveLength(1);

    unsubscribe();
});
