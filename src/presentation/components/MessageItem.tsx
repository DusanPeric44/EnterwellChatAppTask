import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Surface } from 'react-native-paper';
import { Message } from '../../domain/models/Message';
import { ReactionType } from '../../domain/enums/ReactionType';
import { reactionIcons } from '../constants/reactionIcons';
import { colors } from '../theme/colors';


interface MessageItemProps {
    item: Message;
    replyMessage?: Message;
    groupName: string;
    scrollToIndex: (item: Message) => void;
    onLongPress?: (message: Message) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ item, replyMessage, groupName, scrollToIndex, onLongPress }) => {
    const isOwn = item.from === 0;

    return (
        <TouchableOpacity
            style={styles.messageContainer}
            onLongPress={() => onLongPress?.(item)}
            activeOpacity={0.9}
        >
            <View style={styles.messageContainer}>
                <Surface
                    style={[
                        styles.messageBubble,
                        isOwn ? styles.ownMessage : styles.otherMessage,
                    ]}
                    elevation={1}
                >
                    <TouchableOpacity
                        style={styles.replyButton}
                        onPress={() => scrollToIndex(item)}
                        activeOpacity={0.7}
                    >
                        {replyMessage && (
                            <View style={styles.replyContext}>
                                <View style={styles.replyBar} />
                                <View style={styles.replyContent}>
                                    <Text style={styles.replySender} numberOfLines={1}>
                                        {replyMessage.from === 0 ? 'You' : groupName}
                                    </Text>
                                    <Text style={styles.replyText} numberOfLines={1}>
                                        {replyMessage.type === 1
                                            ? '[Photo]'
                                            : replyMessage.text}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>


                    {item.type === 0 && item.text && (
                        <Text style={styles.messageText}>{item.text}</Text>
                    )}

                    {item.type === 1 && item.url && (
                        <Image
                            source={{ uri: item.url }}
                            style={styles.messageImage}
                        />
                    )}

                    {item.reactions && (
                        <View style={[styles.reactionsContainer,
                        isOwn ? { right: 5 } : { left: 5 },
                        ]}>
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
                    )}
                </Surface>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    messageContainer: {
        flex: 1,
        width: '100%',
        marginVertical: 8,
        alignItems: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        minWidth: '15%',
        borderRadius: 8,
        padding: 8,
        position: 'relative',
    },
    ownMessage: {
        backgroundColor: colors.message.outgoing,
        alignSelf: 'flex-end',
        marginLeft: 'auto',
    },
    otherMessage: {
        backgroundColor: colors.message.incoming,
        alignSelf: 'flex-start',
    },
    replyButton: {
        flex: 1,
    },
    replyContext: {
        flexDirection: 'row',
        backgroundColor: colors.chat.replyContext,
        borderRadius: 4,
        padding: 6,
        marginBottom: 6,
        minWidth: '30%',
    },
    replyBar: {
        width: 3,
        backgroundColor: colors.chat.replyBar,
        borderRadius: 2,
        marginRight: 6,
    },
    replyContent: {
        flex: 1,
    },
    replySender: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.chat.replyBar,
        marginBottom: 2,
    },
    replyText: {
        fontSize: 12,
        color: colors.message.meta,
    },
    messageText: {
        fontSize: 15,
        color: colors.message.text,
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
        bottom: -20
    },
    reactionPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: 12,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderWidth: 1,
        borderColor: colors.chat.inputBorder,
        gap: 2,
    },
    reactionEmoji: {
        fontSize: 14,
    },
    reactionCount: {
        fontSize: 11,
        color: colors.message.meta,
    },
});

export default React.memo(MessageItem);
