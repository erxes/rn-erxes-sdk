import {
  NativeEventEmitter,
  NativeModules,
  Platform,
  type EmitterSubscription,
  type NativeModule,
} from 'react-native';

/**
 * A chat-mode action rendered in the header (`homeActions`) or drawer
 * (`drawerActions`). Kept data-only so it can cross the native bridge — tapping
 * it fires the `onErxesAction` event with this `id` (see `addActionListener`).
 */
type NativeIOSAction = {
  /** Identifier echoed back when the action is tapped. */
  id: string;
  /** Display title (drawer rows / accessibility label for header icons). */
  title: string;
  /** SF Symbol name, e.g. "magnifyingglass". */
  systemIcon: string;
};

type NativeIOSConfig = {
  integrationId: string;
  endpoint?: string;
  serverUrl?: string;
  subDomain?: string;
  cachedCustomerId?: string;
  /** UI shell to present. Defaults to `'classic'` (the sheet-based widget). */
  displayMode?: 'classic' | 'chat';
  /** Chat-mode header-right actions. Ignored in `'classic'`. */
  homeActions?: NativeIOSAction[];
  /** Chat-mode drawer top action rows. Ignored in `'classic'`. */
  drawerActions?: NativeIOSAction[];
  /** Primary accent color as a hex string, e.g. `'#3f78d9'`. */
  primaryColor?: string;
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
  hideMessenger(): Promise<void>;
};

/** Native event name emitted when a chat-mode action is tapped. */
const ACTION_EVENT = 'onErxesAction';

/** Native event name emitted when the connect handshake completes. */
const READY_EVENT = 'onErxesReady';

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
  hideMessenger() {
    return getNativeModule().hideMessenger();
  },
  /**
   * Listen for chat-mode action taps (`homeActions` / `drawerActions`). The
   * handler receives the tapped action's `id`; your code decides what happens
   * (navigate, open a modal, etc.). Returns a subscription — call `.remove()`
   * to stop listening.
   */
  addActionListener(handler: (id: string) => void): EmitterSubscription {
    const emitter = new NativeEventEmitter(
      getNativeModule() as unknown as NativeModule
    );
    return emitter.addListener(ACTION_EVENT, (event: { id: string }) =>
      handler(event.id)
    );
  },
  /**
   * Listen for the connect handshake completing — i.e. the messenger is ready
   * (`MessengerSDK.isReady`). Fires once per connection; if already connected
   * when you subscribe via a fresh `configure`, it fires again. Returns a
   * subscription — call `.remove()` to stop listening.
   */
  addReadyListener(handler: () => void): EmitterSubscription {
    const emitter = new NativeEventEmitter(
      getNativeModule() as unknown as NativeModule
    );
    return emitter.addListener(READY_EVENT, () => handler());
  },
};

export type { NativeIOSAction, NativeIOSConfig, NativeIOSUser };
