import { useEffect, useRef, useState, type ReactNode } from 'react';
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

  /**
   * Rendered while the SDK is configuring (between `onLoad` and
   * `onReady`/`onError`), e.g. a spinner shown before the native messenger
   * appears. Returns `null` otherwise. Defaults to rendering nothing.
   */
  renderLoading?: () => ReactNode;

  /** Fired when setup starts. */
  onLoad?: () => void;
  /** Fired when the connection handshake completes (the messenger is ready). */
  onReady?: () => void;
  /** Fired when the loading state changes (`true` while configuring). */
  onLoadingChange?: (loading: boolean) => void;
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
  renderLoading,
  onLoad,
  onReady,
  onOpen,
  onClose,
  onError,
  onAction,
  onLoadingChange,
}: ErxesMessengerProps) {
  // Keep the latest actions/callback in refs so the action listener (registered
  // once below) always dispatches against current props without re-subscribing.
  const actionsRef = useRef<ErxesAction[]>([]);
  const onActionRef = useRef(onAction);
  const onLoadingChangeRef = useRef(onLoadingChange);
  // Tracks whether we believe the messenger is currently presented, so we never
  // double-present (chat mode auto-presents inside `configure()`) or fire a
  // redundant show/hide. Native gives us no presentation callback, so this is our
  // best-effort intent mirror.
  const shownRef = useRef(false);

  // Flips true only after native `configure()` resolves. The controlled-`visible`
  // effect gates on this so it never calls `showMessenger()` before `configure()`
  // (the native SDK asserts on that ordering).
  const [configured, setConfigured] = useState(false);
  // True while configuring (between `onLoad` and `onReady`/`onError`); drives
  // `renderLoading`.
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onLoadingChangeRef.current = onLoadingChange;
  }, [onLoadingChange]);

  useEffect(() => {
    onLoadingChangeRef.current?.(loading);
  }, [loading]);

  useEffect(() => {
    actionsRef.current = [...homeActions, ...drawerActions];
    onActionRef.current = onAction;
  }, [homeActions, drawerActions, onAction]);

  useEffect(() => {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
      return;
    }

    setConfigured(false);

    const helpers: ErxesMessengerHelpers = {
      show: async () => {
        await ErxesNativeIOS.showMessenger();
        shownRef.current = true;
      },
      hide: async () => {
        await ErxesNativeIOS.hideMessenger();
        shownRef.current = false;
      },
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

    // Connection complete (native `MessengerSDK.isReady`): the messenger is
    // truly ready, so end the loading state and notify the host.
    const readySub = ErxesNativeIOS.addReadyListener(() => {
      setLoading(false);
      onReady?.();
    });

    async function setup() {
      try {
        setLoading(true);
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

        // `configure()` only kicks off the async connect; `onReady` and the end
        // of `loading` are driven by the ready listener above, not here.

        // Decide the initial open state. If `visible` is controlled it wins;
        // otherwise fall back to `autoOpen` (defaults to true in chat mode).
        const shouldOpen = visible ?? autoOpen;

        if (displayMode === 'chat') {
          // Chat mode auto-presents itself inside `configure()` — never call
          // `showMessenger()` for the initial open or we'd present a second one.
          if (shouldOpen) {
            shownRef.current = true;
            onOpen?.();
          } else {
            // Caller wants it closed: undo the native auto-present.
            await ErxesNativeIOS.hideMessenger();
            shownRef.current = false;
          }
        } else {
          // Classic mode: configure does not open anything. Show the launcher
          // and/or present the sheet explicitly.
          if (launcherVisible === true) {
            await ErxesNativeIOS.showLauncher();
          } else if (launcherVisible === false) {
            await ErxesNativeIOS.hideLauncher();
          }

          if (shouldOpen) {
            await ErxesNativeIOS.showMessenger();
            shownRef.current = true;
            onOpen?.();
          }
        }

        setConfigured(true);
      } catch (error) {
        // Setup failed before the connection could complete — end loading here
        // since the ready listener will never fire.
        setLoading(false);
        onError?.(error);
      }
    }

    setup();

    return () => {
      sub.remove();
      readySub.remove();

      if (autoHideOnUnmount && shownRef.current) {
        ErxesNativeIOS.hideMessenger();
        shownRef.current = false;
        onClose?.();
      }
    };
    // Re-run setup only when the native config identity changes; callbacks and
    // actions are read through refs so they don't need to be deps here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [integrationId, endpoint, serverUrl, subDomain, displayMode]);

  useEffect(() => {
    // Wait until `configure()` has resolved — otherwise `showMessenger()` would
    // race ahead of it and trip the native configure-before-show assertion. The
    // initial open is handled in `setup()`; this only reacts to later changes.
    if (
      (Platform.OS !== 'ios' && Platform.OS !== 'android') ||
      visible === undefined ||
      !configured
    ) {
      return;
    }

    if (visible && !shownRef.current) {
      ErxesNativeIOS.showMessenger();
      shownRef.current = true;
      onOpen?.();
    } else if (!visible && shownRef.current) {
      ErxesNativeIOS.hideMessenger();
      shownRef.current = false;
      onClose?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, configured]);

  if (loading && renderLoading) {
    return renderLoading();
  }

  return null;
}
