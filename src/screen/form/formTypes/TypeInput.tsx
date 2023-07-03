/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';

import { TypeLabel } from '.';
import colors from '../colors';

const TypeInput: React.FC<any> = (props) => {
  const { type, validation, _id, onChange, value } = props;

  const [isError, setError] = useState<any>(false);

  useEffect(() => {
    isError && setError(false);
  }, [value]);

  const getkeyboardType = () => {
    if (type === 'phone' || validation === 'phone') {
      return 'phone-pad';
    }
    if (type === 'email' || validation === 'email') {
      return 'email-address';
    }
    if (validation === 'number') {
      return 'numeric';
    }
    return 'default';
  };

  return (
    <View>
      <TypeLabel {...props} />
      {/* {validation === 'date' ? (
        <DateTimePicker
          dateFormat={'YYYY-MM-DD'}
          containerStyle={[
            styles.date,
            {
              borderColor: isError ? 'red' : 'blue',
              borderWidth: isError ? 2 : 1,
            },
          ]}
          underlineColor={'transparent'}
          value={value}
          renderInput={(props: any, toggle: any) => (
            <RenderCustomInput
              props={props}
              toggle={toggle}
              label={text}
              mode={'date'}
            />
          )}
          onChange={(val: any) => {
            onChange({
              fieldId: _id,
              value: val,
            });
          }}
        />
      ) : validation === 'datetime' ? (
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <DateTimePicker
            enableErrors={false}
            dateFormat={'YYYY-MM-DD'}
            themeVariant="light"
            containerStyle={[
              styles.dateTime,
              {
                borderColor: isError ? 'red' : 'blue',
                borderWidth: isError ? 2 : 1,
                marginEnd: 5,
              },
            ]}
            label={text}
            underlineColor={'transparent'}
            value={isValidDate(value)}
            renderInput={(props: any, toggle: any) => (
              <RenderCustomInput
                props={props}
                toggle={toggle}
                label={text}
                mode={'date'}
              />
            )}
            onChange={(val: any) => {
              onChange({
                fieldId: _id,
                value: val,
              });
            }}
          />
          <DateTimePicker
            enableErrors={false}
            dateFormat={'YYYY-MM-DD'}
            containerStyle={[
              styles.dateTime,
              {
                borderColor: isError ? 'red' : 'blue',
                borderWidth: isError ? 2 : 1,
                marginEnd: 5,
              },
            ]}
            mode="time"
            themeVariant="light"
            value={isValidDate(value)}
            renderInput={(propss: any, toggle: any) => (
              <RenderCustomInput
                props={propss}
                toggle={toggle}
                label={text}
                placeholder={'HH-MM'}
                mode={'time'}
              />
            )}
            onChange={(val: any) => {
              onChange({
                fieldId: _id,
                value: val,
              });
            }}
          />
        </View>
      ) : ( */}
      <TextInput
        keyboardType={getkeyboardType()}
        value={value}
        onChangeText={(val: any) => {
          onChange({
            fieldId: _id,
            value: val,
          });
        }}
        multiline={type === 'textarea'}
        numberOfLines={type === 'textarea' ? 4 : 1}
        placeholderTextColor={colors.coreGray}
        placeholder={'Write here'}
        style={[
          styles.inputContainer,
          type === 'textarea' ? { height: 100 } : {},
          {
            color: 'black',
            borderColor: isError ? colors.coreRed : colors.primary,
            borderWidth: isError ? 2 : 1,
          },
        ]}
      />
      {/* )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  dateTime: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    paddingBottom: 5,
    marginTop: 10,
  },
  date: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    paddingBottom: 5,
    marginTop: 10,
  },
  logicTextContainer: {
    borderRadius: 10,
    alignSelf: 'flex-start',
    padding: 3,
    paddingHorizontal: 10,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
  },
});

export default TypeInput;
