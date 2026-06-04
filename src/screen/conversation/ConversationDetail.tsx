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
  StatusBar,
} from 'react-native';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useApolloClient } from '@apollo/client';
import { widgetsConversationDetail } from '../../graphql/query';
import Message from './Message';
import InputTools from '../../components/InputTools';
import { widgetsInsertMessage } from '../../graphql/mutation';
import {
  conversationMessageInserted,
  conversationBotTypingStatus,
} from '../../graphql/subscription';
import { getAttachmentUrl } from '../../utils/utils';
import { buildChatRows } from '../../utils/messages';
import AppContext from '../../context/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { messengerTheme } from '../../theme';
import { BackIcon } from '../../components/Icons';
import DateSeparator from '../../components/conversation/DateSeparator';
import WelcomeMessage from '../../components/conversation/WelcomeMessage';
import TypingStatus from '../../components/conversation/TypingStatus';

const hasUserDetails = (user: any): boolean =>
  Boolean(user?.details?.fullName || user?.details?.avatar);

const mergeUserDetails = (baseUser: any, incomingUser: any): any => {
  if (!baseUser && !incomingUser) {
    return incomingUser;
  }

  return {
    ...(baseUser || {}),
    ...(incomingUser || {}),
    details: {
      ...(baseUser?.details || {}),
      ...(incomingUser?.details || {}),
    },
  };
};

const hydrateIncomingMessageUser = (message: any, participants: any[]) => {
  if (message?.customerId || hasUserDetails(message?.user)) {
    return message;
  }

  const participant =
    participants.find((user: any) => user?._id === message?.user?._id) ||
    (participants.length === 1 ? participants[0] : null);

  if (!participant) {
    return message;
  }

  return {
    ...message,
    user: mergeUserDetails(participant, message?.user),
  };
};

const mergeParticipantFromMessage = (participants: any[], message: any) => {
  if (message?.customerId) {
    return participants;
  }

  const incomingUser = message?.user;
  if (!incomingUser?._id || !hasUserDetails(incomingUser)) {
    return participants;
  }

  const existingParticipant = participants.find(
    (user: any) => user?._id === incomingUser._id
  );

  if (!existingParticipant) {
    return [...participants, incomingUser];
  }

  return participants.map((user: any) =>
    user?._id === incomingUser._id ? mergeUserDetails(user, incomingUser) : user
  );
};

