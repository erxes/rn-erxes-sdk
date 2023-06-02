import React from 'react';
import { WebView } from 'react-native-webview';
import { Platform } from 'react-native';

export type PropTypes = {
  script: string;
};

const ErxesSDK: React.FC<PropTypes> = ({ script }) => {
  const onMessage = (data: any) => {
    const { notificationCount } = JSON.parse(data.nativeEvent.data);

    console.log('****************** ', notificationCount);
  };

  return (
    <WebView
      ref={() => {}}
      source={
        Platform.OS === 'ios'
          ? require('./index.html')
          : { uri: 'file:///android_asset/index.html' }
      }
      originWhitelist={['*']}
      sharedCookiesEnabled={true}
      cacheEnabled={true}
      allowFileAccess={true}
      domStorageEnabled={true}
      thirdPartyCookiesEnabled={true}
      // allowingReadAccessToURL
      // style={{ width: 200 }}
      onLoadEnd={(syntheticEvent) => {
        // update component to be aware of loading status
        const { nativeEvent } = syntheticEvent;
        console.log(nativeEvent.loading);
      }}
      javaScriptEnabled={true}
      onError={(er) => {
        console.log(er);
      }}
      startInLoadingState={true}
      // renderLoading={() => <Loader />}
      injectedJavaScript={script}
      // injectedJavaScriptBeforeContentLoaded={runFirst}

      // onNavigationStateChange={this.handleWebViewNavigationStateChange}
      onMessage={onMessage}
    />
  );
};

export default ErxesSDK;
