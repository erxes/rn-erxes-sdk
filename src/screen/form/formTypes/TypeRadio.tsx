import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { TypeLabel } from '.';
import RadioGroup from '../../../components/RadioGroup';
import colors from '../colors';

const TypeRadio: React.FC<any> = (props) => {
  const { options, onChange, _id, value } = props;
  const data = options.map((e: any, i: number) => {
    return {
      id: i.toString(),
      label: e,
      value: e,
      color: colors.primary,
    };
  });
  const [selectValue, setSelectedValue] = useState<string>('');
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);
  return (
    <View>
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ marginTop: -5 }}
      >
        <TypeLabel {...props} />
      </View>
      <View>
        <RadioGroup
          // eslint-disable-next-line react-native/no-inline-styles
          containerStyle={{ alignItems: 'flex-start', paddingRight: 25 }}
          radioButtons={data}
          onPress={(selected: any) => {
            setSelectedValue(selected.value);
            onChange({
              fieldId: _id,
              value: selected.value,
            });
          }}
          selectedValue={selectValue}
        />
      </View>
    </View>
  );
};

export default TypeRadio;
