/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Text, View } from 'react-native';
import colors from '../colors';

const TypeLabel: React.FC<any> = ({
  position,
  text,
  isRequired,
  description,
  withPosition = true,
}) => {
  return (
    <View style={{ marginBottom: 0, marginTop: 5, paddingBottom: 5 }}>
      <View>
        <Text>
          {withPosition ? position + 1 + '. ' : ''}
          {text}
          {isRequired ? (
            <Text style={{ color: colors.coreRed }}> *</Text>
          ) : null}
        </Text>
      </View>
      {description ? (
        <Text style={{ fontSize: 13, color: colors.coreGray }}>
          {description}
        </Text>
      ) : null}
    </View>
  );
};

export default TypeLabel;
