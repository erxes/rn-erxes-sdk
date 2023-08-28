import * as React from 'react';
import { View } from 'react-native';
import { ErxesSDK } from 'rn-erxes-sdk';

export default function App() {
  const brandCode = '5fkS4v';
  const subDomain = 'office.erxes.io';

  const data = {
    firstName: 'First-Name',
    lastName: 'Last-Name',
    primaryEmail: 'primaryEmailTest@gmail.com',
    sex: '1',
    Type: 'mobile',
    Register_number: 'Register_number',
  };

  const properties = {
    remoteAddress: '100.200.300.40/20',
    region: 'Ulaanbaatar',
    countryCode: 'MN',
    city: 'Ulaanbaatar',
    country: 'Mongolia',
    hostname: 'https:office.erxes.io',
    language: 'en-US',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
  };

  return (
    <View style={{ flex: 1 }}>
      <ErxesSDK
        brandCode={brandCode}
        subDomain={subDomain}
        onBack={() => console.log('onBack')}
        showWidget={true}
        phone="94205640"
        data={data}
        properties={properties}
      />
    </View>
  );
}
