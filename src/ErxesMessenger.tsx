import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

import { ErxesNativeIOS, type NativeIOSUser } from './nativeIos';

/**
 * The identified end user. Same shape the native bridge expects — passing
 * `undefined` leaves the visitor anonymous until you call `setUser` later.
 */
export type ErxesUser = NativeIOSUser;

/**
 * Helpers handed to action `onPress` callbacks (and `onAction`) so you can drive
 * the messenger imperatively from inside a tap handler — show/hide it, toggle the
 * launcher, or swap the user.
 */
export type ErxesMessengerHelpers = {
  show: () => Promise<void>;
  hide: () => Promise<void>;
  showLauncher: () => Promise<void>;
  hideLauncher: () => Promise<void>;
  setUser: (user: ErxesUser) => Promise<void>;
  clearUser: () => Promise<void>;
};

/**
 * A chat-mode action rendered in the header (`homeActions`) or drawer
 * (`drawerActions`). Only `id`/`title`/`systemIcon` cross the native bridge; the
 * `onPress` callback stays in JS and runs when the matching action is tapped.
 */
export type ErxesAction = {
  /** Identifier echoed back from native when the action is tapped. */
  id: string;
  /** Display title (drawer rows / accessibility label for header icons). */
  title: string;
  /** SF Symbol name, e.g. "person.crop.circle". */
  systemIcon: string;
  /** Runs when this action is tapped. Receives imperative {@link ErxesMessengerHelpers}. */
  onPress?: (helpers: ErxesMessengerHelpers) => void | Promise<void>;
};

export type ErxesMessengerProps = {
  /** erxes messenger integration id. Required. */
  integrationId: string;

  /** Full endpoint URL. Provide one of `endpoint`/`serverUrl`/`subDomain`. */
  endpoint?: string;
  /** Alias for `endpoint`. */
  serverUrl?: string;
  /** Sub-domain shorthand, e.g. `'yourcompany.erxes.io'`. */
  subDomain?: string;

  /** UI shell to present. Defaults to `'classic'` (the sheet-based widget). */
  displayMode?: 'classic' | 'chat';

  /** Identify the user before connecting. */
  user?: ErxesUser;
  /** Reuse a previously cached customer id. */
  cachedCustomerId?: string;

  /** Primary accent color as a hex string, e.g. `'#3f78d9'`. */
  primaryColor?: string;

  /** Controlled visibility. When set, drives show/hide on change. */
  visible?: boolean;
  /** Open the messenger once configured. Defaults to `true` in chat mode. */
  autoOpen?: boolean;
  /** Hide the messenger when the component unmounts. Defaults to `true`. */
  autoHideOnUnmount?: boolean;
  /** Show (`true`) or hide (`false`) the floating launcher after configure. */
  launcherVisible?: boolean;

  /** Chat-mode header-right actions. Ignored in `'classic'`. */
  homeActions?: ErxesAction[];
  /** Chat-mode drawer top action rows. Ignored in `'classic'`. */
  drawerActions?: ErxesAction[];

  /** Fired when setup starts. */
  onLoad?: () => void;
  /** Fired after native `configure` succeeds. */
  onReady?: () => void;
  /** Fired when the messenger is shown. */
  onOpen?: () => void;
  /** Fired when the messenger is hidden. */
  onClose?: () => void;
  /** Fired when setup/open/hide fails. */
  onError?: (error: unknown) => void;
  /** Fallback for tapped actions that have no `onPress`. */
  onAction?: (
    id: string,
    helpers: ErxesMessengerHelpers
  ) => void | Promise<void>;
};

/**
 * Drop `onPress` so only the data-only fields the native bridge understands
 * (`id`/`title`/`systemIcon`) cross over. React Native cannot send JS functions
 * to native, so `onPress` is dispatched on the JS side via the action listener.
 */
function stripActions(actions: ErxesAction[]) {
  return actions.map(({ onPress: _onPress, ...nativeAction }) => nativeAction);
}

/**
 * Declarative wrapper around {@link ErxesNativeIOS}. Configures the native erxes
 * messenger, wires up action taps, and manages the show/hide lifecycle so app
 * code stays a single component. Renders nothing — the messenger UI is presented
 * natively over your app.
 *
 * For advanced/imperative control, use `ErxesNativeIOS` directly.
 */
export function ErxesMessenger({
  integrationId,
  endpoint,
  serverUrl,
  subDomain,
  displayMode = 'classic',
  user,
  cachedCustomerId,
  primaryColor,
  visible,
  autoOpen = displayMode === 'chat',
  autoHideOnUnmount = true,
  launcherVisible,
  homeActions = [],
  drawerActions = [],
  onLoad,
  onReady,
  onOpen,
  onClose,
  onError,
  onAction,
}: ErxesMessengerProps) {
  // Keep the latest actions/callback in refs so the action listener (registered
  // once below) always dispatches against current props without re-subscribing.
  const actionsRef = useRef<ErxesAction[]>([]);
  const onActionRef = useRef(onAction);

  useEffect(() => {
    actionsRef.current = [...homeActions, ...drawerActions];
    onActionRef.current = onAction;
  }, [homeActions, drawerActions, onAction]);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    const helpers: ErxesMessengerHelpers = {
      show: () => ErxesNativeIOS.showMessenger(),
      hide: () => ErxesNativeIOS.hideMessenger(),
      showLauncher: () => ErxesNativeIOS.showLauncher(),
      hideLauncher: () => ErxesNativeIOS.hideLauncher(),
      setUser: (nextUser) => ErxesNativeIOS.setUser(nextUser),
      clearUser: () => ErxesNativeIOS.clearUser(),
    };

    const sub = ErxesNativeIOS.addActionListener(async (id) => {
      const action = actionsRef.current.find((item) => item.id === id);

      if (action?.onPress) {
        await action.onPress(helpers);
        return;
      }

      await onActionRef.current?.(id, helpers);
    });

    async function setup() {
      try {
        onLoad?.();

        if (user) {
          await ErxesNativeIOS.setUser(user);
        }

        await ErxesNativeIOS.configure({
          integrationId,
          endpoint,
          serverUrl,
          subDomain,
          cachedCustomerId,
          displayMode,
          primaryColor,
          homeActions: stripActions(homeActions),
          drawerActions: stripActions(drawerActions),
        });

        onReady?.();

        if (autoOpen) {
          await ErxesNativeIOS.showMessenger();
          onOpen?.();
        }

        if (launcherVisible === true) {
          await ErxesNativeIOS.showLauncher();
        } else if (launcherVisible === false) {
          await ErxesNativeIOS.hideLauncher();
        }
      } catch (error) {
        onError?.(error);
      }
    }

    setup();

    return () => {
      sub.remove();

      if (autoHideOnUnmount) {
        ErxesNativeIOS.hideMessenger();
        onClose?.();
      }
    };
    // Re-run setup only when the native config identity changes; callbacks and
    // actions are read through refs so they don't need to be deps here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [integrationId, endpoint, serverUrl, subDomain, displayMode]);

  useEffect(() => {
    if (Platform.OS !== 'ios' || visible === undefined) {
      return;
    }

    if (visible) {
      ErxesNativeIOS.showMessenger();
      onOpen?.();
    } else {
      ErxesNativeIOS.hideMessenger();
      onClose?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return null;
}
