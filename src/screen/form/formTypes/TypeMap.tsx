/* eslint-disable react-native/no-inline-styles */
import React, { forwardRef, useImperativeHandle } from 'react';

import {
  Linking,
  Platform,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import colors from '../colors';

type TLogic = {
  fieldId: string;
  logicOperator?: string;
  logicValue?: any;
};
type TTypeForm = {
  _id: string;
  order?: number;
  text?: string;
  isRequired?: boolean;
  type: string;
  options?: string[];
  validation?: string;
  description?: string;
  position: number;
  logicAction?: string;
  logics: TLogic[];
  column?: number;
  fieldData?: any;
  isForm?: boolean;
  locationOptions?: any;
};

const TypeMap: React.ForwardRefRenderFunction<any, TTypeForm> = (
  props,
  ref
) => {
  const { locationOptions } = props;
  const { lng, lat } =
    locationOptions?.length > 0
      ? locationOptions[0]
      : props.fieldData?.value
      ? props.fieldData?.value
      : { lng: undefined, lat: undefined };

  useImperativeHandle(ref, () => ({
    isCompleted() {
      return isCompleted();
    },
    getResult() {
      return getResult();
    },
    isChanged() {
      return isChanged();
    },
  }));

  const isCompleted = () => {
    return true;
  };

  function getResult() {
    return undefined;
  }

  function isChanged() {
    return false;
  }

  function openMaps() {
    if (Platform.OS === 'android') {
      Linking.openURL(`geo:0,0?q=${lat},${lng}(destination)`).catch((err) =>
        console.error('An error occurred', err)
      );
    } else {
      Linking.openURL(
        `maps://maps.apple.com/?ll=${lat},${lng}&q=${'destination'}`
      ).catch((err) => console.error('An error occurred', err));
    }
  }

  const alert = (info: string, title: string = '') => {
    Alert.alert(title, info, []);
  };
  return (
    <View marginV-5>
      <TouchableOpacity
        onPress={() => {
          if (lng && lat) {
            openMaps();
          } else {
            alert('Undefined location');
          }
        }}
        style={[
          {
            marginTop: 10,
            borderRadius: 5,
            padding: 15,
            backgroundColor: colors.surface,
          },
          {
            borderColor: colors.primary,
            borderWidth: 1,
          },
        ]}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text numberOfLines={2}>Open map</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default forwardRef(TypeMap);
