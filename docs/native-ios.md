# Native iOS Guide

`ErxesNativeIOS` bridges the native SwiftUI erxes messenger
([`erxes/erxes-ios-sdk`](https://github.com/erxes/erxes-ios-sdk) `0.30.14`)
into your React Native app.

> **Most apps should use the `<ErxesMessenger />` component instead** — it wraps
> this bridge and manages configure, user identity, action taps, and the show/hide
> lifecycle declaratively. See the [README](../README.md#usage--erxesmessenger-recommended).
> This guide documents the low-level `ErxesNativeIOS` API for advanced/imperative use.

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

## Chat mode (`displayMode: 'chat'`)

Set `displayMode: 'chat'` to present an AI-assistant-style full-screen shell
instead of the classic 4-tab sheet widget. In chat mode the messenger opens
**itself** full-screen as soon as the connect handshake succeeds — there is no
floating launcher, so `showLauncher()` is a no-op (the messenger is already up).
Omit `displayMode` (or pass `'classic'`) to keep the classic widget.

### Header / drawer actions

Chat mode can render host-configurable actions in the header (`homeActions`) and
the left drawer (`drawerActions`). Actions cross the JS↔native bridge as **plain
data** (`id`, `title`, `systemIcon`) — never as functions. Tapping an action
fires a single native event carrying just the tapped `id`; your JS code decides
what happens (navigate, open a modal, etc.) by switching on that `id`.

Use `ErxesNativeIOS.addActionListener` to subscribe — it returns a subscription
you `.remove()` on cleanup.

```tsx
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ErxesNativeIOS } from 'rn-erxes-sdk';

function App() {
  const navigation = useNavigation();

  useEffect(() => {
    // 1. Configure with data-only action descriptors (id/title/icon — no functions)
    ErxesNativeIOS.configure({
      integrationId: 'YOUR_INTEGRATION_ID',
      subDomain: 'yourcompany.erxes.io',
      displayMode: 'chat',
      homeActions: [
        { id: 'orders', title: 'My Orders', systemIcon: 'bag' },
        { id: 'profile', title: 'Profile', systemIcon: 'person' },
      ],
      drawerActions: [
        { id: 'settings', title: 'Settings', systemIcon: 'gearshape' },
      ],
    });

    // 2. Listen for taps — native only ever sends the id back
    const sub = ErxesNativeIOS.addActionListener((id) => {
      switch (id) {
        case 'orders':
          navigation.navigate('Orders');
          break;
        case 'profile':
          navigation.navigate('Profile');
          break;
        case 'settings':
          openSettingsModal(); // your own modal trigger
          break;
      }
    });

    return () => sub.remove();
  }, [navigation]);

  return null;
}
```

`systemIcon` is an [SF Symbol](https://developer.apple.com/sf-symbols/) name
(e.g. `"bag"`, `"gearshape"`).

---

## Voice messages

In chat mode the messenger supports **voice messages** (audio playback) and
**speech-to-text** dictation in the composer. These use the microphone and speech
recognition, so your host app must declare the matching usage descriptions in its
`Info.plist`:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>Record voice messages in support chat.</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>Transcribe your voice into chat messages.</string>
```

For Expo, add them under `ios.infoPlist` in `app.json`:

```json
{
  "ios": {
    "infoPlist": {
      "NSMicrophoneUsageDescription": "Record voice messages in support chat.",
      "NSSpeechRecognitionUsageDescription": "Transcribe your voice into chat messages."
    }
  }
}
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
