import { ReactionType } from "../enums/ReactionType";

export interface Message {
    id: number;
    type: 0 | 1;
    from: 0 | 1;
    text: string | null;
    url: string | null;
    replyTo: number | null;
    reactions?: Reaction;
}

export interface Reaction {
    value: ReactionType;
    count: number;
}