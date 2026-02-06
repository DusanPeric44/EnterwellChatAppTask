import { Button, StyleSheet, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>

const HomeScreen = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();

    const goToChat = () => {
        navigation.navigate('Chat', { groupName: 'Enterwell Group', groupAvatar: 'https://picsum.photos/200' })
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text>HomeScreen</Text>
            <Button title="Go to Chat" onPress={goToChat} />
        </SafeAreaView>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
