export type ChatError =
    | { type: 'network' }
    | { type: 'unauthorized' }
    | { type: 'not_found' }
    | { type: 'unknown'; message?: string };