/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { formDetail } from '../../graphql/query';
import { useMutation, useQuery } from '@apollo/client';
import RenderForm from './RenderForm';
import AppContext from '../../context/Context';
import colors from './colors';
import { widgetsSaveLead } from '../../graphql/mutation';

const Form = (props: any) => {
  const { response } = props;

  const { formId, cachedCustomerId, onSuccess, onError } =
    useContext(AppContext);

  const [mutationWidgetsSaveLead, { loading: loadingMutation }] =
    useMutation(widgetsSaveLead);

  const { data, loading } = useQuery(formDetail, {
    variables: {
      _id: formId,
    },
  });

  if (loading || !formId) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} size={'large'} />
      </View>
    );
  }

  const sendForm = (submissions: any[], callback: any) => {
    mutationWidgetsSaveLead({
      variables: {
        integrationId: response?.integration?._id,
        formId,
        submissions,
        browserInfo: {},
        cachedCustomerId,
      },
    })
      .then((res) => {
        if (res.errors) {
          return console.log(res, 'res');
        } else {
          if (res.data.widgetsSaveLead.status === 'error') {
            Alert.alert(res.data.widgetsSaveLead.errors[0].text, '', []);
          } else {
            onSuccess && onSuccess();
            callback && callback();
          }
        }
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  const updatedProps = {
    ...props,
    data: data?.formDetail?.fields || [],
    buttonText: data?.formDetail?.buttonText || 'Send',
    response,
    sendForm,
    loadingMutation,
    onError,
  };

  return <FormRender {...updatedProps} />;
};

export default Form;

const FormRender = (props: any) => {
  const { data, response, sendForm, loadingMutation, onError, buttonText } =
    props;

  const resetDocState = () => {
    const doc: any = {};
    for (const field of data) {
      let isHidden = false;

      if (
        field.logicAction &&
        field.logicAction === 'show' &&
        field.logics &&
        field.logics.length > 0
      ) {
        isHidden = true;
      }

      let value = '';

      if (field.type === 'html') {
        value = field?.content || '';
      }
      doc[field._id] = {
        text: field?.text,
        type: field?.type,
        validation: field?.validation,
        value,
        isHidden,
        column: field?.column,
        associatedFieldId: field?.associatedFieldId || '',
        isRequired: field?.isRequired,
      };
    }
    return doc;
  };
  const [doc, setDoc] = useState<any>(resetDocState());

  const onFieldValueChange = ({ fieldId, value }: any) => {
    const tempDoc = doc;

    if (tempDoc[fieldId].validation === 'multiSelect') {
      value = value.toString();
    }

    tempDoc[fieldId].value = value;

    setDoc({ ...tempDoc });
  };

  const hideField = (id: string) => {
    const tempDoc = doc;
    if (tempDoc[id].value !== '' || !tempDoc[id].isHidden) {
      tempDoc[id].value = '';
      tempDoc[id].isHidden = true;
      setDoc({ ...tempDoc });
    }
  };

  const renderQuestions = ({ item }: any) => {
    return (
      <RenderForm
        key={item._id}
        field={item}
        onChange={onFieldValueChange}
        value={doc[item._id]?.value || ''}
        forms={doc}
        hideField={hideField}
      />
    );
  };

  const onSend = () => {
    let submissions = [];
    let isCompleted = true;
    for (const key of Object.keys(doc)) {
      const field = {
        _id: key,
        type: doc[key].type,
        text: doc[key].text,
        value: doc[key]?.type === 'file' ? [doc[key].value] : doc[key].value,
        validation: doc[key].validation,
        associatedFieldId: doc[key].associatedFieldId,
        column: null,
      };
      if (doc[key].isRequired && field.value === '' && !doc[key]?.isHidden) {
        isCompleted = false;
      }
      if (!doc[key]?.isHidden) {
        submissions.push(field);
      }
      if (doc[key].type === 'multiSelect' || field.type === 'check') {
        doc[key] = {
          ...field,
          value: String(field.value).replace(new RegExp(',,', 'g'), ', '),
          isRequired: doc[key].isRequired,
        };
      }
    }
    if (isCompleted) {
      return (
        sendForm &&
        sendForm(submissions, () => {
          const temp = resetDocState();
          setDoc(temp);
        })
      );
    } else {
      Alert.alert('Please fill in all required fields', '', []);
    }
    return onError && onError();
  };

  const renderHeader = () => {
    const title = response?.form?.title || 'Title';
    const description = response?.form?.description || 'Description';
    return (
      <View style={styles.headerContainer}>
        <Text style={{ color: '#fff', fontWeight: '500', fontSize: 16 }}>
          {title}
        </Text>
        <Text
          style={{
            color: '#fff',
            fontWeight: '300',
            fontSize: 14,
            marginTop: 5,
          }}
        >
          {description}
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (data?.length === 0) {
      return null;
    }
    return (
      <View style={{ backgroundColor: 'white', paddingBottom: 10, flex: 1 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#8159C2',
            paddingVertical: 15,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 10,
            marginTop: 10,
            borderRadius: 10,
            flexDirection: 'row',
          }}
          onPress={() => onSend()}
          disabled={loadingMutation}
        >
          <Text style={{ color: '#fff', fontWeight: '500', fontSize: 15 }}>
            {buttonText}
          </Text>
          {loadingMutation ? (
            <ActivityIndicator
              size="small"
              color={'#fff'}
              style={{ marginLeft: 5 }}
            />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmpty = () => {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>No Data!</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 0 }}
        style={{ flex: 1 }}
        data={data}
        renderItem={renderQuestions}
        keyExtractor={(_, index) => index.toString()}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? 20 : 0,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: colors.primary,
  },
});
