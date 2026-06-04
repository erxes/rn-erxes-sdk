/* eslint-disable react-native/no-inline-styles */
import { View, Text, StyleSheet, Dimensions, Linking } from 'react-native';
import React from 'react';
import dayjs from 'dayjs';
import HTML from 'react-native-render-html';
import { strip_html } from '../../utils/utils';
import Attachment from './Attachment';
import Avatar from '../../components/Avatar';
import { messengerTheme } from '../../theme';

const { width } = Dimensions.get('window');

const INCOMING_MAX = width * 0.8;
const OUTGOING_MAX = width * 0.78;
const AVATAR_SIZE = 32;

const Message = (props: any) => {
  const {
    item,
    bgColor,
    // Grouping props (default to a standalone message when not provided).
    isFirstInGroup = true,
    isLastInGroup = true,
  } = props;

  const showName = isFirstInGroup;
  const showAvatar = isLastInGroup;
  const showTime = isLastInGroup;

  const isOutgoing = Boolean(item?.customerId);
  const name = item?.user?.details?.fullName || item?.user?.details?.firstName;

  const strippedContent = strip_html(item?.content || '', true);
  const hasContent = !!strippedContent && strippedContent.trim().length > 0;
  const hasAttachments = item?.attachments?.length > 0;

  const rowSpacing = {
    marginTop: isFirstInGroup ? messengerTheme.spacing.md : 2,
  };

  if (isOutgoing) {
    return (
      <View style={[styles.outgoingRow, rowSpacing]}>
        <View style={styles.outgoingColumn}>
          {hasContent ? (
            <View style={[styles.outgoingBubble, { backgroundColor: bgColor }]}>
              <Text style={styles.outgoingText}>{item?.content}</Text>
            </View>
          ) : null}
          {hasAttachments ? (
            <View style={styles.attachmentWrap}>
              <Attachment images={item?.attachments} />
            </View>
          ) : null}
          {showTime ? (
            <Text style={[styles.timestamp, styles.timestampRight]}>
              {dayjs(item?.createdAt).format('hh:mm A')}
            </Text>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.incomingRow, rowSpacing]}>
      {showAvatar ? (
        <Avatar
          user={item?.user}
          bgColor={bgColor}
          size={AVATAR_SIZE}
          name={name}
        />
      ) : (
        <View style={styles.avatarSpacer} />
      )}
      <View style={styles.incomingColumn}>
        {showName && name ? (
          <Text numberOfLines={1} style={styles.senderName}>
            {name}
          </Text>
        ) : null}
        {hasContent ? (
          <View style={styles.incomingBubble}>
            <RenderHTML html={item?.content} />
          </View>
        ) : null}
        {hasAttachments ? (
          <View style={styles.attachmentWrap}>
            <Attachment images={item?.attachments} />
          </View>
        ) : null}
        {showTime ? (
          <Text style={[styles.timestamp, styles.timestampLeft]}>
            {dayjs(item?.createdAt).format('hh:mm A')}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
  // Incoming (operator) — avatar + bubble on the left.
  incomingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: messengerTheme.spacing.md,
    maxWidth: INCOMING_MAX,
    alignSelf: 'flex-start',
  },
  incomingColumn: {
    marginLeft: messengerTheme.spacing.sm,
    flexShrink: 1,
  },
  avatarSpacer: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
  senderName: {
    fontSize: 11,
    color: messengerTheme.colors.mutedText,
    fontWeight: '500',
    marginBottom: 3,
    marginLeft: 4,
  },
  incomingBubble: {
    backgroundColor: messengerTheme.colors.incomingBubble,
    paddingHorizontal: messengerTheme.spacing.md,
    paddingVertical: 8,
    borderRadius: messengerTheme.radius.bubble,
    borderBottomLeftRadius: messengerTheme.radius.tail,
    alignSelf: 'flex-start',
    ...messengerTheme.shadow.bubble,
  },

  // Outgoing (customer) — bubble pinned right.
  outgoingRow: {
    marginTop: messengerTheme.spacing.md,
    maxWidth: OUTGOING_MAX,
    alignSelf: 'flex-end',
  },
  outgoingColumn: {
    alignItems: 'flex-end',
  },
  outgoingBubble: {
    paddingHorizontal: messengerTheme.spacing.md,
    paddingVertical: 8,
    borderRadius: messengerTheme.radius.bubble,
    borderBottomRightRadius: messengerTheme.radius.tail,
    alignSelf: 'flex-end',
    ...messengerTheme.shadow.bubble,
  },
  outgoingText: {
    color: messengerTheme.colors.outgoingText,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },

  attachmentWrap: {
    marginTop: 4,
  },
  timestamp: {
    color: messengerTheme.colors.subtleText,
    fontSize: 10,
    marginTop: 4,
  },
  timestampLeft: {
    textAlign: 'left',
    marginLeft: 4,
  },
  timestampRight: {
    textAlign: 'right',
    marginRight: 2,
  },
});

const RenderHTML = React.memo(function RenderHTML({ html }: any) {
  const renderersProps = {
    a: {
      onPress(url: any) {
        Linking.openURL(url);
      },
    },
  };

  return (
    <HTML
      contentWidth={INCOMING_MAX - AVATAR_SIZE - 24}
      source={{ html }}
      baseStyle={{
        color: messengerTheme.colors.incomingText,
        fontSize: 14,
        lineHeight: 20,
      }}
      tagsStyles={{
        p: { color: messengerTheme.colors.incomingText, margin: 0 },
        a: { color: '#3B85F4' },
        li: { color: messengerTheme.colors.incomingText },
        ol: { color: messengerTheme.colors.incomingText },
        ul: { color: messengerTheme.colors.incomingText },
      }}
      ignoredDomTags={['meta', 'script', 'font', 'title']}
      ignoredStyles={['borderStyle']}
      renderersProps={renderersProps}
      defaultTextProps={{
        selectable: true,
        style: { color: messengerTheme.colors.incomingText },
      }}
    />
  );
});
