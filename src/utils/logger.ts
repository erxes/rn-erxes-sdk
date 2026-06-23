/**
 * Debug-gated logger for the SDK.
 *
 * A published SDK should not write to the host app's console in production. All
 * internal logging goes through here so it can be silenced. By default logging
 * follows React Native's `__DEV__` flag (on in development, off in release
 * builds); hosts can override either way via {@link setDebugLogging}.
 */

declare const __DEV__: boolean;

let enabled = typeof __DEV__ !== 'undefined' ? __DEV__ : false;

/** Enable or disable SDK debug logging at runtime. */
export const setDebugLogging = (value: boolean) => {
  enabled = value;
};

/** Whether SDK debug logging is currently active. */
export const isDebugLogging = () => enabled;

const PREFIX = '[erxes]';

export const logger = {
  info: (...args: unknown[]) => {
    if (enabled) {
      console.log(PREFIX, ...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (enabled) {
      console.warn(PREFIX, ...args);
    }
  },
  error: (...args: unknown[]) => {
    if (enabled) {
      console.error(PREFIX, ...args);
    }
  },
};
