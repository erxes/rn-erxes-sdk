import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type RadioButtonProps = {
  borderColor?: string;
  borderSize?: number;
  color?: string;
  containerStyle?: StyleProp<ViewStyle>;
  description?: string;
  descriptionStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  id: string;
  key?: string;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  layout?: 'row' | 'column';
  onPress?: (id: string) => void;
  selected?: boolean;
  size?: number;
  testID?: string;
  value?: string;
};

export type RadioGroupProps = {
  containerStyle?: StyleProp<ViewStyle>;
  layout?: 'row' | 'column';
  onPress?: (selectedId: string) => void;
  radioButtons: RadioButtonProps[];
  selectedValue?: string;
  testID?: string;
};
