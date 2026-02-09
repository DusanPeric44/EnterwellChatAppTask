import { Button, StyleSheet, Text } from 'react-native';
import React, { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';
import { Theme } from '../theme/colors';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>

const HomeScreen = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const goToChat = () => {
        navigation.navigate('Chat', { groupName: 'Marko Marković', groupAvatar: 'https://picsum.photos/200' })
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>HomeScreen</Text>
            <Button title="Go to Chat" onPress={goToChat} />
        </SafeAreaView>
    );
}

export default HomeScreen;

const createStyles = (colors: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    text: {
        color: colors.textPrimary,
        marginBottom: 20,
    }
});
