/* eslint-disable react-native/no-inline-styles */
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import React from 'react';
import images from '../../assets/images';

const Social = (props: any) => {
  const { links } = props;

  const renderSocial = (link: any, imageUrl: any, index: number) => {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.7}
        style={[styles.button, index !== 0 && { marginLeft: 8 }]}
        onPress={() => {
          Linking.openURL(link);
        }}
      >
        <Image source={imageUrl} style={styles.image} resizeMode="cover" />
      </TouchableOpacity>
    );
  };

  if (!links) {
    return null;
  }

  return (
    <View style={styles.container}>
      {links?.facebook
        ? renderSocial(links.facebook, images.facebook, 0)
        : null}
      {links?.twitter ? renderSocial(links.twitter, images.twitter, 1) : null}
      {links?.youtube ? renderSocial(links.youtube, images.youtube, 2) : null}
    </View>
  );
};

export default Social;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    opacity: 0.95,
  },
  image: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
});
