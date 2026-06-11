# Native iOS Guide

`ErxesNativeIOS` bridges the native SwiftUI erxes messenger
([`erxes/erxes-ios-sdk`](https://github.com/erxes/erxes-ios-sdk) `0.30.0`)
into your React Native app.

## Requirements

| | |
|---|---|
| iOS | 16.0+ |
| Swift | 5.9+ |
| React Native | 0.81+ |
| Expo SDK | 53+ (development build or prebuild only — Expo Go not supported) |

---

## Installation

### Bare React Native

```bash
yarn add rn-erxes-sdk
cd ios && pod install
```

### Expo

Expo Go cannot load custom native modules. You need a development build or prebuild.

```bash
npx expo install rn-erxes-sdk expo-build-properties
```

Set the minimum iOS deployment target in `app.json`:

```json
{
  "plugins": [
    ["expo-build-properties", { "ios": { "deploymentTarget": "16.0" } }]
  ]
}
```

Prebuild and install pods:

```bash
npx expo prebuild --platform ios
cd ios && pod install
npx expo run:ios
```

---

## Setup

Call `configure` once at app startup (e.g. inside `useEffect` in your root component). This starts the connection handshake in the background so the messenger is ready instantly when the user opens it.

```tsx
import { ErxesNativeIOS } from 'rn-erxes-sdk';

ErxesNativeIOS.configure({
  integrationId: 'YOUR_INTEGRATION_ID',
  subDomain: 'yourcompany.erxes.io',
});
```

You can pass `endpoint` instead of `subDomain`:

```tsx
ErxesNativeIOS.configure({
  integrationId: 'YOUR_INTEGRATION_ID',
  endpoint: 'https://yourcompany.erxes.io',
});
```

Optionally identify the logged-in user:

```tsx
ErxesNativeIOS.setUser({
  email: 'user@example.com',
  phone: '+15551234567',
  name: 'Jane Doe',
  customData: { plan: 'pro' }, // any key-value pairs
});
```

---

## Showing the messenger

There are two ways to let users open the messenger. Pick one.

### Option A — Floating launcher button (recommended)

Call `showLauncher()` after `configure()`. A draggable floating button appears on screen automatically once the SDK connects. The user taps it to open the messenger. No extra code needed.

```tsx
ErxesNativeIOS.configure({ integrationId, subDomain });
ErxesNativeIOS.showLauncher();
```

To remove the launcher (e.g. on certain screens or after logout):

```tsx
ErxesNativeIOS.hideLauncher();
```

### Option B — Your own button

If you have a custom button, tab, or trigger in your own UI, call `showMessenger()` directly. Skip `showLauncher()`.

```tsx
ErxesNativeIOS.configure({ integrationId, subDomain });

// somewhere in your UI:
<Button title="Support" onPress={() => ErxesNativeIOS.showMessenger()} />
```

---

## Logout

Clear the user when they log out of your app:

```tsx
ErxesNativeIOS.clearUser();
```

---

## Full example

```tsx
import React, { useEffect } from 'react';
import { View, Button } from 'react-native';
import { ErxesNativeIOS } from 'rn-erxes-sdk';

export default function App() {
  useEffect(() => {
    ErxesNativeIOS.configure({
      integrationId: 'YOUR_INTEGRATION_ID',
      subDomain: 'yourcompany.erxes.io',
      primaryColor: '#3f78d9',
    });

    ErxesNativeIOS.setUser({
      email: 'user@example.com',
      name: 'Jane Doe',
    });

    // Show floating launcher — remove this if you use your own button instead
    ErxesNativeIOS.showLauncher();
  }, []);

  return <View style={{ flex: 1 }} />;
}
```

---

## Troubleshooting

**Native module not found** — run `pod install` and rebuild:
```bash
cd ios && pod install
npx react-native run-ios   # or: npx expo run:ios
```

**Expo Go** — not supported. Build a development client with `npx expo run:ios`.
