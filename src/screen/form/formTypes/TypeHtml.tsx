import React, { forwardRef, useImperativeHandle } from 'react';
import RenderHTML from 'react-native-render-html';
import { Dimensions, View } from 'react-native';
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

const TypeHtml: React.ForwardRefRenderFunction<any, TTypeForm> = (
  props,
  ref
) => {
  const { text = '', _id, column, type, validation } = props;

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
    return { _id, column, text, type, validation, value: '' };
  }
  function isChanged() {
    return false;
  }

  return (
    <View marginV-5>
      <RenderHTML
        defaultTextProps={{
          maxFontSizeMultiplier: 1,
          style: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.textPrimary,
            marginTop: 10,
          },
        }}
        source={{ html: text }}
        contentWidth={Dimensions.get('window').width - 30}
      />
    </View>
  );
};

export default forwardRef(TypeHtml);
