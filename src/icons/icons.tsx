import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Svg, Path, G, Defs } from 'react-native-svg';

export function ArrowLeft({
  size,
}: {
  style?: StyleProp<ViewStyle>;
  size?: string | number;
  strokeWidth?: number;
}) {
  return (
    <Svg width={size || 32} height={size || 32} fill="none">
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 12H4m0 0 6-6m-6 6 6 6"
      />
    </Svg>
  );
}

export function CheckIcon({
  size,
}: {
  style?: StyleProp<ViewStyle>;
  size?: string | number;
  strokeWidth?: number;
}) {
  return (
    <Svg width={size || 32} height={size || 32} fill="none">
      <Path
        stroke="#1C274C"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="m7 12.9 3.143 3.6L18 7.5"
      />
    </Svg>
  );
}

export function PlusIcon({
  size,
}: {
  style?: StyleProp<ViewStyle>;
  size?: string | number;
  strokeWidth?: number;
}) {
  return (
    <Svg width={size || 32} height={size || 32} fill="none">
      <Path
        fill="#212121"
        fillRule="evenodd"
        d="M11 11V3h2v8h8v2h-8v8h-2v-8H3v-2h8Z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export function SendIcon({
  size,
}: {
  style?: StyleProp<ViewStyle>;
  size?: string | number;
  strokeWidth?: number;
}) {
  return (
    <Svg width={size || 32} height={size || 32} fill="none">
      <Path
        stroke="#1C274C"
        strokeWidth={1.5}
        d="m18.636 15.67 1.716-5.15c1.5-4.498 2.25-6.747 1.062-7.934-1.187-1.187-3.436-.438-7.935 1.062L8.33 5.364C4.7 6.574 2.885 7.18 2.37 8.067a2.717 2.717 0 0 0 0 2.73c.515.888 2.33 1.493 5.96 2.704.584.194.875.291 1.119.454.236.158.439.361.597.597.163.244.26.535.454 1.118 1.21 3.63 1.816 5.446 2.703 5.962.844.49 1.887.49 2.731 0 .887-.516 1.492-2.331 2.703-5.962Z"
      />
      <Path
        stroke="#1C274C"
        strokeLinecap="round"
        strokeWidth={1.5}
        d="m17.789 6.21-4.21 4.165"
      />
    </Svg>
  );
}

export function CloseIcon({
  size,
}: {
  style?: StyleProp<ViewStyle>;
  size?: string | number;
  strokeWidth?: number;
}) {
  return (
    <Svg width={size || 32} height={size || 32} fill="none">
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M5.001 5 19 19M5 19 18.999 5"
      />
    </Svg>
  );
}
