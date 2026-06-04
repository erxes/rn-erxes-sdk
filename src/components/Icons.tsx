/* eslint-disable react-native/no-inline-styles */
// Lightweight vector-ish icons drawn with plain Views so the messenger UI looks
// finished without pulling in an icon library. The SDK consumer can still pass
// their own `backIcon` / `sendIcon` / `newChatIcon` elements as overrides; these
// are only the defaults used when none are provided.
import React from 'react';
import { View } from 'react-native';

type IconProps = {
  color?: string;
  size?: number;
};

// Chevron pointing left (back). Two strokes forming a "<".
export const BackIcon = ({ color = '#FFFFFF', size = 18 }: IconProps) => {
  const arm = size * 0.5;
  const thickness = Math.max(2, Math.round(size * 0.12));
  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: arm,
          height: arm,
          transform: [{ translateX: arm * 0.18 }],
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            width: arm,
            height: thickness,
            backgroundColor: color,
            borderRadius: thickness,
            transform: [{ translateY: -thickness / 2 }, { rotate: '45deg' }],
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: '50%',
            left: 0,
            width: arm,
            height: thickness,
            backgroundColor: color,
            borderRadius: thickness,
            transform: [{ translateY: thickness / 2 }, { rotate: '-45deg' }],
          }}
        />
      </View>
    </View>
  );
};

// Paper-plane style send arrow pointing right.
export const SendIcon = ({ color = '#FFFFFF', size = 18 }: IconProps) => {
  const arm = size * 0.42;
  const thickness = Math.max(2, Math.round(size * 0.12));
  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* shaft */}
      <View
        style={{
          position: 'absolute',
          width: size * 0.62,
          height: thickness,
          backgroundColor: color,
          borderRadius: thickness,
        }}
      />
      {/* upper arrow arm */}
      <View
        style={{
          position: 'absolute',
          right: size * 0.18,
          top: '50%',
          width: arm,
          height: thickness,
          backgroundColor: color,
          borderRadius: thickness,
          transform: [{ translateY: -thickness / 2 }, { rotate: '-45deg' }],
          transformOrigin: 'right' as any,
        }}
      />
      {/* lower arrow arm */}
      <View
        style={{
          position: 'absolute',
          right: size * 0.18,
          bottom: '50%',
          width: arm,
          height: thickness,
          backgroundColor: color,
          borderRadius: thickness,
          transform: [{ translateY: thickness / 2 }, { rotate: '45deg' }],
          transformOrigin: 'right' as any,
        }}
      />
    </View>
  );
};

// Plus / new conversation.
export const PlusIcon = ({ color = '#FFFFFF', size = 22 }: IconProps) => {
  const thickness = Math.max(2, Math.round(size * 0.12));
  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          position: 'absolute',
          width: size,
          height: thickness,
          backgroundColor: color,
          borderRadius: thickness,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: thickness,
          height: size,
          backgroundColor: color,
          borderRadius: thickness,
        }}
      />
    </View>
  );
};

// New-message bubble + pencil glyph used on the list FAB.
export const NewChatIcon = ({ color = '#FFFFFF', size = 22 }: IconProps) => {
  const thickness = Math.max(2, Math.round(size * 0.1));
  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: size * 0.82,
          height: size * 0.72,
          borderWidth: thickness,
          borderColor: color,
          borderRadius: size * 0.22,
          borderBottomRightRadius: 2,
        }}
      />
      {/* pencil dot accent */}
      <View
        style={{
          position: 'absolute',
          right: size * 0.04,
          top: size * 0.02,
          width: size * 0.32,
          height: thickness,
          backgroundColor: color,
          borderRadius: thickness,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
};

// Close (X).
export const CloseIcon = ({ color = '#FFFFFF', size = 18 }: IconProps) => {
  const thickness = Math.max(2, Math.round(size * 0.12));
  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          position: 'absolute',
          width: size,
          height: thickness,
          backgroundColor: color,
          borderRadius: thickness,
          transform: [{ rotate: '45deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: size,
          height: thickness,
          backgroundColor: color,
          borderRadius: thickness,
          transform: [{ rotate: '-45deg' }],
        }}
      />
    </View>
  );
};

// Paperclip / attachment (simple rounded outline).
export const AttachmentIcon = ({ color = '#71717A', size = 20 }: IconProps) => {
  const thickness = Math.max(2, Math.round(size * 0.1));
  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: size * 0.5,
          height: size * 0.86,
          borderWidth: thickness,
          borderColor: color,
          borderRadius: size * 0.25,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
};

