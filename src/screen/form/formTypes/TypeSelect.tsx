/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import colors from '../colors';
import Picker from '../../../components/Picker';
const TypeSelect: React.FC<any> = (props) => {
  const { options, _id, text, value, onChange } = props;

  const [isError, setError] = useState<any>(false);
  const [isVisible, onVisible] = useState(false);

  useEffect(() => {
    isError && setError(false);
  }, [value]);
  return (
    <View>
      <Text style={{ marginTop: 15, marginBottom: 10, color: 'black' }}>
        {text}
      </Text>
      <Picker
        data={options}
        placeholder={'Choose'}
        isVisible={isVisible}
        onVisible={onVisible}
        value={value}
        onChange={(val: any) => {
          onChange({
            fieldId: _id,
            value: val,
          });
        }}
        placeholderStyle={{
          backgroundColor: colors.surfaceHighlight,
          borderColor: colors.primary,
          borderWidth: 1,
        }}
      />
    </View>
  );
};

export default TypeSelect;
