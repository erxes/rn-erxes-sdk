/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React from 'react';
import { widgetsConversations } from '../../graphql/query';
import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import images from '../../assets/images';
import FAB from '../../components/FAB';
import { useNavigation } from '@react-navigation/native';
import { getAttachmentUrl } from '../../utils/utils';

const Conversations = (props: any) => {
  const { customerId, visitorId, integrationId, bgColor, brand } = props;

  const navigation = useNavigation<any>();

  const { data, loading, refetch } = useQuery(widgetsConversations, {
    variables: {
      customerId,
      integrationId,
    },
  });

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [refetch]);

  if (loading) {
    return null;
  }

  const renderItem = ({ item }: any) => {
    let source = images.avatar;
    let name = 'Support Staff';
    if (item?.participatedUsers?.length > 0) {
      source = {
        uri: getAttachmentUrl(item?.participatedUsers[0]?.details?.avatar),
        cache: 'only-if-cached',
      };
      name = item?.participatedUsers[0]?.details?.fullName;
    }
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          navigation.navigate('ConversationDetail', {
            _id: item._id,
            integrationId,
            customerId,
            visitorId,
            bgColor,
            brand,
          });
        }}
      >
        <Image source={source} style={styles.image} resizeMode="stretch" />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={{ fontWeight: '500' }}>{name}</Text>
          <Text style={{ color: '#686868' }}>{item?.content}</Text>
        </View>
        <Text>{dayjs(item?.createdAt).format('hh:mm A')}</Text>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    return (
      <View style={{ marginVertical: 10 }}>
        <Text style={{ fontWeight: '600', fontSize: 18 }}>
          Recent conversations
        </Text>
      </View>
    );
  };

  const seperator = () => {
    return <View style={{ height: 10 }} />;
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={styles.contentStyle}
        showsVerticalScrollIndicator={false}
        data={data?.widgetsConversations}
        keyExtractor={(item: any) => item._id}
        onEndReachedThreshold={0.2}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[bgColor]}
            tintColor={bgColor}
          />
        }
        ItemSeparatorComponent={seperator}
      />
      <FAB
        onPress={() =>
          navigation.navigate('ConversationDetail', {
            _id: '',
            integrationId,
            customerId,
            bgColor,
            brand,
          })
        }
      />
    </View>
  );
};

export default Conversations;

const styles = StyleSheet.create({
  contentStyle: {
    flexGrow: 1,
    padding: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 90,
  },
});
