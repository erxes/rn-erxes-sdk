# Native iOS Guide

`ErxesNativeIOS` opens the native SwiftUI messenger from
[`Munkhorgilb/ios-sdk`](https://github.com/Munkhorgilb/ios-sdk) through this
package's React Native bridge.

Use this API when you want the native iOS messenger UI from React Native.

## Requirements

- iOS `16.0+`
- Swift `5.9+`
- CocoaPods
- Bare React Native app, or Expo development build/prebuild
- Expo development build/prebuild or bare React Native. Expo Go is not
  supported because it cannot load custom Swift native modules.

## Install

```bash
yarn add rn-erxes-sdk
```

```bash
cd ios
pod install
```

For Expo development builds:

```bash
npx expo prebuild
cd ios
pod install
cd ..
npx expo run:ios
```

## Configure

Call `configure` once before opening the messenger:

```tsx
import { ErxesNativeIOS } from 'rn-erxes-sdk';

await ErxesNativeIOS.configure({
  integrationId: 'YOUR_INTEGRATION_ID',
  subDomain: 'YOUR_SUBDOMAIN.next.erxes.io',
  primaryColor: '#3f78d9',
});
```

You can pass `endpoint` instead of `subDomain`:

```tsx
await ErxesNativeIOS.configure({
  integrationId: 'YOUR_INTEGRATION_ID',
  endpoint: 'https://YOUR_SUBDOMAIN.next.erxes.io',
});
```

## Identify a user

```tsx
await ErxesNativeIOS.setUser({
  email: 'user@example.com',
  phone: '+15551234567',
  name: 'Jane Doe',
  customData: {
    plan: 'pro',
    source: 'mobile',
  },
});
```

`customData` values are converted to strings before being sent to the native
bridge.

## Open the messenger

```tsx
await ErxesNativeIOS.showMessenger();
```

The native bridge presents the messenger from the current top-most iOS view
controller.

## Logout

Clear the current native messenger user on app logout:

```tsx
await ErxesNativeIOS.clearUser();
```

## Troubleshooting

### Native module is not linked

Run pods and rebuild the app:

```bash
cd ios
pod install
cd ..
npx react-native run-ios
```

For Expo, rebuild the development client:

```bash
npx expo run:ios
```

### Expo Go is not supported

`ErxesNativeIOS` will throw in Expo Go because Expo Go cannot load this
package's custom Swift native module. Build a development client for native iOS.
