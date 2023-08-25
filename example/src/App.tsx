import * as React from 'react';
import { View } from 'react-native';
import { ErxesSDK } from 'rn-erxes-sdk';

export default function App() {
  const brandCode = '5fkS4v';
  return (
    <View style={{ flex: 1 }}>
      <ErxesSDK
        brandCode={brandCode}
        onBack={() => console.log('onBack')}
        showWidget={false}
      />
    </View>
  );
}
