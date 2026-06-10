<br>

<p align="center">
 <img src="docs/static/img/logo_dark.svg" alt="erxes logo" width="20%" />
</p>

<p align="center">An open-source Hubspot/Qualtrics alternative enables SaaS providers and digital marketing agencies/developers to create unique experiences for their entire business
</p>

<p align="center">
  <a href="https://erxes.io/resource-center">Docs</a>
  |
  <a href="https://xosdemo.erxes.io/">Demo</a>
  |
  <a href="https://erxes.io/">Website</a>
  |
  <a href="https://erxes.io/invest">Invest</a>
  </p>
</p>

<p align="center">
   <a href="https://github.com/erxes/erxes/blob/master/LICENSE.md">
      <img alt="License Badge" src="https://img.shields.io/badge/license-AGPLv3-brightgreen">
  </a>
  <a href="#">
      <img alt="Docker Pulls" src="https://img.shields.io/docker/pulls/erxes/erxes">
  </a>
  <a href="https://www.figma.com/@erxes" target="_blank">
      <img alt="Figma" src="https://img.shields.io/badge/Figma-Design%20System-blueviolet">
  </a>
   <a href="https://docs.erxes.io/docs/contribute/overview">
      <img alt="Help Wanted" src="https://img.shields.io/badge/Help%20Wanted-Contribute-blue">
  </a>
   <a href="https://github.com/erxes/erxes/stargazers">
      <img alt="Stars" src="https://img.shields.io/badge/Stars-%202.7k-orange">
  </a>
   <a href="https://discord.com/invite/aaGzy3gQK5">
      <img alt="Discord" src="https://img.shields.io/badge/Discord-%20Community-blueviolet">
  </a>
   <a href="https://explore.transifex.com/erxes-inc/erxes/">
      <img alt="Transfix" src="https://img.shields.io/badge/translations-contribute-brightgreen">
  </a>
   <a href="https://ossrank.com/p/416">
      <img alt="Ossrank" src="https://shields.io/endpoint?url=https://ossrank.com/shield/416">
  </a>
   <a href="https://twitter.com/erxeshq">
      <img alt="Twitter" src="https://img.shields.io/badge/twitter-blue">
  </a>
</p>

<p align="center">
 <a href="https://erxes.io" target="_blank" rel="noopener noreferrer"><img src="https://erxes-docs.s3.us-west-2.amazonaws.com/xos.jpeg" width="100%" alt="erxes: Free and open fair-code licensed experience operating system (XOS)">
</a>
</p>

Achieving growth and unity within your company is possible with erxes, because it is:

- **100% free & sustainable:** erxes offers a sustainable business model in which both developers and users win. It is open-source software, but even better.
- **100% customizable:** Our plugin-based architecture provides unlimited customization and lets you meet all your needs, no matter how specific they are.
- **100% privacy:** We've designed the erxes platform to retain complete control over your company's sensitive data with no third-party monitoring.
- **100% in control:** You can build any experience you want, where all the channels your business operates on are connected and integrated.

## What does erxes mean? How do you pronounce it?

erxes (pronounced 'erk-sis') means "heavenly bodies" in Mongolian. It is branded as “erxes” with all lowercase letters.

## What is erxes?

erxes is a secure, self-hosted, and scalable open-source experience operating system (XOS) that enables SaaS providers and digital marketing agencies/developers to create unique experiences that work for all types of business. You can learn more about **<a href="https://docs.erxes.io/docs/introduction/architecture">erxes architecture in our documentation</a>.**

## erxes XOS & Plugins

erxes is composed of 2 main components: **XOS** & **Plugins**

**XOS:** It contains the project's core. You can find the admin panel and the code that runs different plugins. The operating system comes with utility features that allow users to customize, improve speed, and enhance the experience along with plugins/features.

**Plugins:** erxes comes with a set of plugins that allow you to create unique customer experiences. Below is a list of some plugins you can choose from our **<a href="https://erxes.io/marketplace" >marketplace</a>** after you’ve finished installing erxes XOS:

