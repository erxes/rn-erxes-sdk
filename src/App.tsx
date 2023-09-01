import 'react-native-get-random-values';
import React, { useEffect } from 'react';
import Widget from './Widget';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ObjectId } from 'bson';
import ApolloContainer from './graphql/ApolloContainer';

export type PropTypes = {
  brandCode: string;
  subDomain: string;
  showWidget: boolean;
  email?: string;
  onBack?: () => void;
  backIcon?: any;
  newChatIcon?: any;
  sendIcon?: any;
  phone?: any;
  data?: any;
  properties?: any;
};

const ErxesSDK: React.FC<PropTypes> = ({
  brandCode,
  subDomain,
  email = null,
  onBack = () => {},
  showWidget = false,
  backIcon,
  newChatIcon,
  sendIcon,
  phone,
  data,
  properties,
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [connection, setConnection] = React.useState<any>({
    cachedCustomerId: null,
    visitorId: null,
  });
  const [cachedConversationId, setCachedConversationId] =
    React.useState<any>(null);
  const [show, setShow] = React.useState<boolean>(showWidget);

  useEffect(() => {
    let visitorId: any;
    let tempCustomerId = '';
    setLoading(true);
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
        AsyncStorage.getItem('conversationId')
          .then((v) => {
            if (v !== null) {
              setCachedConversationId(v);
            }
            setLoading(false);
          })
          .catch((e) => {
            setLoading(false);
            console.log('Failed on cachedConversationId', e.message);
          });
      })
      .catch((e) => {
        setConnection({
          cachedCustomerId: null,
          visitorId: new ObjectId(),
        });
        setLoading(false);
        console.log('Failed on cachedCustomerId', e.message);
      });
  }, []);

  if (!connection?.cachedCustomerId && !connection?.visitorId) {
    return null;
  }

  if (loading) {
    return null;
  }

  const props = {
    brandCode,
    subDomain,
    email,
    onBack,
    connection,
    setConnection,
    showWidget,
    // icons
    backIcon,
    newChatIcon,
    sendIcon,
    // tracking
    phone,
    data,
    properties,
    // launcherOptions
    show,
    setShow,
    //
    cachedConversationId,
  };

  return (
    <ApolloContainer subDomain={subDomain}>
      <Widget {...props} />
    </ApolloContainer>
  );
};

export default ErxesSDK;
