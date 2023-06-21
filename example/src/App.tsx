import * as React from 'react';
import { ErxesSDK } from 'rn-erxes-sdk';

export default function App() {
  const brandCode = '5fkS4v';
  return (
    <ErxesSDK
      brandCode={brandCode}
      hasBack={true}
      onBack={() => console.log('onBack')}
    />
  );
}
