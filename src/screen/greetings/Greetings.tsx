/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Social from './Social';
import Supporters from './Supporters';
import MaterialCommunityIcons from '../../icons/MaterialCommunityIcons';

const Greetings = (props: any) => {
  const { greetings, bgColor, integrationId, hasBack, onBack } = props;

  return (
    <SafeAreaView style={{ backgroundColor: bgColor || 'green' }}>
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
          <MaterialCommunityIcons
            allowFontScaling={false}
            name={'chevron-left'}
            size={24}
            color={'white'}
            direction="ltr"
          />
        </TouchableOpacity>
      ) : null}
      <View style={[styles.title]}>
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: '600', fontSize: 18 }}>
            {greetings?.messages?.greetings?.title}
          </Text>
          <View style={{ marginTop: 20 }}>
            <Social links={greetings?.links} />
          </View>
          <Text style={{ marginTop: 20, color: '#393C40' }}>
            {greetings?.messages?.greetings?.message}
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