- **Team Inbox** - Combine real-time client and team communication with in-app messaging, live chat, email, and form, so your customers can reach you, however, and whenever they want.<img src="https://s3.amazonaws.com/erxes/github/features-transparent.png" width="400" align="right" style="max-width: 50%">
- **Messenger** - Enable businesses to capture every single customer feedback and educate customers through knowledge-base right from the erxes Messenger.
- **Sales Management** - Easy and clear sales funnels allow you to control your sales pipeline from one responsive field by precisely analyzing your progress and determining your next best move for success.
- **Lead generation** - Turn regular visitors into qualified leads by capturing them with a customizable landing page, forms, pop-up, or embed placements.
- **Engage** - Start converting your prospects into potential customers through email, SMS, messenger, or more interactions to drive them to a successful close.
- **Contact Management** - Access our all-in-one CRM system in one go, so it’s easier to coordinate and manage your customer interactions.
- **Knowledgebase** - Educate your customers and staff by creating a help center related to your brands, products, and services to reach a higher level of satisfaction.
- **Task Management** - Create a more collaborative, self-reliant and cross-linked team. **<a href="https://erxes.io/marketplace" >See more on our website</a>**.

## Usage

<img src="https://raw.githubusercontent.com/erxes/rn-erxes-sdk/main/MOBILE-SDK.png" alt="rn-erxes-sdk messenger screenshot" width="350">

---

# rn-erxes-sdk

