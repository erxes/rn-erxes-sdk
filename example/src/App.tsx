import * as React from 'react';
import { Button, View } from 'react-native';
import { ErxesNativeIOS } from 'rn-erxes-sdk';

export default function App() {
  const integrationId = '1234567890abcdef';
  const subDomain = 'officenext.erxes.io';

  React.useEffect(() => {
    ErxesNativeIOS.configure({
      integrationId,
      subDomain,
    });

    ErxesNativeIOS.setUser({
      email: 'primaryEmailTest@gmail.com',
      phone: '94205640',
      name: 'First-Name Last-Name',
      customData: {
        Type: 'mobile',
        Register_number: 'Register_number',
      },
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Button
        title="Open messenger"
        onPress={() => {
          ErxesNativeIOS.showMessenger();
        }}
      />
    </View>
  );
}
