import * as React from 'react';
import { ErxesSDK } from 'rn-erxes-sdk';

export default function App() {
  const brandCode = 'iJmCpL';
  // const brandCode = '5fkS4v';
  const formCode = 'sBWBXA';
  return (
    <ErxesSDK
      brandCode={brandCode}
      hasBack={true}
      onBack={() => console.log('onBack')}
      formCode={formCode}
    />
  );
}
