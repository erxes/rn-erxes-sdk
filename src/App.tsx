import 'react-native-get-random-values';
import React, { useEffect } from 'react';
import { ApolloProvider } from '@apollo/client';
import ClientProvider from './graphql/apolloClient';
import Widget from './Widget';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ObjectId } from 'bson';
import FormWidget from './FormWidget';

export type PropTypes = {
  brandCode: string;
  email?: string;
  hasBack?: boolean;
  onBack?: () => void;
  formCode?: string;
  onSuccess?: any;
  onError?: any;
};

const ErxesSDK: React.FC<PropTypes> = ({
  brandCode,
  email = null,
  hasBack = false,
  onBack = () => {},
  formCode = null,
  onSuccess,
  onError,
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
    setConnection,
    formCode,
    onSuccess,
    onError,
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

  return (
    <ApolloProvider client={ClientProvider()}>
      {formCode ? <FormWidget {...props} /> : <Widget {...props} />}
    </ApolloProvider>
  );
};

export default ErxesSDK;
