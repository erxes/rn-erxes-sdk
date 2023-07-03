/* eslint-disable react-native/no-inline-styles */
import dayjs from 'dayjs';
import React from 'react';
import colors from '../colors';
import { Text, TouchableOpacity } from 'react-native';

const RenderCustomInput: React.FC<any> = ({
  props,
  toggle,

  placeholder,
  editable = true,
  containerStyle,
  mode,
}) => {
  const { value } = props;

  return (
    <TouchableOpacity
      activeOpacity={editable ? 0.6 : 1}
      style={[
        {
          borderWidth: 1,
          borderColor: colors.surface,
          borderRadius: 8,
          padding: 15,
          backgroundColor: colors.surfaceHighlight,
          flex: 2,
          marginLeft: mode === 'time' ? 10 : 0,
        },
        containerStyle,
      ]}
      onPress={() => {
        editable && toggle(true);
      }}
    >
      {mode === 'date' ? (
        <Text style={{ color: value ? colors.textPrimary : colors.coreGray }}>
          {value
            ? dayjs(value).format('YYYY-MM-DD')
            : placeholder
            ? placeholder
            : 'YYYY-MM-DD'}
        </Text>
      ) : (
        <Text style={{ color: value ? colors.textPrimary : colors.coreGray }}>
          {value ? value : placeholder}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default RenderCustomInput;
