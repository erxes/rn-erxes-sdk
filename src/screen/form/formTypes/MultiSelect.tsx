/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';

import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { TypeLabel } from '.';
import { isIphoneWithNotch } from '../../../utils/utils';
import colors from '../colors';
import { Animated } from 'react-native';
import { CheckIcon } from '../../../icons/icons';
const MultiSelect: React.FC<any> = (props) => {
  const { options, value, onChange, _id } = props;

  let values: string[] = [];
  if (value) {
    values = value.split(',,');
  }
  const { height } = Dimensions.get('window');
  const [isVisible, onVisible] = useState<boolean>(false);

  let panY = new Animated.Value(Dimensions.get('screen').height);

  let resetPositionAnim = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: false,
  });

  let closeAnim = Animated.timing(panY, {
    toValue: Dimensions.get('screen').height,
    duration: 300,
    useNativeDriver: false,
  });

  let top = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const onHide = () => {
    onVisible(false);
  };

  const handleDismiss = () => {
    closeAnim.start(() => onHide());
  };

  useEffect(() => {
    if (isVisible === true) {
      resetPositionAnim.start();
    }
  }, [isVisible]);

  const isSelected = (i: string) => {
    return values.indexOf(i) > -1 ? true : false;
  };

  const onSelect = (checkItem: any) => {
    const checked = values.indexOf(checkItem) > -1 ? true : false;
    if (checked) {
      values = values.filter((item) => item !== checkItem);
    } else {
      values.push(checkItem);
    }
    onChange({
      value: values.join(',,'),
      fieldId: _id,
    });
  };

  const renderItems = (e: any, i: number) => {
    return (
      <TouchableOpacity
        key={i}
        onPress={() => {
          onSelect(e);
        }}
      >
        <View
          style={[
            styles.listContainer,
            isSelected(e) ? { backgroundColor: colors.surfaceHighlight } : {},
          ]}
          key={i}
        >
          <Text style={{ marginStart: 5, marginEnd: 5, color: 'black' }}>
            {e}
          </Text>
          {values.indexOf(e) > -1 ? <CheckIcon /> : <View />}
        </View>
        <View style={{ borderBottomColor: 'grey', borderBottomWidth: 1 }} />
      </TouchableOpacity>
    );
  };

  const renderModal = () => {
    return (
      <Modal
        aria-expanded={false}
        visible={isVisible}
        onRequestClose={handleDismiss}
        animationType="fade"
        transparent={true}
        style={{ maxHeight: height - 400 }}
        // bottom
      >
        <Pressable
          style={{
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            flex: 1,
          }}
          onPress={handleDismiss}
        >
          <Animated.View style={[styles.containerAnimated, { top }]}>
            <View style={styles.sliderIndicatorRow}>
              <View
                style={[
                  styles.sliderIndicator,
                  { backgroundColor: colors.coreGray },
                ]}
              />
            </View>
            <View style={{ paddingBottom: isIphoneWithNotch() ? 30 : 0 }}>
              <View style={{ paddingHorizontal: 5, paddingTop: 10 }}>
                {options?.map((item: any, index: number) =>
                  renderItems(item, index)
                )}
              </View>
            </View>
          </Animated.View>
        </Pressable>
      </Modal>
    );
  };

  return (
    <View>
      {renderModal()}
      <TypeLabel {...props} />
      <TouchableOpacity onPress={() => onVisible(true)} style={styles.row}>
        {value ? (
          <>
            <View
              style={{
                backgroundColor: colors.surfaceHighlight,
                paddingHorizontal: 10,
                borderRadius: 8,
                width: '100%',
                borderColor: colors.primary,
                borderWidth: 1,
                paddingVertical: 5,
              }}
            >
              <View style={styles.row}>
                {values.map((item: any, index: number) => (
                  <View key={index}>
                    {values.length - 1 === index ? (
                      <Text style={{ color: 'black' }}>{item} </Text>
                    ) : (
                      <Text style={{ color: 'black' }}>{item}, </Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : (
          <View
            style={{
              width: '100%',
              borderRadius: 8,
              height: 55,
              justifyContent: 'center',
              paddingStart: 10,
              backgroundColor: colors.surfaceHighlight,
              borderColor: colors.primary,
              borderWidth: 1,
            }}
          >
            <Text style={{ color: 'black' }}>Choose</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default MultiSelect;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 10,
    alignItems: 'center',
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginVertical: 5,
    justifyContent: 'space-between',
  },
  containerAnimated: {
    backgroundColor: 'white',
    paddingTop: 12,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  sliderIndicatorRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderIndicator: {
    height: 4,
    width: 45,
    borderRadius: 8,
  },
});