// Home (house outline) — bottom-nav tab.
export const HomeIcon = ({ color = '#71717A', size = 22 }: IconProps) => {
  const thickness = Math.max(2, Math.round(size * 0.1));
  const roofArm = size * 0.42;
  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: size * 0.32,
          left: size * 0.18,
          width: roofArm,
          height: thickness,
          backgroundColor: color,
          borderRadius: thickness,
          transform: [{ rotate: '-42deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: size * 0.32,
          right: size * 0.18,
          width: roofArm,
          height: thickness,
          backgroundColor: color,
          borderRadius: thickness,
          transform: [{ rotate: '42deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: size * 0.47,
          width: size * 0.58,
          height: size * 0.38,
          borderWidth: thickness,
          borderTopWidth: 0,
          borderColor: color,
          borderBottomLeftRadius: size * 0.08,
          borderBottomRightRadius: size * 0.08,
        }}
      />
    </View>
  );
};

// Message / chat bubble — bottom-nav tab.
export const MessageIcon = ({ color = '#71717A', size = 22 }: IconProps) => {
  const thickness = Math.max(2, Math.round(size * 0.09));
  const bubbleWidth = size * 0.74;
  const bubbleHeight = size * 0.54;
  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: size * 0.2,
          width: bubbleWidth,
          height: bubbleHeight,
          borderWidth: thickness,
          borderColor: color,
          borderRadius: size * 0.18,
          borderBottomLeftRadius: size * 0.08,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: size * 0.28,
          bottom: size * 0.16,
          width: size * 0.22,
          height: thickness,
          backgroundColor: color,
          borderRadius: thickness,
          transform: [{ rotate: '-45deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: size * 0.34,
          bottom: size * 0.2,
          width: size * 0.18,
          height: thickness,
          backgroundColor: color,
          borderRadius: thickness,
        }}
      />
    </View>
  );
};

// Chevron pointing right.
export const ChevronRightIcon = ({
  color = '#9CA3AF',
  size = 16,
}: IconProps) => {
  const thickness = Math.max(2, Math.round(size * 0.14));
  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: size * 0.42,
          height: size * 0.42,
          borderTopWidth: thickness,
          borderRightWidth: thickness,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
};

// Help / knowledge base (book outline) — bottom-nav tab + category glyph.
export const HelpIcon = ({ color = '#71717A', size = 22 }: IconProps) => {
  const thickness = Math.max(2, Math.round(size * 0.09));
  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: size * 0.74,
          height: size * 0.82,
          borderWidth: thickness,
          borderColor: color,
          borderRadius: 3,
          borderLeftWidth: thickness * 1.6,
        }}
      />
      {/* page line */}
      <View
        style={{
          position: 'absolute',
          width: size * 0.34,
          height: thickness,
          backgroundColor: color,
          borderRadius: thickness,
          top: size * 0.36,
          left: size * 0.36,
        }}
      />
    </View>
  );
};

// Hamburger menu (three lines) — persistent menu trigger.
export const MenuIcon = ({ color = '#71717A', size = 20 }: IconProps) => {
  const thickness = Math.max(2, Math.round(size * 0.1));
  const bar = {
    width: size * 0.82,
    height: thickness,
    backgroundColor: color,
    borderRadius: thickness,
    marginVertical: size * 0.1,
  };
  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View style={bar} />
      <View style={bar} />
      <View style={bar} />
    </View>
  );
};

// Smiley face (mood) — emoji picker trigger, matching the web IconMoodSmile.
export const SmileyIcon = ({ color = '#71717A', size = 20 }: IconProps) => {
  const thickness = Math.max(2, Math.round(size * 0.1));
  const eye = Math.max(2, Math.round(size * 0.1));
  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* face */}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: thickness,
          borderColor: color,
        }}
      />
      {/* eyes */}
      <View
        style={{
          position: 'absolute',
          top: size * 0.34,
          left: size * 0.32,
          width: eye,
          height: eye,
          borderRadius: eye,
          backgroundColor: color,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: size * 0.34,
          right: size * 0.32,
          width: eye,
          height: eye,
          borderRadius: eye,
          backgroundColor: color,
        }}
      />
      {/* smile (downward arc via bottom-only colored border) */}
      <View
        style={{
          position: 'absolute',
          bottom: size * 0.24,
          width: size * 0.42,
          height: size * 0.22,
          borderBottomWidth: thickness,
          borderLeftWidth: thickness,
          borderRightWidth: thickness,
          borderColor: 'transparent',
          borderBottomColor: color,
          borderBottomLeftRadius: size * 0.42,
          borderBottomRightRadius: size * 0.42,
        }}
      />
    </View>
  );
};

export default {
  BackIcon,
  SendIcon,
  PlusIcon,
  NewChatIcon,
  CloseIcon,
  AttachmentIcon,
  HomeIcon,
  MessageIcon,
  ChevronRightIcon,
  HelpIcon,
  MenuIcon,
  SmileyIcon,
};
