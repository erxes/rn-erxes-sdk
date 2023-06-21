import React, { useEffect } from 'react';
import { ApolloProvider } from '@apollo/client';
import ClientProvider from './graphql/apolloClient';
import Widget from './Widget';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import ConversationDetail from './screen/conversation/ConversationDetail';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getVisitorId } from './utils/utils';

export type PropTypes = {
  brandCode: string;
  email?: string;
  hasBack?: boolean;
  onBack?: () => void;
};

const ErxesSDK: React.FC<PropTypes> = ({
  brandCode,
  email,
  hasBack = false,
  onBack = () => {},
}) => {
  const RootStack = createStackNavigator();

  const [connection, setConnection] = React.useState<any>({
    cachedCustomerId: null,
    visitorId: null,
  });

  const props = { brandCode, email, hasBack, onBack, connection };

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
      const fetchData = async () => {
        visitorId = await getVisitorId();
      };

      // call the function
      fetchData()
        // make sure to catch any error
        .catch(console.error);
    }
    setConnection({
      cachedCustomerId: tempCustomerId,
      visitorId,
    });
  }, []);

  return (
    <ApolloProvider client={ClientProvider()}>
      <NavigationContainer>
        <RootStack.Navigator>
          <RootStack.Screen
            name="Widget"
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          >
            {(rest: any) => <Widget {...rest} {...props} />}
          </RootStack.Screen>
          <RootStack.Screen
            name="ConversationDetail"
            component={ConversationDetail}
            options={{
              headerShown: false,
              cardStyleInterpolator: ({ current }) => ({
                cardStyle: {
                  opacity: current.progress,
                },
              }),
            }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
};

export default ErxesSDK;
