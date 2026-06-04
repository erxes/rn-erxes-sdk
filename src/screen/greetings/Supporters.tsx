import { View, Text, StyleSheet } from 'react-native';
import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { widgetsMessengerSupporters } from '../../graphql/query';
import AppContext from '../../context/Context';
import { getAttachmentUrl } from '../../utils/utils';
import AvatarWithStatus from '../../components/AvatarWithStatus';

const MAX_VISIBLE = 3;

const Supporters = (props: any) => {
  const { integrationId, compact } = props;

  const AVATAR_SIZE = compact ? 28 : 36;

  const value = useContext(AppContext);

  const { subDomain, textColor } = value;

  const { data, loading } = useQuery(widgetsMessengerSupporters, {
    variables: {
      integrationId,
    },
  });

  if (loading) {
    return null;
  }

  const supporters = (
    data?.widgetsMessengerSupporters?.supporters || []
  ).filter((supporter: any) => supporter?.isActive);

  if (supporters.length === 0) {
    return null;
  }

  const visible = supporters.slice(0, MAX_VISIBLE);
  const anyOnline = supporters.some((supporter: any) => supporter?.isOnline);

  const getSource = (supporter: any) => {
    if (supporter?.details?.avatar) {
      return { uri: getAttachmentUrl(supporter.details.avatar, subDomain) };
    }
    return require('../../assets/images/avatar.png');
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatars}>
        {visible.map((supporter: any, index: number) => (
          <AvatarWithStatus
            key={index}
            source={getSource(supporter)}
            size={AVATAR_SIZE}
            online={supporter?.isOnline}
            style={[
              index === 0 ? null : styles.overlap,
              { zIndex: visible.length - index },
            ]}
          />
        ))}
      </View>
      {compact ? null : (
        <Text style={[styles.label, { color: textColor }]}>
          {anyOnline ? 'Online support' : 'Support team'}
        </Text>
      )}
    </View>
  );
};

export default Supporters;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlap: {
    marginLeft: -10,
  },
  label: {
    marginLeft: 10,
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.95,
  },
});
