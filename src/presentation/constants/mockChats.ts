export interface ChatPreview {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unreadCount?: number;
}

export const MOCK_CHATS: ChatPreview[] = [
    {
        id: '1',
        name: 'Marko Marković',
        avatar: 'https://i.pravatar.cc/150?u=1',
        lastMessage: 'Cao, kako si?',
        time: '10:30 AM',
        unreadCount: 2
    },
    {
        id: '2',
        name: 'Ana Anić',
        avatar: 'https://i.pravatar.cc/150?u=2',
        lastMessage: 'Vidimo se sutra!',
        time: 'Yesterday',
    },
    {
        id: '3',
        name: 'Ivan Ivić',
        avatar: 'https://i.pravatar.cc/150?u=3',
        lastMessage: 'Mozes mi poslati fajl?',
        time: 'Yesterday',
    },
    {
        id: '4',
        name: 'Petra Perić',
        avatar: 'https://i.pravatar.cc/150?u=4',
        lastMessage: 'Hvala!',
        time: 'Mon',
    },
    {
        id: '5',
        name: 'Enterwell Team',
        avatar: 'https://i.pravatar.cc/150?u=5',
        lastMessage: 'Sutra se u 10:00 ujutro održava sastanak',
        time: 'Mon',
    }
];