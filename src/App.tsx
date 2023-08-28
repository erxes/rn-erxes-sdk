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
};

const ErxesSDK: React.FC<PropTypes> = ({
  brandCode,
  email = null,
  onBack = () => {},
  showWidget = false,
  backIcon,
  newChatIcon,
  sendIcon,
  phone,
  data,
  subDomain,
}) => {
  const [connection, setConnection] = React.useState<any>({
    cachedCustomerId: null,
    visitorId: null,
  });

  const [show, setShow] = React.useState<boolean>(showWidget);

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
    // launcherOptions
    show,
    setShow,
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

  if (!connection?.cachedCustomerId && !connection?.visitorId) {
    return null;
  }

  return (
    <ApolloContainer subDomain={subDomain}>
      <Widget {...props} />
    </ApolloContainer>
  );
};

export default ErxesSDK;
