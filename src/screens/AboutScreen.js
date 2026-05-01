import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import { colors, spacing, radius, fontSizes } from '../theme/theme';

const AboutScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <ScreenHeader title="About" subtitle="Interest Calculator v1.0.0" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 20 }]} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#1E3A5F', '#0E1F35']} style={styles.logoCard}>
          <Text style={styles.appLogo}>💎</Text>
          <Text style={styles.appName}>Interest Calculator</Text>
          <Text style={styles.appSlogan}>Smart Finance Calculator</Text>
          <View style={styles.badgeRow}>
            <View style={styles.badge}><Text style={styles.badgeText}>v1.0.0</Text></View>
            <View style={[styles.badge, { borderColor: colors.teal + '60' }]}><Text style={[styles.badgeText, { color: colors.teal }]}>Free</Text></View>
          </View>
        </LinearGradient>
        <Text style={styles.sectionTitle}>✨ Features</Text>
        {['DPS Calculator (Simple & Compound)', 'FDR Calculator (All Compounding Frequencies)', 'EMI Calculator for Loans', 'Full Amortization Schedule', 'Goal Planner (Monthly SIP & Lump Sum)', 'Works completely offline'].map((f, i) => (
          <View key={i} style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={16} color={colors.teal} />
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
        <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>🔒 Privacy Policy</Text>
        <View style={styles.privacyCard}>
          <Text style={styles.privacyText}>
            <Text style={styles.bold}>Data Collection: </Text>Interest Calculator does not collect, store, or transmit any personal data. All calculations are performed entirely on your device.{'\n\n'}
            <Text style={styles.bold}>Permissions: </Text>The app only requires internet access for displaying advertisements.{'\n\n'}
            <Text style={styles.bold}>Advertisements: </Text>This app displays ads via Google AdMob. Google may use device identifiers to show relevant ads.{'\n\n'}
            <Text style={styles.bold}>Contact: </Text>support@interestcalculator.app
          </Text>
        </View>
        <View style={[styles.privacyCard, { borderColor: colors.gold + '40', marginTop: spacing.md }]}>
          <Text style={styles.privacyText}>
            <Text style={styles.bold}>⚠️ Disclaimer: </Text>This app is for informational purposes only. Actual bank rates may differ. Always consult your bank before making financial decisions.
          </Text>
        </View>
        <Text style={styles.footer}>Made with ❤️ for smart savers{'\n'}© {new Date().getFullYear()} Interest Calculator. All rights reserved.</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg },
  logoCard: { borderRadius: radius.xl, padding: spacing.xl, alignItems: 'center', marginBottom: spacing.lg, borderWidth: 1, borderColor: '#1E3A5F' },
  appLogo: { fontSize: 56, marginBottom: spacing.sm },
  appName: { color: colors.white, fontSize: fontSizes.xxxl, fontWeight: '800', letterSpacing: -1 },
  appSlogan: { color: colors.textSecondary, fontSize: fontSizes.sm, marginTop: 4 },
  badgeRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  badge: { paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.full, borderWidth: 1, borderColor: colors.blue + '60' },
  badgeText: { color: colors.blue, fontSize: fontSizes.xs, fontWeight: '700' },
  sectionTitle: { color: colors.textPrimary, fontSize: fontSizes.md, fontWeight: '700', marginBottom: spacing.sm },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  featureText: { color: colors.textSecondary, fontSize: fontSizes.sm },
  privacyCard: { backgroundColor: colors.bgCard, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  privacyText: { color: colors.textSecondary, fontSize: fontSizes.sm, lineHeight: 22 },
  bold: { color: colors.textPrimary, fontWeight: '700' },
  footer: { color: colors.textMuted, fontSize: fontSizes.xs, textAlign: 'center', marginTop: spacing.lg, lineHeight: 20 },
});

export default AboutScreen;
