import 'react-native-get-random-values';
import React, { useEffect } from 'react';
import Widget from './Widget';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createObjectIdLikeString } from './utils/objectId';
import ApolloContainer from './graphql/ApolloContainer';

export type PropTypes = {
  integrationId: string;
  brandCode?: string;
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
  integrationId,
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
    let visitorId: string | undefined;
    let tempCustomerId = '';
    setLoading(true);
    AsyncStorage.getItem('cachedCustomerId')
      .then((value) => {
        if (value !== null) {
          tempCustomerId = JSON.parse(value);
        }
        if (!tempCustomerId) {
          // mint a guest visitor id (24-char hex, same shape as a Mongo ObjectId)
          visitorId = createObjectIdLikeString();
        }
        setConnection({
          cachedCustomerId: tempCustomerId ? tempCustomerId : null,
          visitorId: visitorId,
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
          visitorId: createObjectIdLikeString(),
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
    integrationId: integrationId || brandCode,
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
