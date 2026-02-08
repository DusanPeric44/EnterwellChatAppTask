import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    type TextInput as TextInputType,
    NativeSyntheticEvent,
    NativeScrollEvent,
    TouchableOpacity
} from 'react-native';
import { TextInput, IconButton, Text, Surface, MD3Colors } from 'react-native-paper';
import useChatViewModel from '../viewmodels/useChatViewModel';
import { RootStackParamList } from '../../types';
import MessageItem from '../components/MessageItem';
import { Message } from '../../domain/models/Message';
import { ReactionType } from '../../domain/enums/ReactionType';
import ReactionBar from '../components/ReactionBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useBehaviour } from '../hooks/useBehaviour';
import ReplyPreview from '../components/ReplyPreview';
import Clipboard from '@react-native-clipboard/clipboard';

type ChatScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Chat'>
type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const ChatScreen: React.FC<Props> = ({ route }) => {
    const { groupName, groupAvatar } = route.params;
    const navigation = useNavigation<ChatScreenNavigationProp>();
    const insets = useSafeAreaInsets();
    const behaviour = useBehaviour();
    const { messages, sendMessage, onReact } = useChatViewModel();
    const [inputText, setInputText] = useState('');
    const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);

    const [showScrollToBottom, setShowScrollToBottom] = useState(false);
    const isNearBottomRef = useRef(true);
    const inputTextRef = useRef<TextInputType>(null);
    const flatListRef = useRef<FlatList>(null);
    const previousMessageCountRef = useRef(0);

    useEffect(() => {
        const currentCount = messages.length;
        const previousCount = previousMessageCountRef.current;

        if (currentCount > previousCount) {
            if (isNearBottomRef.current) {
                scrollToBottom();
            } else {
                setShowScrollToBottom(true);
            }
        }

        previousMessageCountRef.current = currentCount;
    }, [messages]);

    const handleSend = () => {
        if (inputText.trim()) {
            sendMessage(inputText.trim(), replyingTo?.id || undefined);
            setInputText('');
            setReplyingTo(null);
        }

        scrollToBottom();

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
        inputTextRef?.current?.focus();
        setSelectedMessage(null);
    };

    const handleCopy = () => {
        if (selectedMessage) {
            const message = messages.find((m) => m.id === selectedMessage);
            if (message) {
                Clipboard.setString(message?.text || message?.url || '');
            }
        }
    };

    const scrollToIndex = (item: Message) => {
        if (!item.replyTo) {
            return;
        }
        const index = messages.findIndex((m) => m.id === item.replyTo);
        if (index === -1) {
            return;
        }
        flatListRef.current?.scrollToIndex({
            animated: true,
            index,
            viewPosition: 0.5
        });
    };

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
        const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;
        const isNearBottom = distanceFromBottom < 100;

        isNearBottomRef.current = isNearBottom;

        if (isNearBottom) {
            setShowScrollToBottom(false);
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
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
                        ref={flatListRef}
                        data={messages.slice()}
                        renderItem={({ item }) => (
                            <MessageItem
                                item={item}
                                scrollToIndex={scrollToIndex}
                                replyMessage={messages.find((m) => m.id === item.replyTo)}
                                groupName={groupName}
                                onLongPress={handleLongPress} />
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        style={styles.messagesList}
                        contentContainerStyle={styles.messagesContent}
                        // getItemLayout={(_, index) => (
                        //     { length: 100, offset: 100 * index, index }
                        // )}
                        onScroll={onScroll}
                        scrollEventThrottle={16}
                        maintainVisibleContentPosition={{
                            minIndexForVisible: 0,
                        }}
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
                            onCopy={handleCopy}
                        />
                    )}

                    {showScrollToBottom && (
                        <TouchableOpacity
                            style={styles.scrollToBottomButton}
                            onPress={scrollToBottom}
                        >
                            <Text style={styles.buttonText}>↓</Text>
                        </TouchableOpacity>
                    )}

                    {/* Reply Preview */}
                    {replyingTo && (
                        <ReplyPreview
                            message={replyingTo}
                            groupName={groupName}
                            onCancel={() => setReplyingTo(null)}
                        />
                    )}

                    <Surface style={styles.inputContainer} elevation={3}>
                        <IconButton icon="emoticon-happy-outline" size={24} />
                        <TextInput
                            ref={inputTextRef}
                            style={styles.input}
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Message"
                            mode="outlined"
                            maxLength={1000}
                            dense
                            outlineStyle={styles.inputOutline}
                        />
                        {inputText.trim() ? (
                            <IconButton
                                icon="send"
                                size={24}
                                iconColor="#25D366"
                                onPress={handleSend}
                            />
                        ) : (
                            <IconButton
                                icon="send"
                                size={24}
                                style={styles.inactiveSend}
                            />
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
    inactiveSend: {
        opacity: 0.5,
    },
    scrollToBottomButton: {
        position: 'absolute',
        bottom: 80,
        alignSelf: 'center',
        backgroundColor: '#075E54',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default ChatScreen;
