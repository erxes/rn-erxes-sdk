/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { TypeLabel } from '.';
import { View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import colors from '../colors';
const TypeCheckbox: React.FC<any> = (props) => {
  const { options, onChange, value, _id } = props;

  const onCheckboxesChange = (checkItem: string) => {
    let values = value ? value.split(',,') : [];

    let checked = values.indexOf(checkItem) > -1 ? true : false;

    if (checked) {
      values = values.filter((item: string) => item !== checkItem);
    } else {
      values.push(checkItem);
    }
    onChange({
      value: values.join(',,'),
      fieldId: _id,
    });
  };

  return (
    <View>
      <TypeLabel {...props} />
      {options?.map((e: any, i: number) => {
        let values: string[] = [];
        if (value) {
          values = value.split(',,');
        }
        let checked = values.indexOf(e) > -1 ? true : false;
        return (
          <BouncyCheckbox
            key={i}
            iconImageStyle={{ tintColor: colors.primary }}
            innerIconStyle={{
              borderRadius: 0,
              borderWidth: 2,
              borderColor: colors.primary,
            }}
            disableBuiltInState={true}
            isChecked={checked}
            text={e}
            textStyle={{
              textDecorationLine: 'none',
              fontSize: 14,
              color: 'black',
            }}
            size={23}
            fillColor="none"
            style={{
              paddingTop: 10,
              paddingLeft: 10,
              paddingRight: 36,
            }}
            onPress={() => onCheckboxesChange(e)}
          />
        );
      })}
    </View>
  );
};

export default TypeCheckbox;
