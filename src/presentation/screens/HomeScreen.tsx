import React, { useMemo } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Image,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, Surface } from 'react-native-paper';

import { RootStackParamList } from '../../types';
import { useTheme } from '../theme/ThemeContext';
import { Theme } from '../theme/colors';
import { MOCK_CHATS } from '../constants/mockChats';
import { ChatPreview } from '../constants/mockChats';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const handleChatPress = (chat: ChatPreview) => {
        navigation.navigate('Chat', {
            groupName: chat.name,
            groupAvatar: chat.avatar
        });
    };

    const renderItem = ({ item }: { item: ChatPreview }) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => handleChatPress(item)}
            activeOpacity={0.7}
        >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                    <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                </View>
                <View style={styles.chatFooter}>
                    <Text style={styles.lastMessage} numberOfLines={1}>
                        {item.lastMessage}
                    </Text>
                    {item.unreadCount ? (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>{item.unreadCount}</Text>
                        </View>
                    ) : null}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={theme.primary} barStyle="light-content" />

            <Surface style={styles.header} elevation={2}>
                <Text style={styles.headerTitle}>Enterwell Chat</Text>
            </Surface>

            <FlatList
                data={MOCK_CHATS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={<View style={styles.separator} />}
            />
        </SafeAreaView>
    );
};

const createStyles = (colors: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        backgroundColor: colors.primary,
        paddingVertical: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        color: colors.white,
        fontSize: 20,
        fontWeight: 'bold',
    },
    listContent: {
        paddingVertical: 8,
    },
    chatItem: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.border,
    },
    chatInfo: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        flex: 1,
    },
    time: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    chatFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    lastMessage: {
        fontSize: 14,
        color: colors.textSecondary,
        flex: 1,
        marginRight: 8,
    },
    unreadBadge: {
        backgroundColor: colors.chat.sendBtn,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    unreadText: {
        color: colors.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.border,
        marginLeft: 82,
    },
});

export default HomeScreen;
