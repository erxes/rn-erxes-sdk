import { View, StyleSheet } from 'react-native';
import React from 'react';
import { useMutation } from '@apollo/client';
import { connect } from './graphql/mutation';
import Greetings from './screen/greetings/Greetings';
import Conversations from './screen/conversation/Conversations';
import AppContext from './context/Context';
import ConversationDetail from './screen/conversation/ConversationDetail';

const Widget = (props: any) => {
  const {
    brandCode,
    email,
    onBack,
    connection,
    setConnection,
    showWidget,
    setShow,
  } = props;

  const [response, setResponse] = React.useState<any>(null);
  const [conversationId, setConversationId] = React.useState<string | null>(
    null
  );

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

  const integrationId = response?.data?.widgetsMessengerConnect?.integrationId;

  if (!integrationId) {
    return null;
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
        bgColor:
          response?.data?.widgetsMessengerConnect?.uiOptions?.color ||
          '#5629b6',
        textColor:
          response?.data?.widgetsMessengerConnect?.uiOptions?.textColor ||
          '#fff',
        //Datas
        brand: response?.data?.widgetsMessengerConnect?.brand,
        greetings: response?.data?.widgetsMessengerConnect?.messengerData,
        integrationId,
        //Conversation
        conversationId,
        setConversationId,
        // Connection
        setConnection,

        //
        setShow,
      }}
    >
      <View style={styles.container}>
        {conversationId !== null ? (
          <ConversationDetail />
        ) : (
          <>
            <Greetings />
            <Conversations />
          </>
        )}
      </View>
    </AppContext.Provider>
  );
};

export default Widget;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
