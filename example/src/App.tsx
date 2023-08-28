import * as React from 'react';
import { View } from 'react-native';
import { ErxesSDK } from 'rn-erxes-sdk';

export default function App() {
  const brandCode = '5fkS4v';
  const subDomain = 'office.erxes.io';
  return (
    <View style={{ flex: 1 }}>
      <ErxesSDK
        brandCode={brandCode}
        subDomain={subDomain}
        onBack={() => console.log('onBack')}
        showWidget={false}
      />
    </View>
  );
}
