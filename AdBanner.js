import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/theme';

// AdMob will be added in v1.1 after app is live on Play Store
const AdBanner = ({ style }) => {
  return <View style={[styles.placeholder, style]} />;
};

const styles = StyleSheet.create({
  placeholder: {
    height: 0,
  },
});

export default AdBanner;