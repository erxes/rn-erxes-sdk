/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

const InputTools: React.FC<any> = (props: any) => {
  const { onSend, bgColor, sendIcon } = props;

  const [input, onInput] = useState<string>('');

  return (
    <View
      style={{
        paddingVertical: 5,
        alignItems: 'flex-end',
        flexDirection: 'row',
        marginBottom: 20,
        marginHorizontal: 20,
      }}
    >
      <TextInput
        placeholder={'Write a reply'}
        selectionColor={'#686868'}
        underlineColorAndroid={'transparent'}
        style={[styles.textInputStyle]}
        placeholderTextColor={'#686868'}
        value={input}
        onChangeText={(text) => {
          onInput(text);
        }}
        multiline={true}
        numberOfLines={5}
        // returnKeyType="send"
      />
      <TouchableOpacity
        style={[styles.sendStyle, { backgroundColor: bgColor }]}
        onPress={() => {
          onSend && onSend(input);
          onInput('');
        }}
      >
        {sendIcon}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sendStyle: {
    width: 40,
    height: 40,
    marginLeft: 10,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputStyle: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 20,
    maxHeight: 100,
    minHeight: 40,
    paddingTop: 12,
  },
});

export default InputTools;
