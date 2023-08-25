/* eslint-disable react-native/no-inline-styles */
import 'react-native-get-random-values';
import React, { useEffect } from 'react';
import { ApolloProvider } from '@apollo/client';
import ClientProvider from './graphql/apolloClient';
import Widget from './Widget';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ObjectId } from 'bson';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import images from './assets/images';

export type PropTypes = {
  brandCode: string;
  email?: string;
  onBack?: () => void;
  showWidget: boolean;
  backIcon?: any;
  newChatIcon?: any;
  sendIcon?: any;
};

const ErxesSDK: React.FC<PropTypes> = ({
  brandCode,
  email = null,
  onBack = () => {},
  showWidget = false,
  backIcon,
  newChatIcon,
  sendIcon,
}) => {
  const [connection, setConnection] = React.useState<any>({
    cachedCustomerId: null,
    visitorId: null,
  });

  const [show, setShow] = React.useState<boolean>(showWidget);

  const props = {
    brandCode,
    email,
    onBack,
    connection,
    setConnection,
    showWidget,
    setShow,
    // icons
    backIcon,
    newChatIcon,
    sendIcon,
  };

  useEffect(() => {
    let visitorId: any;
    let tempCustomerId = '';
    AsyncStorage.getItem('cachedCustomerId')
      .then((value) => {
        if (value !== null) {
          tempCustomerId = JSON.parse(value);
        }
        if (!tempCustomerId) {
          // declare the data fetching function
          visitorId = new ObjectId();
        }
        setConnection({
          cachedCustomerId: tempCustomerId ? tempCustomerId : null,
          visitorId: visitorId?.toString(),
        });
      })
      .catch((e) => {
        console.log('checkIntro', e.message);
      });
  }, []);

  if (show) {
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={[styles.widget]}
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
    <ApolloProvider client={ClientProvider()}>
      <Widget {...props} />
    </ApolloProvider>
  );
};

export default ErxesSDK;

const styles = StyleSheet.create({
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
