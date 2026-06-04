import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { messengerTheme } from '../../theme';

// RN port of the web messenger date-separator.tsx — a centered pill label with
// a hairline rule behind it.
const DateSeparator = ({ label }: { label: string }) => {
  return (
    <View style={styles.row}>
      <View style={styles.line} />
      <Text style={styles.label}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
};

export default DateSeparator;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: messengerTheme.spacing.md,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  label: {
    marginHorizontal: messengerTheme.spacing.md,
    fontSize: 12,
    fontWeight: '500',
    color: messengerTheme.colors.mutedText,
  },
});
