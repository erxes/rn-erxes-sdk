/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

type Props = {
  icon?: any;
  onPress: () => void;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  iconSource?: string;
};

const FAB = (props: Props) => {
  const {
    icon,
    onPress,
    backgroundColor = '#2F1F69',
    style,
    bottom = 20,
  } = props;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.default,
        {
          backgroundColor: backgroundColor ? backgroundColor : '#2F1F69',
          bottom: bottom,
        },
        style,
      ]}
    >
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  default: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    height: 60,
    width: 60,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    zIndex: 3,
    shadowColor: '#2F1F69',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
});

export default FAB;
