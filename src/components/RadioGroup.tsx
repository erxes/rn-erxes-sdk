import React from 'react';
import { StyleSheet, View } from 'react-native';

import RadioButton from './RadioButton';
import type { RadioGroupProps } from './types';

export default function RadioGroup({
  containerStyle,
  layout = 'column',
  onPress,
  radioButtons,
  selectedValue,
  testID,
}: RadioGroupProps) {
  function handlePress(selected: any) {
    if (selected !== selectedValue && onPress) {
      onPress(selected);
    }
  }

  return (
    <View
      style={[styles.container, { flexDirection: layout }, containerStyle]}
      testID={testID}
    >
      {radioButtons.map((button) => {
        return (
          <RadioButton
            {...button}
            key={button.id}
            selected={button.value === selectedValue}
            onPress={() => handlePress(button)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
