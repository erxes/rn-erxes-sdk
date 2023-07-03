/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Modal,
  TouchableOpacity,
  Text,
  Dimensions,
  Animated,
  Pressable,
} from 'react-native';
import { CheckIcon } from '../icons/icons';
import colors from '../screen/form/colors';

const getText = (item: any, valueType: any) => {
  return !valueType ? item : item[valueType];
};

const Picker: React.FC<any> = (props) => {
  const { height, width } = Dimensions.get('window');
  const {
    mode = 'SINGLE',
    value = [],
    data = [],
    onChange,
    placeholder = 'Choose',
    isVisible,
    onVisible,
    rightIcon,
    placeholderStyle,
    itemStyle,
    modalStyle,
    valueType,
    onDismiss,
    small = false,
  } = props;

  const [selections, setSelections] = useState<any[]>([]);
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
  useEffect(() => {
    if (value?.length > 0) {
      setSelections(value);
    } else {
      if (value === '') {
        setSelections([]);
      }
    }
  }, [value]);

  useEffect(() => {
    if (isVisible) {
      resetPositionAnim.start();
    }
  }, [isVisible]);

  const onSelect = (item: any) => {
    if (mode === 'SINGLE') {
      onChange([item]);
      onVisible(false);
      setSelections(selections?.includes(item) ? [] : [item]);
    } else {
      let temp = [...selections];
      if (selections?.length > 0 && selections.includes(item)) {
        temp = selections?.filter((el: number) => el !== item);
        return setSelections(temp);
      }
      temp.push(item);
      setSelections(temp);
    }
  };

  const onHide = () => {
    onChange && onChange(selections);
    onDismiss && onDismiss(selections);
    onVisible(false);
  };

  let top = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const handleDismiss = () => {
    closeAnim.start(() => onHide());
  };
  return (
    <>
      <Modal
        visible={isVisible}
        onRequestClose={() => handleDismiss()}
        transparent
        animationType="fade"
        style={[
          {
            width: width,
            paddingBottom: 25,
            maxHeight: height - 400,
            backgroundColor: colors.surface,
          },
          modalStyle,
        ]}
      >
        <Pressable
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            flex: 1,
            justifyContent: 'flex-end',
          }}
          onPress={() => handleDismiss()}
        >
          <View>
            <Animated.View style={[styles.containerAnimated, { top }]}>
              <View style={styles.sliderIndicatorRow}>
                <View
                  style={[
                    styles.sliderIndicator,
                    { backgroundColor: colors.coreGray },
                  ]}
                />
              </View>

              <FlatList
                data={data}
                contentContainerStyle={{
                  borderTopRightRadius: 8,
                  borderTopLeftRadius: 8,
                  minHeight: 200,
                }}
                // eslint-disable-next-line react/no-unstable-nested-components
                ItemSeparatorComponent={() => <View style={styles.divider} />}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      key={index.toString()}
                      onPress={() => {
                        if (mode === 'SINGLE') {
                          onVisible(false);
                          onHide();
                        }
                        onSelect(item);
                      }}
                    >
                      <View style={[styles.item, itemStyle]}>
                        <Text>{getText(item, valueType)}</Text>
                        {selections?.includes(item) && <CheckIcon />}
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </Animated.View>
          </View>
        </Pressable>
      </Modal>
      <TouchableOpacity onPress={() => onVisible(!isVisible)}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.surfaceHighlight,
              borderRadius: small ? 20 : 8,
              height: small ? 40 : 50,
            },
            placeholderStyle,
          ]}
        >
          <Text style={{ marginEnd: rightIcon ? 5 : 0, fontSize: 14 }}>
            {selections?.length === 1
              ? getText(selections[0], valueType)
              : selections?.length > 0
              ? JSON.stringify(selections).replace(/[.""*+?^${}()|[\]\\]/g, '')
              : placeholder}
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 40,
    marginVertical: 5,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.coreLightGray,
  },
  item: {
    padding: 16,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 60,
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

export default Picker;
