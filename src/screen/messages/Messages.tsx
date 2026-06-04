import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import React, { useContext } from 'react';
import { widgetsConversations } from '../../graphql/query';
import { useQuery } from '@apollo/client';
import { conversationMessageInserted } from '../../graphql/subscription';
import AppContext from '../../context/Context';
import ConversationItem from '../../components/ConversationItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { messengerTheme } from '../../theme';
import { PlusIcon, ChevronRightIcon } from '../../components/Icons';
import {
  AVAILABILITY_MESSAGE,
  formatOnlineHoursShort,
} from '../../utils/onlineHours';

// Messages tab — RN port of the web messenger "Messages" view (intro.tsx):
// a "Start a new conversation" card on top of the recent conversation list.
const Messages = () => {
  const value = useContext(AppContext);

  const {
    customerId,
    visitorId,
    bgColor,
    integrationId,
    setConversationId,
    greetings,
    markConversationRead,
  } = value;

  const { onlineHours, showTimezone, timezone, responseRate } = greetings || {};
  const availabilityText = onlineHours
    ? formatOnlineHoursShort({
        onlineHours,
        showTimezone,
        timezone,
      })
    : AVAILABILITY_MESSAGE;
  const startSubtitle = `${
    responseRate ? `Replies in ~ 4 ${responseRate}` : 'Replies soon'
  } · ${availabilityText}`;
  const androidTop =
    Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

  const { data, loading, error, refetch, subscribeToMore } = useQuery(
    widgetsConversations,
    {
      variables: {
        integrationId,
        customerId: customerId || null,
        visitorId: customerId ? null : visitorId,
      },
      fetchPolicy: 'network-only',
    }
  );

  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    const conversations = data?.widgetsConversations || [];

    if (!conversations.length) {
      return;
    }

    const unsubscribes = conversations.map((conversation: any) =>
      subscribeToMore({
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
  }, [data?.widgetsConversations, subscribeToMore]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch();
    setTimeout(() => setRefreshing(false), 1000);
  }, [refetch]);

  const renderItem = ({ item }: any) => (
    <View style={styles.conversationItemWrap}>
      <ConversationItem
        item={item}
        bgColor={bgColor}
        onPress={() => {
          markConversationRead?.(item._id);
          AsyncStorage.setItem('conversationId', item._id);
          setConversationId(item._id);
        }}
      />
    </View>
  );

  const startNewConversation = () => {
    AsyncStorage.removeItem('conversationId');
    setConversationId('');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <SafeAreaView style={[styles.hero, { backgroundColor: bgColor }]}>
        <View style={[styles.heroInner, { paddingTop: androidTop + 12 }]}>
          <Text style={styles.heroEyebrow}>Messages</Text>
          <Text numberOfLines={2} style={styles.heroTitle}>
            Your conversations
          </Text>
        </View>
      </SafeAreaView>
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.startCard}
        onPress={startNewConversation}
      >
        <View style={[styles.startIcon, { backgroundColor: bgColor }]}>
          <PlusIcon color="#fff" size={20} />
        </View>
        <View style={styles.startTextWrap}>
          <Text style={styles.startTitle}>Start a new conversation</Text>
          <Text style={styles.startSubtitle} numberOfLines={1}>
            {startSubtitle}
          </Text>
        </View>
        <ChevronRightIcon color={messengerTheme.colors.subtleText} size={16} />
      </TouchableOpacity>
    </View>
  );

  const separator = () => <View style={styles.separator} />;

  const emptyComponent = () => {
    if (loading) {
      return (
        <View style={styles.stateWrap}>
          <ActivityIndicator color={bgColor} />
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.stateWrap}>
          <Text style={styles.stateTitle}>Something went wrong</Text>
          <Text style={styles.stateSubtitle}>
            Pull down to try loading your conversations again.
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.stateWrap}>
        <Text style={styles.stateTitle}>No conversations yet</Text>
        <Text style={styles.stateSubtitle}>
          Start a new chat and we'll be happy to help.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <FlatList
        contentContainerStyle={styles.contentStyle}
        showsVerticalScrollIndicator={false}
        data={data?.widgetsConversations || []}
        keyExtractor={(item: any) => item._id}
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
        ItemSeparatorComponent={separator}
      />
    </View>
  );
};

export default Messages;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: messengerTheme.colors.background,
  },
  contentStyle: {
    flexGrow: 1,
    paddingBottom: messengerTheme.spacing.xl,
  },
  header: {
    marginBottom: messengerTheme.spacing.md,
  },
  hero: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroInner: {
    paddingHorizontal: messengerTheme.spacing.xl,
    paddingBottom: 56,
  },
  heroEyebrow: {
    marginTop: 22,
    fontSize: 22,
    fontWeight: '300',
    color: messengerTheme.colors.primaryForeground,
    opacity: 0.7,
  },
  heroTitle: {
    marginTop: 4,
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 32,
    color: messengerTheme.colors.primaryForeground,
  },
  startCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: messengerTheme.colors.surface,
    borderRadius: messengerTheme.radius.lg,
    padding: messengerTheme.spacing.lg,
    marginHorizontal: messengerTheme.spacing.md,
    marginTop: -28,
    ...messengerTheme.shadow.card,
  },
  startIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: messengerTheme.spacing.md,
  },
  startTextWrap: {
    flex: 1,
    marginRight: messengerTheme.spacing.sm,
  },
  startTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: messengerTheme.colors.text,
  },
  startSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: messengerTheme.colors.mutedText,
  },
  conversationItemWrap: {
    marginHorizontal: messengerTheme.spacing.lg,
  },
  separator: {
    height: messengerTheme.spacing.sm,
  },
  stateWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 64,
    paddingHorizontal: messengerTheme.spacing.xxl,
  },
  stateTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: messengerTheme.colors.text,
  },
  stateSubtitle: {
    marginTop: 6,
    color: messengerTheme.colors.mutedText,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
});
