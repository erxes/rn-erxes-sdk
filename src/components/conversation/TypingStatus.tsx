import { View, StyleSheet, Image, Animated, Easing } from 'react-native';
import React, { useContext, useEffect, useRef } from 'react';
import { messengerTheme } from '../../theme';
import AppContext from '../../context/Context';
import images from '../../assets/images';

// RN port of the web messenger TypingStatus — a small incoming bubble with the
// brand avatar and three bouncing dots, shown while the bot is typing.
const Dot = ({ delay }: { delay: number }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(600 - delay),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim, delay]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -4],
  });
  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  return (
    <Animated.View
      style={[styles.dot, { opacity, transform: [{ translateY }] }]}
    />
  );
};

const TypingStatus = () => {
  const value = useContext(AppContext);
  const { logoUrl, bgColor } = value;

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
        <Dot delay={0} />
        <Dot delay={150} />
        <Dot delay={300} />
      </View>
    </View>
  );
};

export default TypingStatus;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: messengerTheme.spacing.sm,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: messengerTheme.colors.incomingBubble,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: messengerTheme.radius.bubble,
    borderBottomLeftRadius: messengerTheme.radius.tail,
    ...messengerTheme.shadow.bubble,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: messengerTheme.colors.subtleText,
  },
});
