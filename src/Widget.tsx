/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import { View, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import {
  connect,
  widgetsReadConversationMessages,
  widgetsSaveBrowserInfo,
} from './graphql/mutation';
import AppContext from './context/Context';
import ConversationDetail from './screen/conversation/ConversationDetail';
import MessengerShell from './components/MessengerShell';
import { TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import images from './assets/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widgetsConversations } from './graphql/query';
import {
  adminMessageInserted,
  conversationMessageInserted,
} from './graphql/subscription';
import { Text } from 'react-native';
import { getAttachmentUrl } from './utils/utils';

const countUnreadMessages = (conversations: any[] = []) =>
  conversations.reduce((acc, conversation) => {
    const messages = conversation?.messages || [];
    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.isCustomerRead) {
      return acc;
    }

    const unreadCount = messages.filter(
      (message: any) =>
        !message?.isCustomerRead &&
        message?.userId !== null &&
        message?.userId !== undefined
    ).length;

    return acc + unreadCount;
  }, 0);

const Widget = (props: any) => {
  const {
    integrationId: connectIntegrationId,
    brandCode,
    email,
    onBack,
    connection,
    setConnection,
    showWidget,
    // Icons
    backIcon,
    newChatIcon,
    sendIcon,
    // tracking
    phone,
    data,
    properties,
    //launcherOption
    show,
    setShow,
    //domain
    subDomain,
    //
    cachedConversationId,
  } = props;

  const [visibleLauncher, setVisibleLauncher] = React.useState<boolean>(false);
  const [response, setResponse] = React.useState<any>(null);
  const [conversationId, setConversationId] = React.useState<string | null>(
    cachedConversationId
  );
  const client = useApolloClient();

  const unreadVariables = {
    integrationId: response?.data?.widgetsMessengerConnect?.integrationId,
    customerId: connection?.cachedCustomerId || null,
    visitorId: connection?.cachedCustomerId ? null : connection?.visitorId,
  };

  const {
    data: dataUnreadConversations,
    refetch: refetchUnreadConversations,
    subscribeToMore: subscribeToUnreadMore,
  } = useQuery(widgetsConversations, {
    variables: unreadVariables,
    skip: !response,
    fetchPolicy: 'network-only',
  });

  const totalUnreadCount = React.useMemo(
    () =>
      countUnreadMessages(dataUnreadConversations?.widgetsConversations || []),
    [dataUnreadConversations]
  );

  const [connectMutation] = useMutation(connect);
  const [readConversationMessages] = useMutation(
    widgetsReadConversationMessages
  );
  const [saveBrowserInfo] = useMutation(widgetsSaveBrowserInfo);

  const markConversationRead = React.useCallback(
    (id?: string | null) => {
      if (!id) {
        return Promise.resolve(null);
      }

      return readConversationMessages({
        variables: {
          conversationId: id,
        },
      })
        .then((res) => {
          refetchUnreadConversations();
          return res;
        })
        .catch((err) => {
          console.log(err);
          return null;
        });
    },
    [readConversationMessages, refetchUnreadConversations]
  );

  useEffect(() => {
    const conversations = dataUnreadConversations?.widgetsConversations || [];

    if (!conversations.length) {
      return;
    }

    const unsubscribes = conversations.map((conversation: any) =>
      subscribeToUnreadMore({
        document: conversationMessageInserted,
        variables: { _id: conversation._id },
        updateQuery: (prev, { subscriptionData }) => {
          if (!prev || !subscriptionData.data) {
            return prev;
          }

          const newMessage = subscriptionData.data.conversationMessageInserted;

          if (!newMessage) {
            return prev;
          }

          const conversationIndex = prev.widgetsConversations.findIndex(
            (item: any) => item._id === newMessage.conversationId
          );

          if (conversationIndex === -1) {
            refetchUnreadConversations();
            return prev;
          }

          const currentConversation =
            prev.widgetsConversations[conversationIndex];
          const messageExists = currentConversation.messages?.some(
            (message: any) => message._id === newMessage._id
          );

          if (messageExists) {
            return prev;
          }

          const nextConversations = [...prev.widgetsConversations];
          nextConversations[conversationIndex] = {
            ...currentConversation,
            content: newMessage.content,
            createdAt: newMessage.createdAt,
            messages: [...(currentConversation.messages || []), newMessage],
          };

          return {
            ...prev,
            widgetsConversations: nextConversations,
          };
        },
      })
    );

    return () => {
      unsubscribes.forEach((unsubscribe: any) => unsubscribe());
    };
  }, [
    dataUnreadConversations?.widgetsConversations,
    refetchUnreadConversations,
    subscribeToUnreadMore,
  ]);

  useEffect(() => {
    const customerId = connection?.cachedCustomerId;

    if (!customerId) {
      return;
    }

    const subscription = client
      .subscribe({
        query: adminMessageInserted,
        variables: { customerId },
        fetchPolicy: 'network-only',
      })
      .subscribe({
        next() {
          refetchUnreadConversations();
        },
        error(err) {
          console.log(err);
        },
      });

    return () => subscription.unsubscribe();
  }, [client, connection?.cachedCustomerId, refetchUnreadConversations]);

  useEffect(() => {
    connectMutation({
      variables: {
        integrationId: connectIntegrationId || brandCode,
        email,
        cachedCustomerId: connection?.cachedCustomerId,
        visitorId: connection?.visitorId,
        // if client passed email automatically then consider this as user
        isUser: Boolean(email),
        phone: phone ? phone : null,
        data: data ? data : null,
      },
    })
      .then((res: any) => {
        setResponse(res);
        const showLauncher =
          res?.data?.widgetsMessengerConnect?.messengerData?.showLauncher;
        setVisibleLauncher(showLauncher);

        const customerId = res?.data?.widgetsMessengerConnect?.customerId;

        if (connection?.customerId !== customerId) {
          const jsonValue = JSON.stringify(customerId);
          AsyncStorage.setItem('cachedCustomerId', jsonValue);
          setConnection({
            visitorId: connection?.visitorId,
            cachedCustomerId: customerId,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (connection?.cachedCustomerId) {
      saveBrowserInfo({
        variables: {
          customerId: connection?.cachedCustomerId,
          browserInfo: properties,
        },
      })
        .then(() => {
          console.log('browser info saved');
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [connection]);

  const integrationId = response?.data?.widgetsMessengerConnect?.integrationId;
  const uiOptions = response?.data?.widgetsMessengerConnect?.uiOptions;
  const bgColor = uiOptions?.primary?.DEFAULT || uiOptions?.color || '#5629b6';
  const textColor =
    uiOptions?.primary?.foreground || uiOptions?.textColor || '#fff';
  const logoUrl = uiOptions?.logo
    ? getAttachmentUrl(uiOptions.logo, subDomain)
    : undefined;

  if (!integrationId) {
    return null;
  }

  if (show) {
    if (!visibleLauncher) {
      return null;
    }

    return (
      <View style={{ flex: 1, zIndex: 999 }}>
        <TouchableOpacity
          style={[
            styles.widget,
            {
              display: visibleLauncher ? 'flex' : 'none',
            },
          ]}
          onPress={() => {
            // AsyncStorage.removeItem('cachedCustomerId');
            setShow(false);
          }}
        >
          <Image
            source={logoUrl ? { uri: logoUrl } : images.logo}
            style={styles.image}
            resizeMode="cover"
          />
          {totalUnreadCount > 0 ? (
            <View style={styles.unreadCountContainer}>
              <Text style={styles.unreadCountText}>
                {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <AppContext.Provider
      value={{
        // Ids
        customerId: connection?.cachedCustomerId,
        visitorId: connection?.visitorId,
        //Props
        email,
        brandCode,
        hasBack: showWidget ? false : true,
        onBack,
        showWidget,
        //Ui Options
        bgColor,
        textColor,
        logoUrl,
        //Datas
        brand: response?.data?.widgetsMessengerConnect?.brand,
        greetings: response?.data?.widgetsMessengerConnect?.messengerData,
        integrationId,
        //Conversation
        conversationId,
        setConversationId,
        //Unread
        totalUnreadCount,
        markConversationRead,
        // Connection
        setConnection,
        //
        setShow,
        // Icons
        backIcon,
        newChatIcon,
        sendIcon,
        //domain
        subDomain,
      }}
    >
      <View style={styles.container}>
        {conversationId !== null ? <ConversationDetail /> : <MessengerShell />}
      </View>
    </AppContext.Provider>
  );
};

export default Widget;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  widget: {
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
    backgroundColor: '#2F1F69',
  },
  image: { width: 50, height: 50, borderRadius: 90 },
  unreadCountContainer: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCountText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
});
