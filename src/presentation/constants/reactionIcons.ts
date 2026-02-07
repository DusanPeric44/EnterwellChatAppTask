import { ReactionType } from '../../domain/enums/ReactionType';

export const reactionIcons: Record<ReactionType, string> = {
    [ReactionType.Like]: '👍',
    [ReactionType.Love]: '❤️',
    [ReactionType.Laugh]: '😂',
    [ReactionType.Surprise]: '😮',
    [ReactionType.Sad]: '😢',
    [ReactionType.Angry]: '😡',
};