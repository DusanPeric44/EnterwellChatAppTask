import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    type TextInput as TextInputType,
    NativeSyntheticEvent,
    NativeScrollEvent,
    TouchableOpacity,
    Keyboard,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { TextInput, IconButton, Text, Surface } from 'react-native-paper';
import useChatViewModel from '../viewmodels/useChatViewModel';
import { RootStackParamList } from '../../types';
import MessageItem from '../components/MessageItem';
import { Message } from '../../domain/models/Message';
import { ReactionType } from '../../domain/enums/ReactionType';
import ReactionBar from '../components/ReactionBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useBehaviour } from '../hooks/useBehaviour';
import ReplyPreview from '../components/ReplyPreview';
import Clipboard from '@react-native-clipboard/clipboard';
import { emojiData, EmojiPicker } from '@hiraku-ai/react-native-emoji-picker';
import { useTheme } from '../theme/ThemeContext';
import { Theme } from '../theme/colors';

type ChatScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Chat'>
type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const ChatScreen: React.FC<Props> = ({ route }) => {
    const { groupName, groupAvatar } = route.params;
    const navigation = useNavigation<ChatScreenNavigationProp>();
    const behaviour = useBehaviour();
    const { messages, sendMessage, onReact, loading, error } = useChatViewModel();
    const [inputText, setInputText] = useState('');
    const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

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

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setEmojiPickerVisible(false);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
        };
    }, []);

    const toggleEmojiPicker = () => {
        if (!emojiPickerVisible) {
            Keyboard.dismiss();
        }
        setEmojiPickerVisible(!emojiPickerVisible);
    };

    const handleSend = () => {
        if (inputText.trim()) {
            sendMessage(inputText.trim(), replyingTo?.id || undefined);
            setTimeout(() => setInputText(''), 50);
            setReplyingTo(null);
            setEmojiPickerVisible(false);
        }

        scrollToBottom();
    };

    const handleLongPress = useCallback((message: Message) => {
        setSelectedMessage(message.id);
    }, []);

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
            setSelectedMessage(null);
        }
    };

    const scrollToIndex = useCallback((item: Message) => {
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
    }, [messages]);

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
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.statusBarBackground }}>
            <StatusBar backgroundColor={theme.statusBarBackground} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={behaviour}
            >
                <View
                    style={styles.container}>
                    <View style={styles.inner}>

                        {/* Header */}
                        <Surface style={styles.header} elevation={2}>
                            <IconButton iconColor={theme.white} icon="arrow-left" size={24} onPress={() => {
                                navigation.pop();
                            }} />
                            {groupAvatar && (
                                <Image source={{ uri: groupAvatar }} style={styles.avatar} />
                            )}
                            <View style={styles.headerInfo}>
                                <Text style={styles.groupName}>{groupName}</Text>
                            </View>
                            <IconButton iconColor={theme.white} icon="phone" size={24} onPress={() => { }} />
                            <IconButton iconColor={theme.white} icon="dots-vertical" size={24} onPress={() => { }} />
                        </Surface>

                        <View style={styles.contentContainer}>
                            {loading ? (
                                <ActivityIndicator size="large" color={theme.primary} />
                            ) : (
                                <>
                                    {error ? (
                                        <Text style={styles.errorText}>Error: {error}</Text>
                                    ) : (
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
                                            onScroll={onScroll}
                                            scrollEventThrottle={16}
                                            maintainVisibleContentPosition={{
                                                minIndexForVisible: 0,
                                            }}
                                        />
                                    )}
                                </>
                            )}
                        </View>

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
                            <IconButton
                                icon="emoticon-happy-outline"
                                size={24}
                                onPress={toggleEmojiPicker}
                            />
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
                                showSoftInputOnFocus={true}
                            />
                            {inputText.trim() ? (
                                <IconButton
                                    icon="send"
                                    size={24}
                                    iconColor={theme.chat.sendBtn}
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

                        {emojiPickerVisible && (
                            <EmojiPicker
                                tabStyle={styles.emojiPickerBackground}
                                activeTabStyle={styles.emojiPickerSelected}
                                containerStyle={styles.emojiPickerBackground}
                                searchBarStyle={styles.emojiPickerSelected}
                                onClose={() => setEmojiPickerVisible(false)}
                                onEmojiSelect={(emoji) => {
                                    setInputText(inputText + emoji);
                                }}
                                emojis={emojiData}
                                tabIconColors={{
                                    background: theme.background
                                }}
                            />
                        )
                        }
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const createStyles = (colors: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.chat.background,
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
        backgroundColor: colors.chat.header,
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
        color: colors.white,
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
        backgroundColor: colors.chat.inputContainer,
    },
    input: {
        flex: 1,
        maxHeight: 100,
        backgroundColor: colors.background,
    },
    inputOutline: {
        borderRadius: 20,
        borderColor: colors.chat.inputBorder,
    },
    inactiveSend: {
        opacity: 0.5,
    },
    scrollToBottomButton: {
        position: 'absolute',
        bottom: 80,
        alignSelf: 'center',
        backgroundColor: colors.chat.header,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: colors.white,
        fontSize: 24,
        fontWeight: 'bold',
    },
    emojiPickerBackground: {
        backgroundColor: colors.background
    },
    emojiPickerSelected: {
        backgroundColor: colors.chat.inputContainer,
    },
    errorText: {
        color: colors.error,
        fontSize: 14,
        fontWeight: '400',
        marginBottom: 8,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    }
});

export default ChatScreen;
