/* eslint-disable @typescript-eslint/no-shadow */
import { checkLogicFulfilled } from '../../utils/utils';
import React, { memo } from 'react';
import {
  MultiSelect,
  TypeCheckbox,
  TypeInput,
  TypeMap,
  TypeRadio,
  TypeSelect,
} from './formTypes';
import { StyleSheet, View } from 'react-native';

const RenderForm: React.FC<any> = (props) => {
  const { field, index, onChange, forms, value, hideField } = props;
  const updatedProps = {
    position: index,
    _id: field?._id,
    type: field?.type,
    text: field?.text,
    order: field?.order,
    isRequired: field?.isRequired,
    options: field?.options,
    description: field?.description,
    validation: field?.validation,
    logics: field?.logics,
    logicAction: field?.logicAction,
    column: field?.column,
    locationOptions: field?.locationOptions,
    withPosition: false,
    onChange,
    value,
  };

  if (field.logics && field.logics.length > 0) {
    const logics: any[] = field.logics.map((logic: any) => {
      const { validation, value, type } = forms[logic?.fieldId] || {};

      return {
        fieldId: logic.fieldId,
        operator: logic.logicOperator,
        logicValue: logic.logicValue,
        fieldValue: value,
        validation,
        type,
      };
    });

    const isLogicsFulfilled = checkLogicFulfilled(logics);

    if (field.logicAction && field.logicAction === 'show') {
      if (!isLogicsFulfilled) {
        hideField(field._id);
        return null;
      }
    }

    if (field.logicAction && field.logicAction === 'hide') {
      if (isLogicsFulfilled) {
        hideField(field._id);
        return null;
      }
    }
  }

  if (field?.type === 'radio') {
    return (
      <View style={styles.paddding}>
        <TypeRadio {...updatedProps} />
      </View>
    );
  }
  if (field?.type === 'map') {
    return (
      <View style={styles.paddding}>
        <TypeMap {...updatedProps} />
      </View>
    );
  }
  if (
    field?.type === 'datetime' ||
    field?.type === 'date' ||
    field?.type === 'input' ||
    field?.type === 'textarea' ||
    field?.type === 'email' ||
    field?.type === 'phone' ||
    field?.type === 'middleName' ||
    field?.type === 'lastName' ||
    field?.type === 'company_primaryName' ||
    field?.type === 'company_primaryEmail' ||
    field?.type === 'company_primaryPhone' ||
    field?.type === 'firstName'
  ) {
    return (
      <View style={styles.paddding}>
        <TypeInput {...updatedProps} />
      </View>
    );
  }

  if (field?.type === 'multiSelect') {
    return (
      <View style={styles.paddding}>
        <MultiSelect {...updatedProps} />
      </View>
    );
  }

  if (field?.type === 'select') {
    return (
      <View style={styles.paddding}>
        <TypeSelect {...updatedProps} />
      </View>
    );
  }

  if (field?.type === 'check') {
    return (
      <View style={styles.paddding}>
        <TypeCheckbox {...updatedProps} />
      </View>
    );
  }

  if (field?.type === 'html') {
    return null;
  }

  //   if (field?.type === 'file') {
  //     return (
  //       <View marginT-10>
  //         <TypeFile {...updatedProps} />
  //       </View>
  //     );
  //   }

  return null;
};

export default memo(RenderForm);

const styles = StyleSheet.create({
  paddding: {
    padding: 10,
  },
});
