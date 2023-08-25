/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, { useContext } from 'react';
import { widgetsConversations } from '../../graphql/query';
import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import FAB from '../../components/FAB';
import AppContext from '../../context/Context';
import Avatar from '../../components/Avatar';
import { PlusIcon } from '../../icons/icons';

const Conversations = () => {
  const value = useContext(AppContext);

  const { customerId, visitorId, bgColor, integrationId, setConversationId } =
    value;

  const { data, loading, refetch } = useQuery(widgetsConversations, {
    variables: {
      customerId: customerId ? customerId : null,
      visitorId: customerId ? null : visitorId,
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
    let name = 'Support Staff';
    if (item?.participatedUsers?.length > 0) {
      name = item?.participatedUsers[0]?.details?.fullName;
    }
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          setConversationId(item._id);
        }}
      >
        <Avatar user={item?.participatedUsers[0]} bgColor={bgColor} />
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

  const emptyComponent = () => {
    return (
      <View>
        <Text style={{ opacity: 0.8 }}>
          There is no chat currently right now
        </Text>
      </View>
    );
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
        ListEmptyComponent={emptyComponent}
        ItemSeparatorComponent={seperator}
      />
      <FAB
        onPress={() => {
          setConversationId('');
        }}
        backgroundColor={bgColor}
        icon={<PlusIcon size={24} />}
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
