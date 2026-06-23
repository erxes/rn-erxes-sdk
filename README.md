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
([`erxes/erxes-ios-sdk`](https://github.com/erxes/erxes-ios-sdk) `0.30.6`).
Supports the classic widget and the full-screen **chat mode** (with voice
messages and header/drawer actions).

```tsx
import { ErxesNativeIOS } from '@munkhorgil98/rn-erxes-sdk';
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
yarn add @munkhorgil98/rn-erxes-sdk
cd ios && pod install
```

### Expo

```bash
npx expo install @munkhorgil98/rn-erxes-sdk expo-build-properties
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

### Installing from GitHub Packages

The package is also published to the [GitHub Packages npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry) as `@erxes/rn-erxes-sdk`.

Because GitHub Packages requires authentication even for reads, add an `.npmrc` to your project that routes the `@erxes` scope to GitHub and supplies a personal access token with the `read:packages` scope:

```ini
# .npmrc
@erxes:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then export the token and install the scoped package:

```bash
export GITHUB_TOKEN=ghp_your_token_with_read_packages
yarn add @erxes/rn-erxes-sdk
cd ios && pod install
```

> The default npmjs.org package (`@munkhorgil98/rn-erxes-sdk`) needs no authentication — use GitHub Packages only if your org standardizes on it.

## Usage

Call `configure` once at startup. It connects in the background so the messenger opens instantly.

```tsx
import { ErxesNativeIOS } from '@munkhorgil98/rn-erxes-sdk';

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

### Chat mode

Pass `displayMode: 'chat'` for the full-screen assistant shell (it auto-opens
when connected, so `showLauncher()` is a no-op). You can add header/drawer
actions and react to taps by `id`:

```tsx
ErxesNativeIOS.configure({
  integrationId: 'YOUR_INTEGRATION_ID',
  subDomain: 'yourcompany.erxes.io',
  displayMode: 'chat',
  homeActions: [{ id: 'orders', title: 'My Orders', systemIcon: 'bag' }],
  drawerActions: [{ id: 'settings', title: 'Settings', systemIcon: 'gearshape' }],
});

const sub = ErxesNativeIOS.addActionListener((id) => {
  // navigate / open a modal based on id
});
// sub.remove() on cleanup
```

Chat mode also supports voice messages — see the [Native iOS guide](docs/native-ios.md) for the required `Info.plist` permissions.

On logout:

```tsx
ErxesNativeIOS.clearUser();
```

Full example: [Native iOS guide](docs/native-ios.md).

## Troubleshooting

### Confirm the installed version

```bash
yarn list --pattern @munkhorgil98/rn-erxes-sdk
```

or:

```bash
npm ls @munkhorgil98/rn-erxes-sdk
```

### Upgrade the SDK

```bash
yarn add @munkhorgil98/rn-erxes-sdk@latest
```

or:

```bash
npm install --save @munkhorgil98/rn-erxes-sdk@latest
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

The example app uses Expo SDK 54, React `19.1.0`, and React Native `0.81.5`, and aliases `@munkhorgil98/rn-erxes-sdk` to the root `src` directory for local development:

```bash
cd example
yarn install
npx expo start --clear
```

### Release

Publishing is automated by `.github/workflows/publish.yml`, which runs on **GitHub Release publish** and pushes to both registries in parallel:

- **npm** → `@munkhorgil98/rn-erxes-sdk` (public). Uses the `NPM_TOKEN` repository secret, published with `--access public` (scoped packages are private by default) and `--provenance` (adds a verified "built from this repo" badge on npm; requires the job's `id-token: write` permission).
- **GitHub Packages** → `@erxes/rn-erxes-sdk`. Uses the built-in `GITHUB_TOKEN` (no secret to configure). The job rewrites the package name/registry at CI time only, so the committed `package.json` keeps the `@munkhorgil98` npm name.

#### Cutting a release

1. Bump `version` in `package.json` (e.g. `0.2.7` → `0.2.8`).
2. Commit and merge to `main` — **the workflow only triggers from the default branch**, so the new version and workflow must be on `main` before you release.
3. Create a **GitHub Release** at <https://github.com/erxes/rn-erxes-sdk/releases/new>:
   - Tag: `v<version>` (must be new — a published npm version can't be reused), "Create new tag on publish"
   - Target: `main`
   - Publish release → both jobs run at <https://github.com/erxes/rn-erxes-sdk/actions>.
4. Verify: `npm view @munkhorgil98/rn-erxes-sdk version`.

#### One-time setup (already done, for reference)

- **`NPM_TOKEN` secret** — a **Granular Access Token** from <https://www.npmjs.com/settings/munkhorgil98/tokens> with **Read and write** on the `@munkhorgil98` scope, added under repo **Settings → Secrets and variables → Actions**.
- **npm account 2FA** must be set to **"Authorization only"** (uncheck "Require 2FA for write actions" at <https://www.npmjs.com/settings/munkhorgil98/profile>), otherwise CI publishing fails with `EOTP`.

#### Troubleshooting

- **`404 Not Found - PUT .../@scope%2f...`** — the scope doesn't match the npm account, or the token can't create the package. The package name's scope must equal your npm username (`@munkhorgil98`), and the token needs write access to that scope.
- **`EOTP` (one-time password required)** — the account still requires 2FA for writes. Set 2FA to "Authorization only" (and confirm the change with your OTP so it persists).
- **`401 / ENEEDAUTH`** — the `NPM_TOKEN` secret is missing/invalid; regenerate the token and update the secret.
- After fixing a token/secret, just **re-run the failed job** in the Actions tab — no new version needed.
- Each release requires a new version; a published version cannot be republished.

#### Manual fallback

If you need to publish from your machine (e.g. CI is unavailable):

```bash
git checkout main && git pull
yarn install
npm publish --access public            # add --otp=<code> if 2FA-on-writes is enabled
npm view @munkhorgil98/rn-erxes-sdk version
```

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
