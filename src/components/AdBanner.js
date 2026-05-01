import React from 'react';
import { View, StyleSheet } from 'react-native';

const AdBanner = ({ style }) => {
  return <View style={[styles.placeholder, style]} />;
};

const styles = StyleSheet.create({
  placeholder: { height: 0 },
});

export default AdBanner;
