import { View, Text, StyleSheet, Image } from 'react-native';
import React, { useContext } from 'react';
import { messengerTheme } from '../../theme';
import AppContext from '../../context/Context';
import images from '../../assets/images';

// RN port of the web messenger WelcomeMessage — an incoming-style bubble shown
// at the very top of a conversation, using the brand logo as the avatar.
const WelcomeMessage = ({ content }: { content?: string }) => {
  const value = useContext(AppContext);
  const { logoUrl, bgColor } = value;

  if (!content) {
    return null;
  }

  return (
    <View style={styles.row}>
      <View style={[styles.avatar, { backgroundColor: bgColor }]}>
        <Image
          source={logoUrl ? { uri: logoUrl } : images.logo}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.bubble}>
        <Text style={styles.text}>{content}</Text>
      </View>
    </View>
  );
};

export default WelcomeMessage;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: messengerTheme.spacing.md,
    maxWidth: '82%',
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 20,
    height: 20,
  },
  bubble: {
    marginLeft: messengerTheme.spacing.sm,
    backgroundColor: messengerTheme.colors.incomingBubble,
    paddingHorizontal: messengerTheme.spacing.md,
    paddingVertical: 8,
    borderRadius: messengerTheme.radius.bubble,
    borderBottomLeftRadius: messengerTheme.radius.tail,
    flexShrink: 1,
    ...messengerTheme.shadow.bubble,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: messengerTheme.colors.incomingText,
  },
});
