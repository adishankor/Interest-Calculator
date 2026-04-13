import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

// Initialize Google Mobile Ads
let MobileAds;
try {
  MobileAds = require('react-native-google-mobile-ads').default;
} catch (e) {
  MobileAds = null;
}

export default function App() {
  useEffect(() => {
    if (MobileAds) {
      MobileAds()
        .initialize()
        .then(() => console.log('AdMob initialized'))
        .catch((e) => console.log('AdMob init error:', e));
    }
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
