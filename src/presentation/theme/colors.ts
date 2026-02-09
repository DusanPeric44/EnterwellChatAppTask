export const lightTheme = {
    primary: '#075E54',
    background: '#FFFFFF',
    statusBarBackground: '#075E54',
    surface: '#F9FAFB',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    error: '#DC2626',
    shadowColor: '#000',

    white: '#FFFFFF',
    black: '#000000',

    chat: {
        background: '#ECE5DD',
        header: '#075E54',
        inputContainer: '#F0F0F0',
        inputBorder: '#E0E0E0',
        sendBtn: '#25D366',
        replyBar: '#128C7E',
        replyPreview: '#F5F5F5',
        replyContext: 'rgba(0, 0, 0, 0.05)',
        overlay: 'rgba(0, 0, 0, 0.3)',
    },

    message: {
        incoming: '#FFFFFF',
        outgoing: '#DCF8C6',
        text: '#000000',
        meta: '#666666',
    },
};

export const darkTheme = {
    primary: '#1f2c34',
    background: '#0b141a',
    statusBarBackground: '#0b141a',
    surface: '#1f2c34',
    textPrimary: '#e9edef',
    textSecondary: '#8696a0',
    border: '#2a3942',
    error: '#ef5350',
    shadowColor: '#000',

    white: '#FFFFFF',
    black: '#000000',

    chat: {
        background: '#0b141a',
        header: '#1f2c34',
        inputContainer: '#1f2c34',
        inputBorder: '#2a3942',
        sendBtn: '#00a884',
        replyBar: '#00a884',
        replyPreview: '#1f2c34',
        replyContext: 'rgba(255, 255, 255, 0.05)',
        overlay: 'rgba(0, 0, 0, 0.7)',
    },

    message: {
        incoming: '#1f2c34',
        outgoing: '#005c4b',
        text: '#e9edef',
        meta: '#8696a0',
    },
};

export type Theme = typeof lightTheme;