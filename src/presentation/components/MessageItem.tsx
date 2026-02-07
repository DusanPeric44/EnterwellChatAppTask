import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Surface } from 'react-native-paper';
import { Message } from '../../domain/models/Message';
import { ReactionType } from '../../domain/enums/ReactionType';


interface MessageItemProps {
    item: Message;
    replyMessage?: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ item, replyMessage }) => {
    const isOwn = item.from === 0;

    const reactionIcons: Record<ReactionType, string> = {
        [ReactionType.Like]: '👍',
        [ReactionType.Love]: '❤️',
        [ReactionType.Laugh]: '😂',
        [ReactionType.Surprise]: '😮',
        [ReactionType.Sad]: '😢',
        [ReactionType.Angry]: '😡',
    };

    return (
        <View style={styles.messageContainer}>
            <Surface
                style={[
                    styles.messageBubble,
                    isOwn ? styles.ownMessage : styles.otherMessage,
                ]}
                elevation={1}
            >
                {replyMessage && (
                    <View style={styles.replyContext}>
                        <View style={styles.replyBar} />
                        <View style={styles.replyContent}>
                            <Text style={styles.replySender}>
                                {replyMessage.from === 0 ? 'You' : 'Contact'}
                            </Text>
                            <Text style={styles.replyText} numberOfLines={1}>
                                {replyMessage.type === 1
                                    ? '[Photo]'
                                    : replyMessage.text}
                            </Text>
                        </View>
                    </View>
                )}

                {item.type === 0 && item.text && (
                    <Text style={styles.messageText}>{item.text}</Text>
                )}

                {item.type === 1 && item.url && (
                    <Image
                        source={{ uri: item.url }}
                        style={styles.messageImage}
                    />
                )}

                {
                    <View style={styles.reactionsContainer}>
                        <View key={item.reactions.value} style={styles.reactionPill}>
                            <Text style={styles.reactionEmoji}>
                                {reactionIcons[item.reactions.value] ??
                                    reactionIcons[ReactionType.Like]}
                            </Text>
                            {item.reactions.count > 1 && (
                                <Text style={styles.reactionCount}>
                                    {item.reactions.count}
                                </Text>
                            )}
                        </View>
                    </View>
                }
            </Surface>
        </View>
    );
};

const styles = StyleSheet.create({
    messageContainer: {
        marginVertical: 4,
        alignItems: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        borderRadius: 8,
        padding: 8,
        position: 'relative',
    },
    ownMessage: {
        backgroundColor: '#DCF8C6',
        alignSelf: 'flex-end',
        marginLeft: 'auto',
    },
    otherMessage: {
        backgroundColor: '#FFFFFF',
        alignSelf: 'flex-start',
    },
    replyContext: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderRadius: 4,
        padding: 6,
        marginBottom: 6,
    },
    replyBar: {
        width: 3,
        backgroundColor: '#128C7E',
        borderRadius: 2,
        marginRight: 6,
    },
    replyContent: {
        flex: 1,
    },
    replySender: {
        fontSize: 12,
        fontWeight: '600',
        color: '#128C7E',
        marginBottom: 2,
    },
    replyText: {
        fontSize: 12,
        color: '#666',
    },
    messageText: {
        fontSize: 15,
        color: '#000',
        lineHeight: 20,
    },
    messageImage: {
        width: 200,
        height: 200,
        borderRadius: 8,
        marginTop: 4,
    },
    reactionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        marginTop: 4,
        position: 'absolute',
        bottom: -12,
        right: 8,
    },
    reactionPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        gap: 2,
    },
    reactionEmoji: {
        fontSize: 14,
    },
    reactionCount: {
        fontSize: 11,
        color: '#666',
    },
});

export default MessageItem;
