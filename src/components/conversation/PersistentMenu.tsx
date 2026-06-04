import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import React from 'react';
import { messengerTheme } from '../../theme';

// RN port of the web messenger PersistentMenu. `persistentMenus` comes from the
// connect messengerData (same backend); each item is { type, text, link }.
// A 'button' item sends its text as a message; a 'link' item opens the URL.
type MenuItem = { type?: string; text: string; link?: string };

type Props = {
  items?: MenuItem[];
  onSendText: (text: string) => void;
};

const PersistentMenu = ({ items, onSendText }: Props) => {
  if (!items || items.length === 0) {
    return null;
  }

  const handlePress = (item: MenuItem) => {
    if (item.type === 'link' && item.link) {
      Linking.openURL(item.link);
    } else {
      onSendText(item.text);
    }
  };

  return (
    <View style={styles.panel}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={`${item.text}-${index}`}
          style={[styles.item, index !== 0 && styles.itemBorder]}
          onPress={() => handlePress(item)}
        >
          <Text style={styles.itemText} numberOfLines={1}>
            {item.text}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default PersistentMenu;

const styles = StyleSheet.create({
  panel: {
    backgroundColor: messengerTheme.colors.surface,
    borderRadius: messengerTheme.radius.lg,
    marginBottom: messengerTheme.spacing.sm,
    overflow: 'hidden',
    ...messengerTheme.shadow.card,
  },
  item: {
    paddingVertical: messengerTheme.spacing.md,
    paddingHorizontal: messengerTheme.spacing.lg,
  },
  itemBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: messengerTheme.colors.border,
  },
  itemText: {
    fontSize: 14,
    color: messengerTheme.colors.text,
    fontWeight: '500',
  },
});
