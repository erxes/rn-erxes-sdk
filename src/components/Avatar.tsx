/* eslint-disable react-native/no-inline-styles */
import { View, Text } from 'react-native';
import React, { useContext } from 'react';
import { getAttachmentUrl } from '../utils/utils';
import { Image } from 'react-native';
import AppContext from '../context/Context';

type Props = {
  user?: any;
  bgColor: string;
  size?: number;
  name?: string;
};

const Avatar = ({ user, bgColor, size = 40, name }: Props) => {
  const value = useContext(AppContext);

  const { subDomain } = value;
  const url = getAttachmentUrl(user?.details?.avatar, subDomain);

  const dimension = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  if (!url) {
    const displayName = user?.details?.fullName || name || '';
    const firstNameLetter = displayName.split(' ')[0]?.charAt(0)?.toUpperCase();
    const lastNameLetter = displayName.split(' ')[1]?.charAt(0)?.toUpperCase();
    return (
      <View
        style={[
          dimension,
          {
            backgroundColor: bgColor,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <Text
          style={{ color: '#fff', fontWeight: '600', fontSize: size * 0.34 }}
        >
          {firstNameLetter}
          {lastNameLetter ? `.${lastNameLetter}` : ''}
        </Text>
      </View>
    );
  }
  return (
    <Image
      source={{ uri: url, cache: 'force-cache' }}
      style={dimension}
      resizeMode="cover"
    />
  );
};

export default Avatar;
