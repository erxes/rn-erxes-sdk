import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import dayjs from 'dayjs';
import Avatar from './Avatar';
import { strip_html } from '../utils/utils';
import { messengerTheme } from '../theme';

const AVATAR_SIZE = 40;

type Props = {
  item: any;
  bgColor: string;
  onPress: () => void;
};

const ConversationItem = ({ item, bgColor, onPress }: Props) => {
  const conversationMessages = item?.messages || [];
  const lastMessage = conversationMessages[conversationMessages.length - 1];
  const participant = item?.participatedUsers?.[0] || lastMessage?.user;
  const name =
    participant?.details?.fullName ||
    participant?.details?.shortName ||
    'Support staff';

  const unreadCount = conversationMessages.filter(
    (message: any) =>
      !message?.isCustomerRead &&
      message?.userId !== null &&
      message?.userId !== undefined
  ).length;
  const isUnread = Boolean(
    unreadCount > 0 && !lastMessage?.isCustomerRead && !lastMessage?.customerId
  );
  const preview =
    isUnread && unreadCount > 1
      ? `${unreadCount} new messages`
      : strip_html(lastMessage?.content || item?.content || '');
  const createdAt = lastMessage?.createdAt || item?.createdAt;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.container,
        isUnread && styles.containerUnread,
        isUnread && {
          borderColor: `${bgColor}40`,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.avatarWrap}>
        <Avatar
          user={participant}
          bgColor={bgColor}
          size={AVATAR_SIZE}
          name={name}
        />
        {isUnread ? (
          <View style={[styles.unreadDot, { backgroundColor: bgColor }]} />
        ) : null}
      </View>
      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text
            numberOfLines={1}
            style={[
              styles.name,
              isUnread && styles.nameUnread,
              isUnread && {
                color: messengerTheme.colors.text,
              },
            ]}
          >
            {name}
          </Text>
          <Text
            style={[
              styles.time,
              isUnread && styles.timeUnread,
              isUnread && {
                color: bgColor,
              },
            ]}
          >
            {dayjs(createdAt).format('hh:mm A')}
          </Text>
        </View>
        {preview ? (
          <Text
            numberOfLines={1}
            style={[
              styles.preview,
              isUnread && styles.previewUnread,
              isUnread && {
                color: messengerTheme.colors.text,
              },
            ]}
          >
            {preview}
          </Text>
        ) : null}
      </View>
      {isUnread ? (
        <View style={[styles.unreadBadge, { backgroundColor: bgColor }]}>
          <Text style={styles.unreadBadgeText}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

export default ConversationItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFB',
    borderRadius: messengerTheme.radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ECEEF2',
    padding: messengerTheme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.025,
    shadowRadius: 2,
    elevation: 0,
  },
  containerUnread: {
    backgroundColor: messengerTheme.colors.surface,
    shadowOpacity: 0.08,
    elevation: 1,
  },
  avatarWrap: {
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: messengerTheme.colors.surface,
  },
  body: {
    flex: 1,
    marginLeft: messengerTheme.spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    flex: 1,
    marginRight: messengerTheme.spacing.sm,
    fontWeight: '600',
    fontSize: 13,
    color: '#3F3F46',
  },
  nameUnread: {
    fontWeight: '700',
  },
  preview: {
    marginTop: 3,
    color: '#8A8F98',
    fontSize: 14,
    lineHeight: 18,
  },
  previewUnread: {
    fontWeight: '600',
  },
  time: {
    color: '#A8ADB7',
    fontSize: 11,
  },
  timeUnread: {
    fontWeight: '700',
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    marginLeft: messengerTheme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
