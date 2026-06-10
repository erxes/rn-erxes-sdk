# Bare React Native Guide

Bare React Native apps can use both APIs:

- `<ErxesSDK />` for the cross-platform React Native renderer.
- `ErxesNativeIOS` for the native SwiftUI iOS messenger.

## Install

```bash
yarn add rn-erxes-sdk
yarn add react-native-get-random-values
yarn add @react-native-async-storage/async-storage
```

```bash
cd ios
pod install
```

## Cross-platform renderer

```tsx
import { Platform, View } from 'react-native';
import { ErxesSDK } from 'rn-erxes-sdk';

export function MessengerScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ErxesSDK
        integrationId="YOUR_INTEGRATION_ID"
        subDomain="YOUR_SUBDOMAIN.next.erxes.io"
        showWidget={false}
        properties={{
          url: 'https://YOUR_SUBDOMAIN.nextwidgets.erxes.io/',
          hostname: 'YOUR_SUBDOMAIN.nextwidgets.erxes.io',
          language: 'en-US',
          userAgent: Platform.OS,
        }}
      />
    </View>
  );
}
```

## Native iOS messenger

```tsx
import { ErxesNativeIOS } from 'rn-erxes-sdk';

await ErxesNativeIOS.configure({
  integrationId: 'YOUR_INTEGRATION_ID',
  subDomain: 'YOUR_SUBDOMAIN.next.erxes.io',
});

await ErxesNativeIOS.showMessenger();
```

The native iOS messenger requires iOS `16.0+`. Android should continue to use
`<ErxesSDK />`.
