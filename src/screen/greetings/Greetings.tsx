/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, { useContext } from 'react';
import Social from './Social';
import Supporters from './Supporters';
import AppContext from '../../context/Context';

const Greetings = () => {
  const value = useContext(AppContext);

  const {
    greetings,
    hasBack,
    onBack,
    backIcon,
    bgColor,
    textColor,
    integrationId,
  } = value;

  return (
    <SafeAreaView style={{ backgroundColor: bgColor }}>
      {hasBack ? (
        <TouchableOpacity
          onPress={() => {
            onBack();
          }}
          style={[
            styles.backStyle,
            {
              backgroundColor: '#2F1F69',
            },
          ]}
        >
          {backIcon}
        </TouchableOpacity>
      ) : null}
      <View style={[styles.title]}>
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: '600', fontSize: 18, color: textColor }}>
            {greetings?.messages?.greetings?.title || 'Тавтай морилно уу'}
          </Text>
          <View style={{ marginTop: 20 }}>
            <Social links={greetings?.links} />
          </View>
          <Text style={{ marginTop: 20, color: textColor, opacity: 0.8 }}>
            {greetings?.messages?.greetings?.message ||
              'Хэрэв танд асуулт байвал бидэнд мэдэгдээрэй! Бид туслахдаа баяртай байх болно.'}
          </Text>
        </View>
        <Supporters integrationId={integrationId} />
      </View>
    </SafeAreaView>
  );
};

export default Greetings;

const styles = StyleSheet.create({
  title: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },

  backStyle: {
    width: 40,
    height: 40,
    marginLeft: 15,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
