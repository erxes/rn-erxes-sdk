import dayjs from 'dayjs';
import { Dimensions, Platform } from 'react-native';

const url = 'https://office.erxes.io/gateway';

export function getAttachmentUrl(value: string) {
  if (value && !value.includes('https')) {
    return url + '/read-file?key=' + value;
  }
  return value;
}

export const strip_html = (string: any, withoutCut?: boolean) => {
  if (typeof string === 'undefined' || string === null) {
    return;
  } else {
    const regex = /(&nbsp;|<([^>]+)>)/gi;
    let result = string.replace(regex, '');
    result = result.replace(/&#[0-9][0-9][0-9][0-9];/gi, ' ');
    if (withoutCut) {
      return result;
    }
    const cut = result.slice(0, 70);
    return cut;
  }
};

// check if valid url
export const isValidURL = (u: string) => {
  try {
    return Boolean(new URL(u));
  } catch (e) {
    return false;
  }
};

export const isValidDate = (checkDate: any) => {
  const date = dayjs(checkDate);
  return date.isValid() ? new Date(checkDate) : undefined;
};

export const isIphoneWithNotch = () => {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTV &&
    (dimen.height === 780 ||
      dimen.width === 780 ||
      dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 844 ||
      dimen.width === 844 ||
      dimen.height === 896 ||
      dimen.width === 896 ||
      dimen.height === 926 ||
      dimen.width === 926 ||
      dimen.height === 932)
  );
};
export const checkLogicFulfilled = (logics: any[]) => {
  const values: { [key: string]: boolean } = {};

  for (const logic of logics) {
    const { fieldId, operator, logicValue, fieldValue, validation, type } =
      logic;
    const key = `${fieldId}_${logicValue}`;
    values[key] = false;

    // if fieldValue is set
    if (operator === 'hasAnyValue') {
      if (fieldValue) {
        values[key] = true;
      } else {
        values[key] = false;
      }
    }

    // if fieldValue is not set
    if (operator === 'isUnknown') {
      if (!fieldValue) {
        values[key] = true;
      } else {
        values[key] = false;
      }
    }

    // if fieldValue equals logic value
    if (operator === 'is') {
      if ((logicValue || '').toString() === (fieldValue || '').toString()) {
        values[key] = true;
      } else {
        values[key] = false;
      }
    }

    // if fieldValue not equal to logic value
    if (operator === 'isNot') {
      if (logicValue !== fieldValue) {
        values[key] = true;
      } else {
        values[key] = false;
      }
    }

    if (validation === 'number') {
      // if number value: is greater than
      if (operator === 'greaterThan' && fieldValue) {
        if (Number(fieldValue) > Number(logicValue)) {
          values[key] = true;
        } else {
          values[key] = false;
        }
      }

      // if number value: is less than
      if (operator === 'lessThan' && fieldValue) {
        if (Number(fieldValue) < Number(logicValue)) {
          values[key] = true;
        } else {
          values[key] = false;
        }
      }
    }

    if (typeof logicValue === 'string') {
      // if string value contains logicValue
      if (operator === 'contains') {
        if (String(fieldValue).includes(logicValue)) {
          values[key] = true;
        } else {
          values[key] = false;
        }
      }

      // if string value does not contain logicValue
      if (operator === 'doesNotContain') {
        if (!String(fieldValue).includes(logicValue)) {
          values[key] = true;
        } else {
          values[key] = false;
        }
      }

      // if string value startsWith logicValue
      if (operator === 'startsWith') {
        if (String(fieldValue).startsWith(logicValue)) {
          values[key] = true;
        } else {
          values[key] = false;
        }
      }

      // if string value endsWith logicValue
      if (operator === 'endsWith') {
        if (!String(fieldValue).endsWith(logicValue)) {
          values[key] = true;
        } else {
          values[key] = false;
        }
      }
    }

    if (validation && validation.includes('date')) {
      const dateValueToCheck = new Date(String(fieldValue));
      const logicDateValue = new Date(String(logicValue));

      // date is greather than
      if (operator === 'dateGreaterThan') {
        if (dateValueToCheck > logicDateValue) {
          values[key] = true;
        } else {
          values[key] = false;
        }
      }

      // date is less than
      if (operator === 'dateLessThan') {
        if (logicDateValue > dateValueToCheck) {
          values[key] = true;
        } else {
          values[key] = false;
        }
      }
    }

    if (type === 'check') {
      if (
        fieldValue &&
        typeof fieldValue === 'string' &&
        typeof logicValue === 'string'
      ) {
        if (operator === 'isNot') {
          if (!fieldValue.includes(logicValue)) {
            values[key] = true;
          } else {
            values[key] = false;
          }
        }

        if (operator === 'is') {
          if (fieldValue.includes(logicValue)) {
            values[key] = true;
          } else {
            values[key] = false;
          }
        }
      }
    }
  }

  const result = [];

  for (const key of Object.keys(values)) {
    result.push(values[key]);
  }

  if (result.filter((val) => !val).length === 0) {
    return true;
  }

  return false;
};
