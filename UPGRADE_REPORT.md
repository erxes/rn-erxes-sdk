# rn-erxes-sdk Upgrade Report

## 1. Original repository condition

The root package was a React Native SDK at version `0.1.23` with an Expo example app. The root SDK used React `18.2.0`, React Native `0.71.8`, React 17 type pins, `@types/react-native`, and a deprecated `react-apollo` dependency. The example app targeted Expo SDK 48 and had a generated npm `package-lock.json` in the working tree before this migration started.

## 2. Environment target

- Node.js: `>=20.19.0`
- Yarn: Classic `1.22.22`
- Expo example: SDK 54
- React: `19.1.0`
- React Native: `0.81.5`

## 3. Package-manager changes

The root `packageManager` field now uses the exact value `yarn@1.22.22`. Corepack is enabled for Yarn Classic resolution. The pre-existing example `package-lock.json` was removed so the repository remains Yarn-only.

## 4. Node.js changes

The root `engines.node` value changed from `>= 16.0.0` to `>=20.19.0`. The root `.nvmrc` now contains `20`.

## 5. Removed deprecated packages

- Removed root `react-apollo`.
- Removed example `react-apollo`.
- Removed stale example Webpack tooling: `@expo/webpack-config`, `babel-loader`, and `example/webpack.config.js`.

## 6. React and React Native changes

Root dev React and React Native are now aligned with Expo SDK 54: React `19.1.0` and React Native `0.81.5`. React types were updated to `@types/react@^19.0.0`, while `@types/react-native` and the old React 17 `resolutions` pin were removed.

## 7. Expo SDK 54 migration

The example app now uses Expo `^54.0.0`, `expo-status-bar~3.0.9`, React `19.1.0`, React Native `0.81.5`, React DOM `19.1.0`, React Native Web `^0.21.0`, and React Native WebView `13.15.0`. Expo tooling selected these versions during `npx expo install --fix`; the command hit local Node heap limits before writing all changes, so the Expo-reported expected versions were applied manually and validated with `npx expo install --check` and `npx expo-doctor`.

## 8. Runtime dependency audit

| Package | Old version | New version | Location | Reason |
| --- | --- | --- | --- | --- |
| `@apollo/client` | `^3.7.15` | `^3.14.1` | root/example dependencies | Keep Apollo 3.x while removing deprecated React Apollo. |
| `@react-native-async-storage/async-storage` | `^1.18.2` | `2.2.0` dev, `>=2.2.0` peer | root peer/dev, example dependency | Host app should own native module installation. |
| `bson` | `^5.3.0` | unchanged | root dependency | Used for `ObjectId`. |
| `dayjs` | `^1.11.8` | unchanged | root/example dependency | Used for message timestamps. |
| `graphql` | `^16.6.0` | unchanged | root/example dependency | Apollo and GraphQL WS runtime support. |
| `graphql-ws` | `^5.13.1` | unchanged | root/example dependency | Used for subscriptions. |
| `react-native-get-random-values` | `^1.9.0` | `~1.11.0` dev, `>=1.11.0` peer | root peer/dev, example dependency | Host app should own polyfill/native installation. |
| `react-native-render-html` | `^6.3.4` | unchanged | root dependency | Used by message rendering. |
| `react-native-gesture-handler` | `^2.12.0` | removed | removed | No source import found. |
| `react-native-safe-area-context` | `^4.5.3` | removed | removed | No source import found. |
| `react-native-screens` | `^3.21.1` | removed | removed | No source import found. |
| `react-native-uuid` | `^2.0.1` | removed | removed | No source import found. |

## 9. Native dependency decisions

The SDK has no root native implementation folders, podspec, TurboModule, Fabric component, JSI code, `NativeModules`, or `requireNativeComponent`. AsyncStorage and random-values are required by SDK source but are host-owned native/polyfill packages, so they moved to peer dependencies with matching dev dependencies for local SDK validation.

## 10. New Architecture status

`example/app.json` sets `newArchEnabled` to `true`. No SDK native code was detected, so no New Architecture blocker was found.

## 11. Builder Bob and tooling changes

Builder Bob remained on the existing configuration because `yarn prepack` still builds CommonJS, module, and TypeScript declaration outputs successfully. Tooling fixes were limited to reproducibility: modern RN Babel preset, explicit Babel/ESLint parser dependencies, `eslint-plugin-ft-flow`, an explicit local `tsc` path for Bob's TypeScript target, and Lefthook commands that work without an upstream branch.

## 12. Source-code changes

- `src/screen/conversation/Attachment.tsx`: narrowed image width/height helper typing from `number | string | undefined` to `number | undefined` for React Native `0.81` image style types.
- `babel.config.js`: replaced the removed Metro Babel preset with `@react-native/babel-preset`.
- `example/metro.config.js`: updated Metro blocklist config and package-export-safe `exclusionList` import.

## 13. Validation commands executed

- `yarn install`
- `yarn typecheck`
- `yarn lint`
- `yarn test --watchAll=false`
- `yarn prepack`
- `yarn lefthook run pre-commit`
- `cd example && yarn install`
- `cd example && npx expo install --check`
- `cd example && npx expo-doctor`
- `cd example && npx expo start --clear`

## 14. Commands that passed

All listed commands passed after fixes. `expo start --clear` started Metro and waited on `http://localhost:8081`; the process was then stopped.

## 15. Commands that failed or could not be tested

Initial `npx expo install --fix --yarn` attempts failed locally because Node hit heap limits and the machine briefly ran out of disk space while Yarn copied packages. After clearing Yarn cache and applying the Expo-reported versions manually, Expo dependency checks and Doctor passed.

Native builds were not run because the example has no generated `ios/` or `android/` folders and no prebuild was requested.

## 16. Remaining warnings

- `yarn lint` reports one existing warning in `example/src/App.tsx` for an inline style.
- Jest may report a Watchman recrawl warning on this machine.
- `yarn prepack` reports stale Browserslist/caniuse-lite data.
- `react-native-render-html` transitive packages still warn about old `@types/react-native` peers.

## 17. Breaking changes

Consumers now need to install `@react-native-async-storage/async-storage` and `react-native-get-random-values` in their host app. This avoids duplicate native module installation and matches the Expo 54/RN 0.81 dependency model.

## 18. Recommended follow-up work

- Add real tests beyond the current todo test.
- Consider migrating from `react-native-render-html` 6.x if its stale type peer warnings become blocking.
- Consider a later, separate Builder Bob/ESLint/Jest major upgrade after checking each migration guide.
- Configure Watchman locally if recrawl warnings continue.

## 19. Future Expo SDK upgrade path

For future Expo upgrades, update the example first with `npx expo install expo@^<sdk>.0.0 --yarn`, run `npx expo install --fix --yarn`, then mirror the resolved React and React Native versions into the root SDK dev environment. Keep native host packages as peer dependencies in the SDK and direct dependencies in the example app.
