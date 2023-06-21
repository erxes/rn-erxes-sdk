import 'react-native-get-random-values';
import React, { useEffect } from 'react';
import { ApolloProvider } from '@apollo/client';
import ClientProvider from './graphql/apolloClient';
import Widget from './Widget';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ObjectId } from 'bson';

export type PropTypes = {
  brandCode: string;
  email?: string;
  hasBack?: boolean;
  onBack?: () => void;
  backIcon?: any;
  newChatIcon: any;
};

const ErxesSDK: React.FC<PropTypes> = ({
  brandCode,
  email = null,
  hasBack = false,
  onBack = () => {},
  backIcon,
  newChatIcon,
}) => {
  const [connection, setConnection] = React.useState<any>({
    cachedCustomerId: null,
    visitorId: null,
  });

  const props = {
    brandCode,
    email,
    hasBack,
    onBack,
    connection,
    backIcon,
    newChatIcon,
  };

  useEffect(() => {
    let visitorId;
    let tempCustomerId = '';
    AsyncStorage.getItem('clockId')
      .then((value) => {
        if (value !== null) {
          tempCustomerId = value;
        }
      })
      .catch((e) => {
        console.log('checkIntro', e.message);
      });
    if (!tempCustomerId) {
      // declare the data fetching function
      visitorId = new ObjectId();
    }
    setConnection({
      cachedCustomerId: tempCustomerId ? tempCustomerId : null,
      visitorId: visitorId?.toString(),
    });
  }, []);

  return (
    <ApolloProvider client={ClientProvider()}>
      <Widget {...props} />
    </ApolloProvider>
  );
};

export default ErxesSDK;
