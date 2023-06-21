import { View, StyleSheet } from 'react-native';
import React from 'react';
import { useMutation } from '@apollo/client';
import { connect } from './graphql/mutation';
import Greetings from './screen/greetings/Greetings';
import Conversations from './screen/conversation/Conversations';

const Widget = (props: any) => {
  const {
    brandCode,
    email,
    hasBack,
    onBack,
    connection,
    backIcon,
    newChatIcon,
  } = props;
  const [response, setResponse] = React.useState<any>(null);

  const [connectMutation] = useMutation(connect);

  React.useEffect(() => {
    connectMutation({
      variables: {
        brandCode,
        email,
        cachedCustomerId: connection?.cachedCustomerId,
        visitorId: connection?.visitorId,
        // if client passed email automatically then consider this as user
        isUser: Boolean(email),
      },
    })
      .then((res: any) => {
        setResponse(res);
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bgColor =
    response?.data?.widgetsMessengerConnect?.uiOptions?.color || '#5629b6';
  const integrationId = response?.data?.widgetsMessengerConnect?.integrationId;
  const brand = response?.data?.widgetsMessengerConnect?.brand;
  const textColor =
    response?.data?.widgetsMessengerConnect?.uiOptions?.textColor || '#fff';

  if (!integrationId) {
    return null;
  }

  const greetingProps = {
    greetings: response?.data?.widgetsMessengerConnect?.messengerData,
    integrationId,
    hasBack,
    onBack,
    backIcon,
    bgColor,
    textColor,
    brand,
  };

  const conversationProps = {
    customerId: connection?.cachedCustomerId,
    visitorId: connection?.visitorId,
    integrationId,
    bgColor,
    brand,
    newChatIcon,
    textColor,
  };

  return (
    <View style={styles.container}>
      <Greetings {...greetingProps} />
      <Conversations {...conversationProps} />
    </View>
  );
};

export default Widget;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
