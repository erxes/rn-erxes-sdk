import * as React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { ErxesSDK } from 'rn-erxes-sdk';

export default function App() {
  const runFirst =
    'window.erxesSettings = { messenger: { brand_id: "5fkS4v", pollInterval: 60000, css: ".topbar-button.right { visibility: hidden;} .erxes-launcher { visibility: hidden; }"}, }; (function () { var script = document.createElement(\'script\'); script.src = "https://w.office.erxes.io/build/messengerWidget.bundle.js"; script.async = true; var entry = document.getElementsByTagName(\'script\')[0]; entry.parentNode.insertBefore(script, entry); })(); true;';
  return (
    <SafeAreaView style={styles.container}>
      <ErxesSDK script={runFirst} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
