/* eslint-disable react-native/no-inline-styles */
import { View, Image, StyleSheet } from 'react-native';
import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { widgetsMessengerSupporters } from '../../graphql/query';
import AppContext from '../../context/Context';
import { getAttachmentUrl } from '../../utils/utils';

const Supporters = (props: any) => {
  const { integrationId } = props;

  const value = useContext(AppContext);

  const { subDomain } = value;

  const { data, loading } = useQuery(widgetsMessengerSupporters, {
    variables: {
      integrationId,
    },
  });

  if (loading) {
    return null;
  }

  const supporters = data?.widgetsMessengerSupporters?.supporters;

  const renderSupporter = (supporter: any, index: number) => {
    const color = supporter?.isOnline ? '#3ccc38' : 'white';
    let source;
    if (supporter?.details?.avatar) {
      source = {
        uri: getAttachmentUrl(supporter?.details?.avatar, subDomain),
      };
    } else {
      source = require('../../assets/images/avatar.png');
    }
    return (
      <View
        key={index}
        style={{
          marginLeft: index === 0 ? 0 : 10,
        }}
      >
        <Image source={source} style={styles.image} resizeMode="center" />
        <View style={[{ backgroundColor: color }, styles.activeStatus]} />
      </View>
    );
  };

  return (
    <View style={{ marginTop: 10, flexDirection: 'row' }}>
      {supporters
        ?.filter((supporter: any) => supporter?.isActive)
        ?.map((supporter: any, index: number) => {
          return renderSupporter(supporter, index);
        })}
    </View>
  );
};

export default Supporters;

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
    borderRadius: 90,
  },
  activeStatus: {
    width: 13,
    height: 13,
    borderRadius: 90,
    position: 'absolute',
    bottom: 0,
    left: 35,
  },
});
