/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Image,
  StyleSheet,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { COLORS } from '../theme';

type Props = {
  source: ImageSourcePropType;
  size?: number;
  online?: boolean;
  style?: StyleProp<ViewStyle>;
};

const AvatarWithStatus = ({ source, size = 44, online, style }: Props) => {
  const dot = Math.max(10, Math.round(size * 0.26));

  return (
    <View style={[{ width: size, height: size }, style]}>
      <Image
        source={source}
        resizeMode="cover"
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: COLORS.ring,
        }}
      />
      {online !== undefined ? (
        <View
          style={[
            styles.status,
            {
              width: dot,
              height: dot,
              borderRadius: dot / 2,
              backgroundColor: online ? COLORS.online : COLORS.offline,
            },
          ]}
        />
      ) : null}
    </View>
  );
};

export default AvatarWithStatus;

const styles = StyleSheet.create({
  status: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: COLORS.ring,
  },
});
