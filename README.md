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

A React Native bridge for the native SwiftUI erxes messenger
([`erxes/erxes-ios-sdk`](https://github.com/erxes/erxes-ios-sdk) `0.30.0`).

```tsx
import { ErxesNativeIOS } from 'rn-erxes-sdk';
```

## Requirements

| | |
|---|---|
| iOS | 16.0+ |
| Swift | 5.9+ |
| React Native | 0.81+ |
| Expo SDK | 53+ (development build or prebuild — Expo Go not supported) |

## Docs

- [Native iOS guide](docs/native-ios.md)

## Installation

### Bare React Native

```bash
yarn add rn-erxes-sdk
cd ios && pod install
```

### Expo

```bash
npx expo install rn-erxes-sdk expo-build-properties
```

Add to `app.json`:

```json
{
  "plugins": [
    ["expo-build-properties", { "ios": { "deploymentTarget": "16.0" } }]
  ]
}
```

```bash
npx expo prebuild --platform ios
cd ios && pod install
npx expo run:ios
```

## Usage

Call `configure` once at startup. It connects in the background so the messenger opens instantly.

```tsx
import { ErxesNativeIOS } from 'rn-erxes-sdk';

ErxesNativeIOS.configure({
  integrationId: 'YOUR_INTEGRATION_ID',
  subDomain: 'yourcompany.erxes.io',
});
```

Optionally identify the user:

```tsx
ErxesNativeIOS.setUser({
  email: 'user@example.com',
  name: 'Jane Doe',
  customData: { plan: 'pro' },
});
```

### Option A — Floating launcher (recommended)

Shows a draggable button over your app. Tapping it opens the messenger automatically.

```tsx
ErxesNativeIOS.showLauncher();
// ErxesNativeIOS.hideLauncher(); // to remove it
```

### Option B — Your own button

If you have a custom trigger in your UI, call `showMessenger()` directly:

```tsx
<Button title="Support" onPress={() => ErxesNativeIOS.showMessenger()} />
```

On logout:

```tsx
ErxesNativeIOS.clearUser();
```

Full example: [Native iOS guide](docs/native-ios.md).

## Troubleshooting

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
```

or:

```bash
npm install --save rn-erxes-sdk@latest
```

After upgrading, reinstall pods and rebuild the app:

```bash
cd ios
pod install
```

### Expo Go

This package uses native Swift code and does not run in Expo Go. Use an Expo
development build or a bare React Native app.

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
