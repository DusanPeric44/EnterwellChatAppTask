import React, { useState } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
} from 'react-native';
import { TextInput, IconButton, Text, Surface, MD3Colors } from 'react-native-paper';
import useChatViewModel from '../viewmodels/useChatViewModel';
import { RootStackParamList } from '../../types';
import MessageItem from '../components/MessageItem';
import { Message } from '../../domain/models/Message';
import { ReactionType } from '../../domain/enums/ReactionType';
import ReactionBar from '../components/ReactionBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useBehaviour } from '../hooks/useBehaviour';
import ReplyPreview from '../components/ReplyPreview';

type ChatScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Chat'>

const ChatScreen: React.FC<RootStackParamList['Chat']> = ({ groupName, groupAvatar }) => {
    const navigation = useNavigation<ChatScreenNavigationProp>();
    const insets = useSafeAreaInsets();
    const behaviour = useBehaviour();
    const { messages, sendMessage, onReact } = useChatViewModel();
    const [inputText, setInputText] = useState('');
    const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);

    const handleSend = () => {
        if (inputText.trim()) {
            sendMessage(inputText.trim(), replyingTo?.id || undefined);
            setInputText('');
            setReplyingTo(null);
        }
    };

    const handleLongPress = (message: Message) => {
        setSelectedMessage(message.id);
    };

    const handleReaction = (emoji: ReactionType) => {
        if (selectedMessage) {
            onReact(selectedMessage, emoji);
            setSelectedMessage(null);
        }
    };

    const handleReply = (message: Message) => {
        setReplyingTo(message);
        setSelectedMessage(null);
    };

    return (

        <KeyboardAvoidingView
            style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
            behavior={behaviour}
        >
            <View
                style={styles.container}>
                <View style={styles.inner}>

                    {/* Header */}
                    <Surface style={styles.header} elevation={2}>
                        <IconButton iconColor={MD3Colors.primary100} icon="arrow-left" size={24} onPress={() => {
                            navigation.pop();
                        }} />
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
                        renderItem={({ item }) => (
                            <MessageItem
                                item={item}
                                replyMessage={messages.find((m) => m.id === item.replyTo)}
                                onLongPress={handleLongPress} />
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        style={styles.messagesList}
                        contentContainerStyle={styles.messagesContent}
                        inverted={true}
                    />

                    {/* Reaction Bar */}
                    {selectedMessage && (
                        <ReactionBar
                            onReact={handleReaction}
                            onReply={() => {
                                const message = messages.find((m) => m.id === selectedMessage);
                                if (message) handleReply(message);
                            }}
                            onClose={() => setSelectedMessage(null)}
                        />
                    )}

                    {/* Reply Preview */}
                    {replyingTo && (
                        <ReplyPreview
                            message={replyingTo}
                            onCancel={() => setReplyingTo(null)}
                        />
                    )}

                    <Surface style={styles.inputContainer} elevation={3}>
                        <IconButton icon="emoticon-happy-outline" size={24} />
                        <TextInput
                            style={styles.input}
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Message"
                            mode="outlined"
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
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ECE5DD',
    },
    inner: {
        flex: 1,
        justifyContent: 'flex-end',
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
