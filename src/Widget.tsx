import { View, StyleSheet } from 'react-native';
import React from 'react';
import { useMutation } from '@apollo/client';
import { connect } from './graphql/mutation';
import Greetings from './screen/greetings/Greetings';
import Conversations from './screen/conversation/Conversations';

const Widget = (props: any) => {
  const { brandCode, email, hasBack, onBack, connection } = props;
  const [response, setResponse] = React.useState<any>(null);

  const [connectMutation] = useMutation(connect);

  React.useEffect(() => {
    connectMutation({
      variables: {
        brandCode,
        email,
        cachedCustomerId: connection?.cachedCustomerId,
        visitorId: connection?.visitorId,
        // if client passed email automatically then consider this as user
        isUser: Boolean(email),
      },
    })
      .then((res: any) => {
        setResponse(res);
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bgColor = response?.data?.widgetsMessengerConnect?.uiOptions?.color;
  const integrationId = response?.data?.widgetsMessengerConnect?.integrationId;
  const brand = response?.data?.widgetsMessengerConnect?.brand;

  if (!integrationId) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Greetings
        greetings={response?.data?.widgetsMessengerConnect?.messengerData}
        bgColor={bgColor}
        integrationId={integrationId}
        hasBack={hasBack}
        onBack={onBack}
      />
      {/* <TabBar index={index} setIndex={setIndex} bgColor={bgColor} /> */}
      {/* {index === 0 ? ( */}
      <Conversations
        customerId={connection?.cachedCustomerId}
        visitorId={connection?.visitorId}
        integrationId={integrationId}
        bgColor={bgColor}
        brand={brand}
      />
      {/* ) : (
        <FAQ knowledgeBaseTopicId={knowledgeBaseTopicId} />
      )} */}
    </View>
  );
};

export default Widget;

// const TabBar = (props: any) => {
//   const { index, setIndex, bgColor } = props;
//   return (
//     <View
//       style={{
//         backgroundColor: '#fff',
//         flexDirection: 'row',
//         padding: 3,
//         marginBottom: 3,
//         borderColor: '#E5E5E5',
//         borderWidth: 0.3,
//       }}
//     >
//       <TouchableOpacity onPress={() => setIndex(0)} style={{ flex: 1 }}>
//         <View
//           style={{
//             backgroundColor: index === 0 ? bgColor : 'transparent',
//             borderRadius: 5,
//             shadowColor: bgColor,
//             shadowOffset: {
//               width: 0,
//               height: index === 0 ? 2 : 0,
//             },
//             shadowOpacity: 0.5,
//             shadowRadius: index === 0 ? 3.84 : 0,
//             elevation: index === 0 ? 5 : 0,
//           }}
//         >
//           <Text
//             style={{
//               textAlign: 'center',
//               color: index === 0 ? 'white' : 'black',
//               paddingVertical: 10,
//               fontWeight: '600',
//             }}
//           >
//             Support
//           </Text>
//         </View>
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={() => setIndex(1)}
//         style={{
//           flex: 1,
//           backgroundColor: index === 1 ? bgColor : 'transparent',
//           borderRadius: 5,
//           shadowColor: bgColor,
//           shadowOffset: {
//             width: 0,
//             height: index === 1 ? 2 : 0,
//           },
//           shadowOpacity: 0.5,
//           shadowRadius: index === 1 ? 3.84 : 0,
//           elevation: index === 1 ? 5 : 0,
//         }}
//       >
//         <Text
//           style={{
//             paddingVertical: 10,
//             color: index === 1 ? 'white' : 'black',
//             textAlign: 'center',
//             fontWeight: '600',
//           }}
//         >
//           FAQ
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
