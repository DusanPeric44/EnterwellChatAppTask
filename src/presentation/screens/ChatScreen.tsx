import React, { useState } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { TextInput, IconButton, Text, Surface, MD3Colors } from 'react-native-paper';
import { Message } from '../../domain/models/Message';
import useChatViewModel from '../viewmodels/useChatViewModel';
import { RootStackParamList } from '../../types';
import { SafeAreaView } from 'react-native-safe-area-context';

const REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '👏'];

const ChatScreen: React.FC<RootStackParamList['Chat']> = ({ groupName, groupAvatar }) => {
    const { messages, sendMessage } = useChatViewModel();
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (inputText.trim()) {
            sendMessage(inputText.trim());
            setInputText('');
        }
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isOwn = item.from === 0;
        const replyMessage =
            item.replyTo !== null
                ? messages.find((m) => m.id === item.replyTo)
                : undefined;

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

                    {Array.isArray(item.reactions) && item.reactions.length > 0 && (
                        <View style={styles.reactionsContainer}>
                            {item.reactions.map((reaction, index) => (
                                <View key={index} style={styles.reactionPill}>
                                    <Text style={styles.reactionEmoji}>
                                        {REACTION_EMOJIS[reaction.value] ??
                                            REACTION_EMOJIS[0]}
                                    </Text>
                                    {reaction.count > 1 && (
                                        <Text style={styles.reactionCount}>
                                            {reaction.count}
                                        </Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}
                </Surface>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                {/* Header */}
                <Surface style={styles.header} elevation={2}>
                    <IconButton iconColor={MD3Colors.primary100} icon="arrow-left" size={24} onPress={() => { }} />
                    {groupAvatar && (
                        <Image source={{ uri: groupAvatar }} style={styles.avatar} />
                    )}
                    <View style={styles.headerInfo}>
                        <Text style={styles.groupName}>{groupName}</Text>
                    </View>
                    <IconButton iconColor={MD3Colors.primary100} icon="phone" size={24} onPress={() => { }} />
                    <IconButton iconColor={MD3Colors.primary100} icon="dots-vertical" size={24} onPress={() => { }} />
                </Surface>

                <FlatList
                    data={messages.slice().reverse()}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id.toString()}
                    style={styles.messagesList}
                    contentContainerStyle={styles.messagesContent}
                    inverted={true}
                />
                <Surface style={styles.inputContainer} elevation={3}>
                    <IconButton icon="emoticon-happy-outline" size={24} />
                    <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Message"
                        mode="outlined"
                        multiline
                        maxLength={1000}
                        dense
                        outlineStyle={styles.inputOutline}
                    />
                    <IconButton icon="attachment" size={24} />
                    <IconButton icon="camera" size={24} />
                    {inputText.trim() ? (
                        <IconButton
                            icon="send"
                            size={24}
                            iconColor="#25D366"
                            onPress={handleSend}
                        />
                    ) : (
                        <IconButton icon="microphone" size={24} iconColor="#25D366" />
                    )}
                </Surface>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ECE5DD',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 4,
        paddingVertical: 8,
        backgroundColor: '#075E54',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    headerInfo: {
        flex: 1,
    },
    groupName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    messagesList: {
        flex: 1,
    },
    messagesContent: {
        paddingHorizontal: 8,
        paddingVertical: 12,
    },
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#F0F0F0',
    },
    input: {
        flex: 1,
        maxHeight: 100,
        backgroundColor: '#FFFFFF',
    },
    inputOutline: {
        borderRadius: 20,
        borderColor: '#E0E0E0',
    },
});

export default ChatScreen;
