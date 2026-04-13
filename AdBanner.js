import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/theme';

// ============================================================
// AdMob Banner Component
// IMPORTANT: Replace TEST IDs with your real AdMob IDs
// after getting approved by Google AdMob.
// Test IDs are used during development only.
// ============================================================

// Test Ad Unit IDs (use these during development)
const TEST_BANNER_ID = Platform.select({
  android: 'ca-app-pub-3940256099942544/6300978111',
  ios: 'ca-app-pub-3940256099942544/2934735716',
});

// YOUR REAL Ad Unit IDs (replace after AdMob approval)
// const REAL_BANNER_ID = Platform.select({
//   android: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
//   ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
// });

let BannerAd, BannerAdSize, TestIds;

try {
  const admob = require('react-native-google-mobile-ads');
  BannerAd = admob.BannerAd;
  BannerAdSize = admob.BannerAdSize;
  TestIds = admob.TestIds;
} catch (e) {
  BannerAd = null;
}

const AdBanner = ({ style }) => {
  if (!BannerAd) {
    // Return empty placeholder when AdMob not installed yet
    return <View style={[styles.placeholder, style]} />;
  }

  return (
    <View style={[styles.container, style]}>
      <BannerAd
        unitId={TEST_BANNER_ID}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => console.log('Ad loaded')}
        onAdFailedToLoad={(error) => console.log('Ad failed:', error)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgSurface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 4,
  },
  placeholder: {
    height: 0,
  },
});

export default AdBanner;