A React Native SDK for embedding the [erxes](https://erxes.io/) messenger experience inside a mobile application. It renders the erxes messenger UI, connects the visitor/customer to your erxes messenger integration, and handles conversations, unread counts, and message subscriptions for you.

## Which API should I use?

| API | Expo Go | Expo development build / prebuild | Bare React Native | Platforms |
| --- | --- | --- | --- | --- |
| `<ErxesSDK />` | Yes | Yes | Yes | iOS and Android |
| `ErxesNativeIOS` | No | Yes | Yes | iOS only |

Use `<ErxesSDK />` for the cross-platform React Native messenger. Use
`ErxesNativeIOS` only when you specifically want the native SwiftUI iOS
messenger from [`Munkhorgilb/ios-sdk`](https://github.com/Munkhorgilb/ios-sdk).

Native iOS requirements:

- iOS `16.0+`
- Swift `5.9+`
- CocoaPods
- Expo development build/prebuild or bare React Native. Native modules do not
  run in Expo Go.

## Docs

- [Expo guide](docs/expo.md)
- [Native iOS guide](docs/native-ios.md)
- [Bare React Native guide](docs/bare-react-native.md)

## Installation

Install the SDK:

```bash
yarn add rn-erxes-sdk
```

```bash
npm install --save rn-erxes-sdk
```

These commands install the latest version published to **npm**. To install or
upgrade to a specific version, pin it explicitly:

```bash
yarn add rn-erxes-sdk@0.1.26
```

```bash
npm i rn-erxes-sdk@0.1.26
```

Pushing code to GitHub does **not** automatically update the npm package — a new version must be published explicitly (see [Maintainer workflow](#maintainer-workflow)).

## Peer dependencies

The React Native renderer relies on the following packages in the host app:

```bash
npx expo install @react-native-async-storage/async-storage
yarn add react-native-get-random-values
```

npm equivalent:

```bash
npx expo install @react-native-async-storage/async-storage
npm install --save react-native-get-random-values
```

- **`@react-native-async-storage/async-storage`** — required. Used to cache the customer id and conversation id between launches.
- **`react-native-get-random-values`** — required. The SDK imports it internally to polyfill `crypto.getRandomValues`, which is used to generate a guest visitor id. It must be present in the host app's dependency tree.

Optional attachment picker:

```bash
npx expo install expo-image-picker
```

- **`expo-image-picker`** — optional. If installed, the messenger lets users attach images from their library. The SDK loads it lazily, so the attachment button is simply hidden when it is not installed. (Bare React Native apps may use `react-native-image-picker` instead — it is detected the same way.)

## Quick Start: Expo Go / Managed Expo

```bash
npx create-expo-app@latest rn-erxes-sdk-test
cd rn-erxes-sdk-test

yarn add rn-erxes-sdk
npx expo install @react-native-async-storage/async-storage
yarn add react-native-get-random-values

npx expo start --clear
```

npm alternative:

```bash
npm install --save rn-erxes-sdk
npx expo install @react-native-async-storage/async-storage
npm install --save react-native-get-random-values

npx expo start --clear
```

Render `<ErxesSDK />` from your app entry. In a classic Expo
(`blank-typescript`) project that is `App.tsx`. In an Expo Router project the
usage commonly lives in:

```text
app/index.tsx
```

or:

```text
src/app/index.tsx
```

Expo Go can only use `<ErxesSDK />`. For `ErxesNativeIOS`, use an Expo
development build or prebuild. See [Native iOS guide](docs/native-ios.md).

## Usage with Expo

The example below separates three concerns:

1. authenticated customer-profile data taken from the host app's `currentUser` query,
2. browser/device/runtime metadata, and
3. the props passed to `ErxesSDK`.

```tsx
import * as React from 'react';
import { Platform, View } from 'react-native';
import { ErxesSDK } from 'rn-erxes-sdk';

type CurrentUser = {
  firstName?: string;
  lastName?: string;
  primaryEmail?: string;
  primaryPhone?: string;
  sex?: string | number;
  propertiesData?: Record<string, unknown>;
};

type Props = {
  currentUser?: CurrentUser;
};

export default function App({ currentUser }: Props) {
  const integrationId = 'YOUR_INTEGRATION_ID';
  const subDomain = 'YOUR_SUBDOMAIN.next.erxes.io';

  const data = {
    firstName: currentUser?.firstName ?? '',
    lastName: currentUser?.lastName ?? '',
    primaryEmail: currentUser?.primaryEmail ?? '',
    sex: currentUser?.sex ?? '',
    Type: 'mobile',
    ...currentUser?.propertiesData,
  };

  const properties = {
    remoteAddress: '',
    region: '',
    countryCode: '',
    city: '',
    country: '',
    url: 'https://YOUR_SUBDOMAIN.nextwidgets.erxes.io/',
    hostname: 'YOUR_SUBDOMAIN.nextwidgets.erxes.io',
    language: 'en-US',
    userAgent: Platform.OS,
  };

  return (
    <View style={{ flex: 1 }}>
      <ErxesSDK
        integrationId={integrationId}
        subDomain={subDomain}
        onBack={() => console.log('onBack')}
        showWidget={false}
        phone={currentUser?.primaryPhone ?? ''}
        data={data}
        properties={properties}
      />
    </View>
  );
}
```

Notes:

- The exact `currentUser` query depends on your host application — the SDK does not provide it.
- `data` should normally be mapped from the authenticated user's query result rather than hardcoded.
- Do not hardcode private customer information in production.
- Empty property values are acceptable when metadata is unavailable.
- Do not fake IP addresses or location values.
- Replace `YOUR_INTEGRATION_ID` and `YOUR_SUBDOMAIN` with the values from your erxes environment.
- `Platform.OS` is only a lightweight fallback for `userAgent`; it is not a complete browser user-agent string.

## Customer data from `currentUser`

`data` is customer-profile information. It is forwarded to the erxes `widgetsMessengerConnect` mutation (as the `data` JSON argument) when the SDK connects, and is used to create or identify the customer.

```tsx
const data = {
  firstName: currentUser?.firstName ?? '',
  lastName: currentUser?.lastName ?? '',
  primaryEmail: currentUser?.primaryEmail ?? '',
  sex: currentUser?.sex ?? '',
  Type: 'mobile',
  ...currentUser?.propertiesData,
};
```

- This normally comes from the host application's authenticated-user query.
- Custom fields may be included when relevant (e.g. spread from `propertiesData`).
- `data` is optional — when omitted, the visitor is connected as a guest.
- Do not use fake values in production.

## Browser and device information

`properties` describes the browser, device, and runtime environment. When the SDK has an identified customer, it sends these values to the erxes `widgetsSaveBrowserInfo` mutation internally — **you do not call it yourself**, you only pass the `properties` prop.

```tsx
const properties = {
  remoteAddress: '',
  region: '',
  countryCode: '',
  city: '',
  country: '',
  url: 'https://YOUR_SUBDOMAIN.nextwidgets.erxes.io/',
  hostname: 'YOUR_SUBDOMAIN.nextwidgets.erxes.io',
  language: 'en-US',
  userAgent: 'DEVICE_USER_AGENT',
};
```

- Empty strings are acceptable when a value is unavailable.
- Do not fake IP addresses or location values.
- Collect real runtime values where possible.

For reference, the mutation the SDK calls internally is:

```graphql
mutation widgetsSaveBrowserInfo(
  $customerId: String
  $visitorId: String
  $browserInfo: JSON!
) {
  widgetsSaveBrowserInfo(
    customerId: $customerId
    visitorId: $visitorId
    browserInfo: $browserInfo
  ) {
    _id
    conversationId
    customerId
  }
}
```

The SDK passes the connected `customerId` together with your `properties` object as `browserInfo`. The customer id and visitor id are managed by the SDK:

- On first launch the SDK generates a guest **visitor id** (a 24-character hex string) and uses it to connect.
- After connecting, the resolved **customer id** is cached in `AsyncStorage` and reused on later launches.

You only pass the relevant props (`data`, `properties`, `phone`); you should not duplicate this connect / save-browser-info flow yourself.

## Props

Public props of `ErxesSDK` (from the SDK's TypeScript types):

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `integrationId` | `string` | Yes | erxes messenger integration id used to connect. |
| `subDomain` | `string` | Yes | erxes environment subdomain (e.g. `YOUR_SUBDOMAIN.next.erxes.io`); used to build the GraphQL/WS endpoints and asset URLs. |
| `showWidget` | `boolean` | Yes | When `true`, renders the floating launcher button; when `false`, renders the messenger inline. |
| `brandCode` | `string` | No | Brand code; used as a fallback when `integrationId` is not provided. |
| `email` | `string` | No | When set, the contact is connected as an identified user (`isUser`). |
| `onBack` | `() => void` | No | Called when the user navigates back from the messenger. |
| `phone` | `string` | No | Phone number used to identify the customer on connect. |
| `data` | `object` | No | Customer-profile data forwarded to `widgetsMessengerConnect`. |
| `properties` | `object` | No | Browser/device metadata sent as `browserInfo` to `widgetsSaveBrowserInfo`. |
| `backIcon` | `ImageSource` | No | Custom back icon. |
| `newChatIcon` | `ImageSource` | No | Custom "new chat" icon. |
| `sendIcon` | `ImageSource` | No | Custom send icon. |

## Native iOS messenger

The package also exposes the native SwiftUI messenger from
[`Munkhorgilb/ios-sdk`](https://github.com/Munkhorgilb/ios-sdk) through an
imperative React Native bridge.

Requirements:

- iOS `16.0+`
- Swift `5.9+`
- A bare React Native app, or an Expo development build/prebuild. This does not
  run inside Expo Go because it includes native iOS code.

Install pods after installing or upgrading the package:

```bash
cd ios
pod install
```

Configure once before opening the messenger:

```tsx
import { ErxesNativeIOS } from 'rn-erxes-sdk';

await ErxesNativeIOS.configure({
  integrationId: 'YOUR_INTEGRATION_ID',
  subDomain: 'YOUR_SUBDOMAIN.next.erxes.io',
  // or endpoint: 'https://YOUR_SUBDOMAIN.next.erxes.io',
  primaryColor: '#3f78d9',
});
```

Optionally identify the logged-in user:

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

Open the native messenger sheet:

```tsx
await ErxesNativeIOS.showMessenger();
```

Clear the user on logout:

```tsx
await ErxesNativeIOS.clearUser();
```

More details: [Native iOS guide](docs/native-ios.md).

## Troubleshooting

### Clear Expo cache

```bash
npx expo start --clear
```

### Confirm the installed version

```bash
yarn list --pattern rn-erxes-sdk
```

or:

```bash
npm ls rn-erxes-sdk
```

### Upgrade the SDK

```bash
yarn add rn-erxes-sdk@latest
npx expo start --clear
```

or:

```bash
npm install --save rn-erxes-sdk@latest
npx expo start --clear
```

### Native dependencies

The required peer dependencies (`@react-native-async-storage/async-storage`, `react-native-get-random-values`) must be installed in the **host app**. The SDK does not bundle them.

### `await is not defined` (BSON Metro crash)

Older SDK releases depended on `bson`, which could cause Metro/Hermes to crash at startup with:

```text
await is not defined
node_modules/bson/lib/bson.mjs
```

This happened because Expo resolves packages through their ESM `exports` map and picked `bson/lib/bson.mjs`, which uses a top-level `await`. **Upgrade to the latest `rn-erxes-sdk` release** — it no longer depends on `bson`. A custom Metro config change is not required.

## Maintainer workflow

This repository requires Node.js `>=20.19.0` and Yarn Classic `1.22.22`.

```bash
corepack enable
corepack prepare yarn@1.22.22 --activate

yarn install
yarn typecheck
yarn lint
yarn test
yarn prepack
npm pack --dry-run
```

The example app uses Expo SDK 54, React `19.1.0`, and React Native `0.81.5`, and aliases `rn-erxes-sdk` to the root `src` directory for local development:

```bash
cd example
yarn install
npx expo start --clear
```

### Release

```bash
npm login
npm whoami

npm version patch
npm publish

npm view rn-erxes-sdk version
git push origin main --follow-tags
```

- Pushing to GitHub does **not** publish to npm.
- npmjs displays the README from the **published** package version.
- Each release requires a new version; a published version cannot be republished.
- `npm version patch` is appropriate for backward-compatible fixes and documentation updates.
- `npm publish` may require 2FA or a granular access token with publish permission.
- Do not repeatedly run `npm version patch` after a failed publish unless a genuinely new version is needed.
## Become a partner

Offer your expertise to the world and introduce your community to erxes.
Let’s start growing **<a href="https://erxes.io/partners">together</a>**.

## Contributing

Please read our **<a href="https://github.com/erxes/erxes/blob/master/CONTRIBUTING.md" >contributing guide<a>** before submitting a Pull Request to the project.

## Community support

For general help using erxes, please refer to the erxes documentation. For additional help, you can use one of these channels to ask a question:

- **<a href="https://discord.com/invite/aaGzy3gQK5" > Discord</a>** For live discussion with the community
- **<a href="https://github.com/erxes/erxes" > GitHub</a>** Bug reports, contributions
- **<a href="https://github.com/erxes/erxes/issues" > Feedback section</a>** Roadmap, feature requests & bugs
- **<a href="https://twitter.com/erxesHQ" > Twitter</a>** Get the news fast

## Upgrade Guides

Follow our **<a href="https://docs.erxes.io/docs/update/">upgrade guides</a>** on the documentation to keep your erxes code up-to-date. See our dedicated repository for the erxes documentation, or view our **<a href="https://docs.erxes.io/docs/intro">documentation here</a>**.

## License

See the <a href="https://github.com/erxes/erxes/blob/master/LICENSE.md" >**LICENSE**</a> file for licensing information.
