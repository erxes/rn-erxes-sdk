/* eslint-disable react-native/no-inline-styles */
import { View, Text, StyleSheet, Dimensions, Linking } from 'react-native';
import React from 'react';
import dayjs from 'dayjs';
import HTML from 'react-native-render-html';
import { strip_html } from '../../utils/utils';
import Attachment from './Attachment';
import Avatar from '../../components/Avatar';

const { width } = Dimensions.get('window');

const Message = (props: any) => {
  const { item, bgColor } = props;

  const position = item?.customerId ? 'right' : 'left';

  const renderContent = () => {
    const strippedContent = strip_html(item?.content || '');
    if (strippedContent?.length === 0) {
      return null;
    }
    return <RenderHTML html={item?.content} />;
  };

  return (
    <View style={[customStyles[position].container]}>
      {position === 'left' ? (
        <Avatar user={item?.user} bgColor={bgColor} />
      ) : null}
      <View>
        <View
          style={[
            styles.contentStyle,
            {
              backgroundColor: position === 'left' ? '#E7F2F7FF' : bgColor,
              borderBottomLeftRadius: position === 'left' ? 0 : 20,
              borderBottomRightRadius: position === 'left' ? 20 : 0,
            },
          ]}
        >
          {position === 'left' ? (
            renderContent()
          ) : (
            <Text style={{ paddingVertical: 12 }}>{item?.content}</Text>
          )}
          {item?.attachments?.length > 0 ? (
            <Attachment images={item?.attachments} />
          ) : null}
        </View>
        <Text
          style={{
            color: '#686868',
            fontSize: 12,
            textAlign: position === 'left' ? 'left' : 'right',
          }}
        >
          {dayjs(item?.createdAt).format('hh:mm A')}
        </Text>
      </View>
    </View>
  );
};

export default Message;

const customStyles = {
  left: StyleSheet.create({
    container: {
      justifyContent: 'flex-start',
      marginLeft: 0,
      marginRight: 0,
      marginTop: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
  }),
  right: StyleSheet.create({
    container: {
      justifyContent: 'flex-end',
      marginLeft: 0,
      marginRight: 0,
      marginTop: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
  }),
} as any;

const styles = StyleSheet.create({
  contentStyle: {
    paddingHorizontal: 15,
    maxWidth: width * 0.8,
    marginVertical: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 90,
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
      contentWidth={width - 150}
      source={{
        html: html,
      }}
      tagsStyles={{
        p: { color: '#686868' },
        a: { color: '#3B85F4' },
        li: { color: '#3B85F4' },
        ol: { color: '#686868' },
      }}
      ignoredDomTags={['meta', 'script', 'font', 'title']}
      ignoredStyles={['borderStyle']}
      renderersProps={renderersProps}
      defaultTextProps={{
        style: {
          color: '#000',
        },
      }}
    />
  );
});
