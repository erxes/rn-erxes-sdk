/* eslint-disable react-native/no-inline-styles */
import { View, Text, StyleSheet } from 'react-native';
import React, { useContext } from 'react';
import { getAttachmentUrl } from '../utils/utils';
import { Image } from 'react-native';
import AppContext from '../context/Context';

const Avatar = (props: any) => {
  const { user, bgColor } = props;
  const value = useContext(AppContext);

  const { subDomain } = value;
  const url = getAttachmentUrl(user?.details?.avatar, subDomain);
  if (!url) {
    const firstNameLetter = user?.details?.fullName
      ?.split(' ')[0]
      ?.charAt(0)
      ?.toUpperCase();
    const lastNameLetter = user?.details?.fullName
      ?.split(' ')[1]
      ?.charAt(0)
      ?.toUpperCase();
    return (
      <View
        style={[
          styles.avatar,
          {
            backgroundColor: bgColor,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
          },
        ]}
      >
        <Text style={{ color: '#fff', fontWeight: '500' }}>
          {firstNameLetter}.{lastNameLetter}
        </Text>
      </View>
    );
  }
  return (
    <View style={{ marginRight: 10 }}>
      <Image
        source={{ uri: url, cache: 'force-cache' }}
        style={styles.avatar}
        resizeMode="stretch"
      />
    </View>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 90,
  },
});