const ConversationDetail = () => {
  const value = useContext(AppContext);

  const {
    brand,
    conversationId,
    bgColor,
    integrationId,
    customerId,
    visitorId,
    greetings,
    setConversationId,
    markConversationRead,
    //
    sendIcon,
    //
    subDomain,
  } = value;

  const [messages, setMessages] = React.useState<any>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const sendingRef = React.useRef(false);

  const client = useApolloClient();

  const { data, loading, refetch, subscribeToMore } = useQuery(
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
    if (!conversationId) {
      return;
    }

    const unSubsToMore = subscribeToMore({
      document: conversationMessageInserted,
      variables: { _id: conversationId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!prev || !subscriptionData.data) {
          return prev;
        }

        const message = subscriptionData.data.conversationMessageInserted;
        if (!message) {
          return prev;
        }

        const tempWidgetsConversationDetail =
          prev.widgetsConversationDetail || {};
        const tempMessages = tempWidgetsConversationDetail?.messages || [];
        const tempParticipants =
          tempWidgetsConversationDetail?.participatedUsers || [];

        const existingParticipant = tempParticipants.find(
          (user: any) => user?._id === message?.user?._id
        );
        const messageUser = mergeUserDetails(
          existingParticipant,
          message?.user
        );
        const hydratedMessage = {
          ...message,
          user: messageUser,
        };

        if (!message.customerId && !hasUserDetails(messageUser)) {
          setTimeout(() => refetch(), 0);
        }

        const nextParticipants = mergeParticipantFromMessage(
          tempParticipants,
          hydratedMessage
        );

        // check whether or not already inserted
        const prevEntry = tempMessages.find(
          (m: any) => m._id === hydratedMessage?._id
        );

        if (prevEntry) {
          return {
            ...prev,
            widgetsConversationDetail: {
              ...tempWidgetsConversationDetail,
              participatedUsers: nextParticipants,
            },
          };
        }

        // do not show internal or bot messages
        if (hydratedMessage.internal || hydratedMessage.fromBot) {
          return prev;
        }

        if (!hydratedMessage.customerId) {
          setTimeout(() => markConversationRead?.(conversationId), 0);
        }

        // add new message to messages list
        const next = {
          ...prev,
          widgetsConversationDetail: {
            ...tempWidgetsConversationDetail,
            messages: [...tempMessages, hydratedMessage],
            participatedUsers: nextParticipants,
          },
        };

        return next;
      },
    });

    return () => {
      unSubsToMore();
    };
  }, [conversationId, markConversationRead, refetch, subscribeToMore]);

  useEffect(() => {
    if (data?.widgetsConversationDetail?.messages) {
      const participants =
        data?.widgetsConversationDetail?.participatedUsers || [];
      let reversed = data?.widgetsConversationDetail?.messages
        ?.slice()
        ?.reverse()
        ?.map((message: any) =>
          hydrateIncomingMessageUser(message, participants)
        );
      setMessages(reversed);
    }
  }, [data]);

  // Bot typing indicator — ported from the web messenger useConversationDetail.
  useEffect(() => {
    if (!conversationId) {
      return;
    }
    const subscription = client
      .subscribe({
        query: conversationBotTypingStatus,
        variables: { _id: conversationId },
        fetchPolicy: 'network-only',
      })
      .subscribe({
        next({ data: typing }: any) {
          const status = typing?.conversationBotTypingStatus;
          setIsBotTyping(
            typeof status === 'object' && status !== null
              ? Boolean(status.typing)
              : Boolean(status)
          );
        },
        error() {
          setIsBotTyping(false);
        },
      });

    return () => subscription.unsubscribe();
  }, [conversationId, client]);

  // Build grouped rows (welcome → date separators → grouped messages) in
  // chronological order, then reverse for the inverted FlatList.
  const invertedRows = useMemo(() => {
    const chronological = [...messages].reverse();
    const rows = buildChatRows(chronological, greetings?.messages?.welcome);
    return [...rows].reverse();
  }, [messages, greetings]);

  const [sendMutation] = useMutation(widgetsInsertMessage);

  useEffect(() => {
    if (!conversationId) {
      return;
    }

    markConversationRead?.(conversationId);
  }, [conversationId, markConversationRead]);

  const onSend = (text: string, attachments?: any[]) => {
    if (sendingRef.current) {
      return;
    }

    sendingRef.current = true;
    setSending(true);

    sendMutation({
      variables: {
        integrationId,
        customerId,
        visitorId,
        conversationId: conversationId || null,
        contentType: 'text',
        message: text,
        attachments:
          attachments && attachments.length > 0 ? attachments : undefined,
      },
    })
      .then((res: any) => {
        if (res.errors) {
          return console.log(res.errors);
        }

        const insertedMessage = res.data.widgetsInsertMessage;

        if (insertedMessage) {
          const nextConversationId = insertedMessage.conversationId;

          if (nextConversationId && nextConversationId !== conversationId) {
            AsyncStorage.setItem('conversationId', nextConversationId);
            setConversationId(nextConversationId);
          }

          setMessages((prevMessages: any[]) => {
            const alreadyExists = prevMessages.some(
              (message: any) => message._id === insertedMessage._id
            );

            return alreadyExists
              ? prevMessages
              : [insertedMessage, ...prevMessages];
          });
        }
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        sendingRef.current = false;
        setSending(false);
      });
  };

  if (loading) {
    return (
      <View style={styles.fullCenter}>
        <ActivityIndicator color={bgColor} size={'large'} />
      </View>
    );
  }

  const renderItem = ({ item }: any) => {
    if (item.type === 'welcome') {
      return <WelcomeMessage content={item.content} />;
    }
    if (item.type === 'date') {
      return <DateSeparator label={item.label} />;
    }
    return (
      <Message
        item={item.item}
        bgColor={bgColor}
        isFirstInGroup={item.isFirstInGroup}
        isLastInGroup={item.isLastInGroup}
      />
    );
  };

  const renderContent = () => {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <FlatList
          contentContainerStyle={styles.contentStyle}
          showsVerticalScrollIndicator={false}
          data={invertedRows}
          keyExtractor={(item: any) => item.id}
          onEndReachedThreshold={0.2}
          renderItem={renderItem}
          ItemSeparatorComponent={() => null}
          keyboardShouldPersistTaps="handled"
          inverted
        />
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.root}>
      <Header
        brand={brand}
        bgColor={bgColor}
        users={data?.widgetsConversationDetail?.participatedUsers}
        isOnline={data?.widgetsConversationDetail?.isOnline}
        subDomain={subDomain}
      />
      <KeyboardAvoidingView
        style={styles.chatArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {renderContent()}
        {isBotTyping ? (
          <View style={styles.typingWrap}>
            <TypingStatus />
          </View>
        ) : null}
        <InputTools
          onSend={onSend}
          bgColor={bgColor}
          sendIcon={sendIcon}
          subDomain={subDomain}
          sending={sending}
          persistentMenus={
            data?.widgetsConversationDetail?.persistentMenus ||
            greetings?.persistentMenus
          }
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default ConversationDetail;

const Header = (props: any) => {
  const { brand, bgColor, users, isOnline, subDomain } = props;

  const value = useContext(AppContext);

  const { setConversationId } = value;

  const agent = users?.length > 0 ? users[0] : null;
  const title = agent?.details?.fullName || brand?.name || 'Support';
  const subtitle = agent ? 'usually replies in a few minutes' : null;

  const avatarSource = agent?.details?.avatar
    ? { uri: getAttachmentUrl(agent.details.avatar, subDomain) }
    : require('../../assets/images/avatar.png');

  const androidTop =
    Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

  return (
    <SafeAreaView style={{ backgroundColor: bgColor }}>
      <View style={[styles.header, { paddingTop: androidTop + 6 }]}>
        <TouchableOpacity
          onPress={() => {
            AsyncStorage.removeItem('conversationId');
            setConversationId(null);
          }}
          style={styles.backButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <BackIcon color={messengerTheme.colors.primaryForeground} size={18} />
        </TouchableOpacity>

        {agent ? (
          <View style={styles.avatarWrap}>
            <Image
              source={avatarSource}
              style={styles.avatar}
              resizeMode="cover"
            />
            {isOnline ? <View style={styles.onlineDot} /> : null}
          </View>
        ) : null}

        <View style={styles.headerTextWrap}>
          <Text numberOfLines={1} style={styles.headerTitle}>
            {title}
          </Text>
          {subtitle ? (
            <Text numberOfLines={1} style={styles.headerSubtitle}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: messengerTheme.colors.background,
  },
  chatArea: {
    flex: 1,
    backgroundColor: messengerTheme.colors.background,
  },
  fullCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: messengerTheme.colors.background,
  },
  contentStyle: {
    flexGrow: 1,
    paddingHorizontal: messengerTheme.spacing.lg,
    paddingVertical: messengerTheme.spacing.md,
  },
  typingWrap: {
    paddingHorizontal: messengerTheme.spacing.lg,
    paddingBottom: messengerTheme.spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: messengerTheme.spacing.md,
    paddingBottom: messengerTheme.spacing.md,
    paddingTop: 6,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  avatarWrap: {
    marginLeft: messengerTheme.spacing.md,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  onlineDot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: messengerTheme.colors.online,
    borderWidth: 2,
    borderColor: messengerTheme.colors.primary,
  },
  headerTextWrap: {
    flex: 1,
    marginLeft: messengerTheme.spacing.md,
  },
  headerTitle: {
    color: messengerTheme.colors.primaryForeground,
    fontWeight: '600',
    fontSize: 16,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
    marginTop: 1,
  },
});
