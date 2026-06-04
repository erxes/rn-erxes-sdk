import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React from 'react';
import { messengerTheme } from '../../theme';

// Lightweight emoji panel — the RN counterpart of the web messenger's emoji
// popover. No external dependency: a scrollable grid of frequently-used emojis
// that append to the composer text on tap.
const EMOJIS = [
  '😀',
  '😁',
  '😂',
  '🤣',
  '😊',
  '😇',
  '🙂',
  '😉',
  '😍',
  '😘',
  '😋',
  '😎',
  '🤩',
  '🥳',
  '🤗',
  '🤔',
  '😅',
  '😴',
  '😢',
  '😭',
  '😡',
  '👍',
  '👎',
  '👏',
  '🙏',
  '💪',
  '🔥',
  '✨',
  '🎉',
  '❤️',
  '💯',
  '✅',
  '👋',
  '🙌',
  '👌',
  '😬',
  '😱',
  '😏',
  '😜',
  '🤝',
];

type Props = {
  onSelect: (emoji: string) => void;
};

const EmojiPicker = ({ onSelect }: Props) => {
  return (
    <View style={styles.panel}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.grid}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {EMOJIS.map((emoji) => (
          <TouchableOpacity
            key={emoji}
            style={styles.cell}
            onPress={() => onSelect(emoji)}
          >
            <Text style={styles.emoji}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default EmojiPicker;

const styles = StyleSheet.create({
  panel: {
    backgroundColor: messengerTheme.colors.surface,
    borderRadius: messengerTheme.radius.lg,
    marginBottom: messengerTheme.spacing.sm,
    paddingVertical: messengerTheme.spacing.sm,
    ...messengerTheme.shadow.card,
  },
  scroll: {
    maxHeight: 168,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: messengerTheme.spacing.sm,
  },
  cell: {
    width: '12.5%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 22,
  },
});
