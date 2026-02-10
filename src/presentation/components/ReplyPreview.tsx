import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Text, Surface } from 'react-native-paper';
import { Message } from '../../domain/models/Message';
import { useTheme } from '../theme/ThemeContext';
import { Theme } from '../theme/colors';

interface ReplyPreviewProps {
    message: Message;
    groupName: string;
    onCancel: () => void;
}

const ReplyPreview: React.FC<ReplyPreviewProps> = ({ message, groupName, onCancel }) => {
    const isOwn = message.from === 0;
    const isText = message.type === 0;
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <Surface style={styles.container} elevation={2}>
            <View style={styles.content}>
                <View style={styles.replyBar} />
                <View style={styles.textContent}>
                    <Text style={styles.senderName}>
                        {isOwn ? 'You' : groupName}
                    </Text>
                    <Text style={styles.messageText} numberOfLines={1}>
                        {isText ? message.text : '[Photo]'}
                    </Text>
                </View>
            </View>
            <IconButton
                icon="close"
                size={20}
                onPress={onCancel}
                style={styles.closeButton}
            />
        </Surface>
    );
};

const createStyles = (colors: Theme) => StyleSheet.create({
    container: {
        backgroundColor: colors.chat.replyPreview,
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    replyBar: {
        width: 4,
        height: 40,
        backgroundColor: colors.chat.replyBar,
        borderRadius: 2,
        marginRight: 12,
    },
    textContent: {
        flex: 1,
    },
    senderName: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.chat.replyBar,
        marginBottom: 2,
    },
    messageText: {
        fontSize: 14,
        color: colors.message.meta,
    },
    closeButton: {
        margin: 0,
    },
});

export default ReplyPreview;