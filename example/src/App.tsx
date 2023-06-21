import * as React from 'react';
import { ErxesSDK } from 'rn-erxes-sdk';

export default function App() {
  const brandCode = 'RjcXwk';
  return (
    <ErxesSDK
      brandCode={brandCode}
      hasBack={true}
      onBack={() => console.log('onBack')}
    />
  );
}
