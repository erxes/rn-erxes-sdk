import { View, StyleSheet } from 'react-native';
import React from 'react';
import { useMutation } from '@apollo/client';
import { widgetsLeadConnect } from './graphql/mutation';
import Form from './screen/form/Form';
import AppContext from './context/Context';

const FormWidget = (props: any) => {
  const { brandCode, formCode, connection, onSuccess, onError } = props;

  const [response, setResponse] = React.useState<any>(null);

  const [widgetLeadConnectMutation] = useMutation(widgetsLeadConnect);

  React.useEffect(() => {
    widgetLeadConnectMutation({
      variables: {
        brandCode: brandCode,
        formCode: formCode,
        cachedCustomerId: connection?.cachedCustomerId,
      },
    })
      .then((res: any) => {
        const tempDate = res?.data?.widgetsLeadConnect;
        setResponse(tempDate);
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updatedProps = {
    ...props,
    response,
  };

  return (
    <AppContext.Provider
      value={{
        formId: response?.form?._id,
        cachedCustomerId: connection?.cachedCustomerId,
        onSuccess,
        onError,
      }}
    >
      <View style={styles.container}>
        <Form {...updatedProps} />
      </View>
    </AppContext.Provider>
  );
};

export default FormWidget;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
