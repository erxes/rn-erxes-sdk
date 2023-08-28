/* eslint-disable react-native/no-inline-styles */
import { View, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { connect } from './graphql/mutation';
import Greetings from './screen/greetings/Greetings';
import Conversations from './screen/conversation/Conversations';
import AppContext from './context/Context';
import ConversationDetail from './screen/conversation/ConversationDetail';
import { TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import images from './assets/images';

const Widget = (props: any) => {
  const {
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
    // phone,
    // data,
    //launcherOption
    show,
    setShow,
    //domain
    subDomain,
  } = props;

  const [visibleLauncher, setVisibleLauncher] = React.useState<boolean>(false);
  const [response, setResponse] = React.useState<any>(null);
  const [conversationId, setConversationId] = React.useState<string | null>(
    null
  );

  const [connectMutation] = useMutation(connect);

  useEffect(() => {
    console.log(connection);
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
        const showLauncher =
          res?.data?.widgetsMessengerConnect?.messengerData?.showLauncher;
        setVisibleLauncher(showLauncher);
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const integrationId = response?.data?.widgetsMessengerConnect?.integrationId;

  if (!visibleLauncher || !integrationId) {
    return null;
  }

  if (show) {
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={[
            styles.widget,
            {
              display: visibleLauncher ? 'flex' : 'none',
            },
          ]}
          onPress={() => setShow(false)}
        >
          <Image
            source={images.logo}
            style={styles.image}
            resizeMode="contain"
          />
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
        // Icons
        backIcon,
        newChatIcon,
        sendIcon,
        //domain
        subDomain,
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
});
