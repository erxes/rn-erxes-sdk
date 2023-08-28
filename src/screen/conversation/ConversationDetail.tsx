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
  SafeAreaView,
} from 'react-native';
import React, { useContext, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { widgetsConversationDetail } from '../../graphql/query';
import Message from './Message';
import InputTools from '../../components/InputTools';
import { widgetsInsertMessage } from '../../graphql/mutation';
import { conversationMessageInserted } from '../../graphql/subscription';
import { getAttachmentUrl } from '../../utils/utils';
import AppContext from '../../context/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConversationDetail = () => {
  const value = useContext(AppContext);

  const {
    brand,
    conversationId,
    bgColor,
    integrationId,
    customerId,
    visitorId,
    setConnection,
    //
    backIcon,
    sendIcon,
    //
    subDomain,
  } = value;

  const [messages, setMessages] = React.useState<any>([]);

  const { data, loading, subscribeToMore } = useQuery(
    widgetsConversationDetail,
    {
      variables: {
        _id: conversationId,
        integrationId,
      },
      fetchPolicy: 'network-only',
      skip: !conversationId,
    }
  );

  useEffect(() => {
    const unSubsToMore = subscribeToMore({
      document: conversationMessageInserted,
      variables: { _id: conversationId },
      updateQuery: (prev, { subscriptionData }) => {
        const message = subscriptionData.data.conversationMessageInserted;
        const tempWidgetsConversationDetail =
          prev.widgetsConversationDetail || {};
        const tempMessages = tempWidgetsConversationDetail?.messages || [];

        // check whether or not already inserted
        const prevEntry = tempMessages.find((m: any) => m._id === message?._id);

        if (prevEntry) {
          return prev;
        }

        // do not show internal or bot messages
        if (message.internal || message.fromBot) {
          return prev;
        }

        // add new message to messages list
        const next = {
          ...prev,
          widgetsConversationDetail: {
            ...tempWidgetsConversationDetail,
            messages: [...tempMessages, message],
          },
        };

        return next;
      },
    });

    return () => {
      unSubsToMore;
    };
  }, [conversationId, subscribeToMore]);

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
        conversationId,
        contentType: 'text',
        message: text,
      },
    })
      .then((res: any) => {
        if (res.errors) {
          return console.log(res.errors);
        }
        if (res.data.widgetsInsertMessage) {
          if (!customerId) {
            const tempCustomerId = res.data.widgetsInsertMessage.customerId;
            const jsonValue = JSON.stringify(tempCustomerId);
            AsyncStorage.setItem('cachedCustomerId', jsonValue);
            setConnection({
              visitorId,
              cachedCustomerId: tempCustomerId,
            });
          }
          let shouldAdd = messages?.length === 0;
          if (!shouldAdd) {
            shouldAdd = res.data.widgetsInsertMessage._id !== messages[0]._id;
          }
          if (shouldAdd) {
            const newArray = [res.data.widgetsInsertMessage, ...messages];
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
        brand={brand}
        bgColor={bgColor}
        users={data?.widgetsConversationDetail?.participatedUsers}
        backIcon={backIcon}
        subDomain={subDomain}
      />
      <View style={{ backgroundColor: 'rgba(215,215,215,.7)', flex: 1 }}>
        {renderContent()}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={100}
        >
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <InputTools onSend={onSend} bgColor={bgColor} sendIcon={sendIcon} />
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default ConversationDetail;

const Header = (props: any) => {
  const { brand, bgColor, users, backIcon, subDomain } = props;

  const value = useContext(AppContext);

  const { setConversationId } = value;

  if (users?.length > 0) {
    let source;
    if (users[0]?.details?.avatar) {
      source = { uri: getAttachmentUrl(users[0]?.details?.avatar, subDomain) };
    } else {
      source = require('../../assets/images/avatar.png');
    }
    return (
      <SafeAreaView
        style={{
          backgroundColor: bgColor,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingBottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setConversationId(null);
            }}
            style={[
              styles.backStyle,
              {
                backgroundColor: '#2F1F69',
              },
            ]}
          >
            {backIcon}
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
            <Image source={source} style={styles.avatar} resizeMode="stretch" />
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontWeight: '600' }}>
                {users[0]?.details?.fullName}
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: bgColor,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingBottom: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setConversationId(null);
          }}
          style={[
            styles.backStyle,
            {
              backgroundColor: '#2F1F69',
            },
          ]}
        >
          {backIcon}
        </TouchableOpacity>
        <View style={[styles.title]}>
          <Text style={{ fontWeight: '600', fontSize: 16 }}>{brand?.name}</Text>
        </View>
      </View>
    </SafeAreaView>
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
