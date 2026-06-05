/* eslint-disable no-bitwise */
// Lightweight, React Native-compatible replacement for `bson`'s `ObjectId`.
//
// The SDK only ever used `new ObjectId().toString()` to mint a `visitorId`,
// which the erxes backend accepts as a plain `String`. Importing the whole
// `bson` package for this pulls in `bson/lib/bson.mjs`, whose top-level
// `await` crashes Metro/Hermes ("await is not defined") once Expo resolves
// packages through the ESM `exports` map.
//
// This helper returns the exact same shape an ObjectId stringifies to:
// 24 lowercase hexadecimal characters (a 12-byte value made of a 4-byte
// big-endian timestamp followed by 8 random bytes).

const toHex = (bytes: Uint8Array): string => {
  let out = '';
  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i] as number;
    out += byte.toString(16).padStart(2, '0');
  }
  return out;
};

const getRandomBytes = (length: number): Uint8Array => {
  const bytes = new Uint8Array(length);

  // `react-native-get-random-values` (imported by the SDK entry point)
  // polyfills `crypto.getRandomValues` on device. Fall back to `Math.random`
  // so the helper still works in environments without the polyfill (e.g. Jest).
  const cryptoObj =
    typeof globalThis !== 'undefined' ? (globalThis as any).crypto : undefined;

  if (cryptoObj && typeof cryptoObj.getRandomValues === 'function') {
    cryptoObj.getRandomValues(bytes);
    return bytes;
  }

  for (let i = 0; i < length; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  return bytes;
};

export const createObjectIdLikeString = (): string => {
  const bytes = new Uint8Array(12);

  // 4-byte big-endian timestamp (seconds since epoch), like a real ObjectId.
  const timestamp = Math.floor(Date.now() / 1000);
  bytes[0] = (timestamp >> 24) & 0xff;
  bytes[1] = (timestamp >> 16) & 0xff;
  bytes[2] = (timestamp >> 8) & 0xff;
  bytes[3] = timestamp & 0xff;

  // Remaining 8 bytes from a CSPRNG when available.
  bytes.set(getRandomBytes(8), 4);

  return toHex(bytes);
};

export default createObjectIdLikeString;
