import { NativeModules, Platform } from 'react-native';

type NativeIOSConfig = {
  integrationId: string;
  endpoint?: string;
  serverUrl?: string;
  subDomain?: string;
  cachedCustomerId?: string;
};

type NativeIOSUser = {
  email?: string;
  phone?: string;
  name?: string;
  customData?: Record<string, string | number | boolean | null | undefined>;
};

type NativeIOSModule = {
  configure(options: NativeIOSConfig): Promise<void>;
  setUser(options: NativeIOSUser): Promise<void>;
  clearUser(): Promise<void>;
  showMessenger(): Promise<void>;
  showLauncher(): Promise<void>;
  hideLauncher(): Promise<void>;
};

const LINKING_ERROR =
  "The rn-erxes-sdk native iOS module is not linked. Run `pod install` in your app's ios directory and rebuild the app.";

const nativeModule = NativeModules.RnErxesSdk as NativeIOSModule | undefined;

function getNativeModule(): NativeIOSModule {
  if (Platform.OS !== 'ios') {
    throw new Error('Erxes native messenger is only available on iOS.');
  }

  if (!nativeModule) {
    throw new Error(LINKING_ERROR);
  }

  return nativeModule;
}

export const ErxesNativeIOS = {
  configure(options: NativeIOSConfig) {
    return getNativeModule().configure(options);
  },
  setUser(options: NativeIOSUser) {
    const customData = Object.fromEntries(
      Object.entries(options.customData ?? {})
        .filter(([, value]) => value !== null && value !== undefined)
        .map(([key, value]) => [key, String(value)])
    );

    return getNativeModule().setUser({
      ...options,
      customData,
    });
  },
  clearUser() {
    return getNativeModule().clearUser();
  },
  showMessenger() {
    return getNativeModule().showMessenger();
  },
  showLauncher() {
    return getNativeModule().showLauncher();
  },
  hideLauncher() {
    return getNativeModule().hideLauncher();
  },
};

export type { NativeIOSConfig, NativeIOSUser };
