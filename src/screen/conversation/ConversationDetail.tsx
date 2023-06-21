/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';
import React, { useEffect } from 'react';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { widgetsConversationDetail } from '../../graphql/query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Message from './Message';
import InputTools from '../../components/InputTools';
import { widgetsInsertMessage } from '../../graphql/mutation';
import { conversationMessageInserted } from '../../graphql/subscription';
import { getAttachmentUrl } from '../../utils/utils';
import { getLocalStorageItem, setLocalStorageItem } from '../../utils/common';

const ConversationDetail = (props: any) => {
  const { route, navigation } = props;
  const { _id, integrationId, bgColor, brand, customerId, visitorId } =
    route.params;

  const [messages, setMessages] = React.useState<any>([]);

  const { data, loading } = useQuery(widgetsConversationDetail, {
    variables: {
      _id,
      integrationId,
    },
    fetchPolicy: 'network-only',
    skip: !_id,
  });

  const { data: subscriptionData } = useSubscription(
    conversationMessageInserted,
    {
      variables: { _id },
      fetchPolicy: 'network-only',
      skip: !_id,
    }
  );

  useEffect(() => {
    let shouldAdd = subscriptionData && data;
    if (data?.length > 0) {
      shouldAdd =
        subscriptionData?.conversationMessageInserted?._id !== data[0]._id;
    }
    if (shouldAdd) {
      setMessages((prev: any) => [
        subscriptionData?.conversationMessageInserted,
        ...prev,
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptionData]);

  useEffect(() => {
    if (data?.widgetsConversationDetail?.messages) {
      let reversed = data?.widgetsConversationDetail?.messages
        ?.slice()
        ?.reverse();
      setMessages(reversed);
    }
  }, [data]);

  const [sendMutation] = useMutation(widgetsInsertMessage);

  const onSend = (text: string) => {
    sendMutation({
      variables: {
        integrationId,
        customerId,
        visitorId,
        conversationId: _id,
        contentType: 'text',
        message: text,
      },
    })
      .then((res: any) => {
        if (res.errors) {
          return console.log(res.errors);
        }
        if (res.data.widgetsInsertMessage) {
          const cachedCustomerId = getLocalStorageItem('customerId');
          if (!cachedCustomerId) {
            const tempCustomerId = res.data.widgetsInsertMessage.customerId;
            setLocalStorageItem('customerId', tempCustomerId);
          }
          let shouldAdd = messages?.length === 0;
          if (!shouldAdd) {
            shouldAdd = res.data.widgetsInsertMessage._id !== data[0]._id;
          }
          if (shouldAdd) {
            const newArray = [res.data.widgetsInsertMessage, ...data];
            setMessages(newArray);
          }
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={'#686868'} size={'large'} />
      </View>
    );
  }

  const renderItem = ({ item }: any) => {
    return <Message item={item} bgColor={bgColor} />;
  };

  const renderContent = () => {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          contentContainerStyle={styles.contentStyle}
          showsVerticalScrollIndicator={false}
          data={messages}
          keyExtractor={(item: any) => item._id}
          onEndReachedThreshold={0.2}
          renderItem={renderItem}
          ItemSeparatorComponent={() => null}
          inverted
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        navigation={navigation}
        brand={brand}
        bgColor={bgColor}
        users={data?.widgetsConversationDetail?.participatedUsers}
      />
      <View style={{ backgroundColor: 'rgba(215,215,215,.7)', flex: 1 }}>
        {renderContent()}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={100}
        >
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <InputTools onSend={onSend} bgColor={bgColor} />
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default ConversationDetail;

const Header = (props: any) => {
  const { navigation, brand, bgColor, users } = props;

  const insets = useSafeAreaInsets();

  if (users?.length > 0) {
    const url = getAttachmentUrl(users[0]?.details?.avatar);
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingBottom: 20,
          backgroundColor: bgColor || 'green',
          paddingTop: insets.top,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={[
            styles.backStyle,
            {
              backgroundColor: '#2F1F69',
            },
          ]}
        >
          <Text>A</Text>
        </TouchableOpacity>
        <View
          style={[
            styles.title,
            {
              marginLeft: 10,
              alignItems: 'center',
              flex: 1,
            },
          ]}
        >
          <Image
            source={{ uri: url, cache: 'force-cache' }}
            style={styles.avatar}
            resizeMode="stretch"
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontWeight: '600' }}>
              {users[0]?.details?.fullName}
            </Text>
            <Text style={{ color: '#686868' }}>
              {users[0]?.details?.position}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 20,
        backgroundColor: bgColor || 'green',
        paddingTop: insets.top,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={[
          styles.backStyle,
          {
            backgroundColor: '#2F1F69',
          },
        ]}
      >
        <Text>A</Text>
      </TouchableOpacity>
      <View style={[styles.title]}>
        <Text style={{ fontWeight: '600', fontSize: 16 }}>{brand?.name}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backStyle: {
    width: 40,
    height: 40,
    marginLeft: 15,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: 'row',
  },
  contentStyle: {
    flexGrow: 1,
    padding: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 90,
  },
});
