import * as React from 'react';
import { StyleSheet, Text, Platform } from 'react-native';

export type IconProps = {
  name: string;
  color: string;
  size: number;
  direction: 'rtl' | 'ltr';
  allowFontScaling?: boolean;
};

let MaterialCommunityIcons: any;

try {
  // Optionally require vector-icons
  MaterialCommunityIcons =
    require('react-native-vector-icons/MaterialCommunityIcons').default;
} catch (e) {
  let isErrorLogged = false;

  // Fallback component for icons
  MaterialCommunityIcons = ({ color, size, ...rest }: any) => {
    if (!isErrorLogged) {
      if (!/(Cannot find module|Module not found|Cannot resolve module)/) {
        console.error('Error');
      }

      console.warn(
        `To remove this warning, try installing 'react-native-vector-icons'`
      );

      isErrorLogged = true;
    }

    return (
      <Text
        {...rest}
        style={[styles.icon, { color, fontSize: size }]}
        pointerEvents="none"
        selectable={false}
      >
        □
      </Text>
    );
  };
}

export const accessibilityProps =
  Platform.OS === 'web'
    ? {
        role: 'img',
        focusable: false,
      }
    : {
        accessibilityElementsHidden: true,
        importantForAccessibility:
          'no-hide-descendants' as 'no-hide-descendants',
      };

const defaultIcon = ({
  name,
  color,
  size,
  direction,
  allowFontScaling,
}: IconProps) => (
  <MaterialCommunityIcons
    allowFontScaling={allowFontScaling}
    name={name}
    color={color}
    size={size}
    style={[
      {
        transform: [{ scaleX: direction === 'rtl' ? -1 : 1 }],
        lineHeight: size,
      },
      styles.icon,
    ]}
    pointerEvents="none"
    selectable={false}
    {...accessibilityProps}
  />
);

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
});

export default defaultIcon;
