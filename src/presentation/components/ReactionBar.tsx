import React, { useEffect, useMemo } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Pressable,
    Animated,
} from 'react-native';
import { Surface, IconButton, Text } from 'react-native-paper';
import { ReactionType } from '../../domain/enums/ReactionType';
import { reactionIcons } from '../constants/reactionIcons';
import { useTheme } from '../theme/ThemeContext';
import { Theme } from '../theme/colors';

interface ReactionBarProps {
    onReact: (emoji: ReactionType) => void;
    onReply: () => void;
    onClose: () => void;
    onCopy: () => void;
    visible?: boolean;
}

const ReactionBar: React.FC<ReactionBarProps> = ({
    onReact,
    onReply,
    onClose,
    onCopy,
    visible = true,
}) => {
    const [scaleAnim] = React.useState(new Animated.Value(0));
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const reactions = Object.keys(ReactionType).map(label => ({
        label,
        value: ReactionType[label as keyof typeof ReactionType],
    }));

    useEffect(() => {
        if (visible) {
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 80,
                friction: 8,
                useNativeDriver: true,
            }).start();
        } else {
            scaleAnim.setValue(0);
        }
    }, [visible, scaleAnim]);

    const handleReaction = (emoji: ReactionType) => {
        onReact(emoji);
        onClose();
    };

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            onRequestClose={onClose}
            animationType="none"
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <View style={styles.container}>
                    <Animated.View
                        style={[
                            styles.animatedContainer,
                            {
                                transform: [{ scale: scaleAnim }],
                            },
                        ]}
                    >
                        {/* Reactions Bar */}
                        <Surface style={styles.reactionsBar} elevation={4}>
                            {reactions.map(({ value: emoji }) => {
                                const emojiStr = (reactionIcons[emoji])?.trim();
                                if (!emojiStr) return null;
                                return (
                                    <TouchableOpacity
                                        key={emoji}
                                        style={styles.reactionButton}
                                        onPress={() => handleReaction(emoji)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.reactionEmoji}>{emojiStr}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </Surface>

                        {/* Action Buttons */}
                        <Surface style={styles.actionsBar} elevation={4}>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => {
                                    onReply();
                                    onClose();
                                }}
                                activeOpacity={0.7}
                            >
                                <IconButton
                                    icon="reply"
                                    size={20}
                                    style={styles.actionIcon}
                                />
                                <Text style={styles.actionText}>Reply</Text>
                            </TouchableOpacity>

                            <View style={styles.actionDivider} />

                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={onCopy}
                                activeOpacity={0.7}
                            >
                                <IconButton
                                    icon="content-copy"
                                    size={20}
                                    style={styles.actionIcon}
                                />
                                <Text style={styles.actionText}>Copy</Text>
                            </TouchableOpacity>
                        </Surface>
                    </Animated.View>
                </View>
            </Pressable>
        </Modal>
    );
};

const createStyles = (colors: Theme) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: colors.chat.overlay,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    animatedContainer: {
        alignItems: 'center',
    },
    reactionsBar: {
        flexDirection: 'row',
        backgroundColor: colors.background,
        borderRadius: 30,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 12,
        gap: 12,
        width: '75%',
        justifyContent: 'space-between',
    },
    reactionButton: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
    },
    reactionEmoji: {
        fontSize: 28,
    },
    actionsBar: {
        backgroundColor: colors.background,
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 4,
        minWidth: 280,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        gap: 12,
    },
    actionIcon: {
        margin: 0,
    },
    actionText: {
        fontSize: 15,
        color: colors.textPrimary,
        flex: 1,
    },
    actionDivider: {
        height: 1,
        backgroundColor: colors.border,
        marginHorizontal: 12,
    },
});

export default ReactionBar;