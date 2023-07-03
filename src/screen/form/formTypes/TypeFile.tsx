// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-native/no-inline-styles */
// import React, { useEffect, useState } from 'react';
// import { View, StyleSheet } from 'react-native';
// import { TextView, Touchable, useTheme, Utils } from 'react-native-erxes-ui';
// import { ImageView, IconCore, Uploader, ProcessingLoader } from '@components';
// import { useAlert } from '@hooks';
// import { TypeLabel } from '.';
// import FileViewer from 'react-native-file-viewer';
// import FastImage from 'react-native-fast-image';
// import RNFS from 'react-native-fs';
// import { getAttachmentUrl } from '@utils';

// const TypeFile: React.FC<any> = (props) => {
//   const { value, onChange, _id } = props;

//   const alert = useAlert();
//   const { colors } = useTheme();

//   const [isError, setError] = useState<any>(false);
//   const [isVisible, setVisible] = useState<boolean>(false);

//   const [isPreviewVisible, setPreviewVisible] = useState<boolean>(false);

//   useEffect(() => {
//     if (value.url) {
//       isError && setError(false);
//     }
//   }, [value]);

//   const renderAttachedFile = () => {
//     const url = getAttachmentUrl(value?.url);
//     const localFile = `${RNFS.DocumentDirectoryPath}/${value?.name}`;

//     return (
//       <ImageView
//         onPress={() => {
//           setPreviewVisible(true);

//           RNFS.downloadFile({
//             fromUrl: url,
//             toFile: localFile,
//             cacheable: true,
//           })
//             .promise.then(() => {
//               FileViewer.open(localFile, {
//                 onDismiss: () => setPreviewVisible(false),
//               }).catch((err) => {
//                 console.log(err.message);
//                 alert.error(err.message);
//               });
//             })
//             .catch((err) => {
//               setPreviewVisible(false);
//               console.log(err.message, err.code);
//               alert.error(err.message);
//             });
//         }}
//         style={[
//           styles.attachmentImage,
//           { backgroundColor: colors.surfaceHighlight },
//         ]}
//         resizeMode={FastImage.resizeMode.cover}
//         uri={value?.type?.includes('pdf') ? '' : url}
//         containerStyle={{ marginTop: 10 }}
//         onErrorComponent={
//           value?.type?.includes('pdf') ? (
//             <View style={{ alignItems: 'center' }}>
//               <IconCore
//                 name={Utils.getIconName(value?.name?.split('.').pop())}
//                 size={40}
//                 color={colors.secondary}
//               />
//             </View>
//           ) : null
//         }
//         onLoadEvent={undefined}
//         placeHolder={undefined}
//         touchRef={undefined}
//       />
//     );
//   };

//   return (
//     <View marginV-5>
//       <TypeLabel {...props} />
//       <ProcessingLoader
//         isVisible={isPreviewVisible}
//         onVisible={setPreviewVisible}
//       />
//       <Uploader
//         isVisible={isVisible}
//         onVisible={setVisible}
//         onUploadEnd={(result: any, file: any) => {
//           const val = {
//             name: file?.name,
//             size: file?.size,
//             type: file?.type,
//             url: result?.data,
//           };
//           onChange({
//             fieldId: _id,
//             value: val,
//           });
//         }}
//       />
//       {value?.url && renderAttachedFile()}
//       <Touchable
//         onPress={() => setVisible(true)}
//         style={[
//           {
//             marginTop: 10,
//             borderRadius: 5,
//             padding: 15,
//             backgroundColor: colors.surfaceHighlight,
//           },
//           {
//             borderColor: isError ? colors.coreRed : colors.borderPrimary,
//             borderWidth: isError ? 3 : 2,
//           },
//         ]}
//       >
//         <TextView
//           numberOfLines={2}
//           style={{
//             fontWeight: value.name ? '600' : '400',
//           }}
//           color={value?.name ? colors.textPrimary : colors.coreGray}
//         >
//           {value.name || 'Upload attachment'}
//         </TextView>
//       </Touchable>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   attachmentImage: {
//     height: 100,
//     width: 100,
//     borderRadius: 5,
//   },
// });

// export default TypeFile;
