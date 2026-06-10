# Expo Guide

`rn-erxes-sdk` supports two Expo paths:

| API | Works in Expo Go | Requires development build |
| --- | --- | --- |
| `<ErxesSDK />` | Yes | No |
| `ErxesNativeIOS` | No | Yes |

## Expo Go / managed Expo

Use the cross-platform React Native renderer:

```bash
npx create-expo-app@latest rn-erxes-sdk-test
cd rn-erxes-sdk-test

yarn add rn-erxes-sdk
npx expo install @react-native-async-storage/async-storage
yarn add react-native-get-random-values

npx expo start --clear
```

Render the component:

```tsx
import { Platform, View } from 'react-native';
import { ErxesSDK } from 'rn-erxes-sdk';

export default function App() {
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

## Expo development build / prebuild

Use this path when you need `ErxesNativeIOS`.

```bash
yarn add rn-erxes-sdk
npx expo prebuild
cd ios
pod install
cd ..
npx expo run:ios
```

Then call the native API:

```tsx
import { ErxesNativeIOS } from 'rn-erxes-sdk';

await ErxesNativeIOS.configure({
  integrationId: 'YOUR_INTEGRATION_ID',
  subDomain: 'YOUR_SUBDOMAIN.next.erxes.io',
});

await ErxesNativeIOS.showMessenger();
```

The native iOS path requires iOS `16.0+` and does not run in Expo Go.
