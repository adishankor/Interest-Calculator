import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import { colors, spacing, radius, fontSizes } from '../theme/theme';

const VERSION = '1.0.0';
const CONTACT_EMAIL = 'support@depositiq.app'; // Change this to your email
const PRIVACY_POLICY_URL = 'https://yourwebsite.com/privacy'; // Change this to your privacy URL

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const InfoRow = ({ icon, label, value, onPress }) => (
  <TouchableOpacity style={styles.infoRow} onPress={onPress} disabled={!onPress} activeOpacity={0.7}>
    <Ionicons name={icon} size={18} color={colors.blue} style={styles.infoIcon} />
    <Text style={styles.infoLabel}>{label}</Text>
    {value && <Text style={styles.infoValue}>{value}</Text>}
    {onPress && <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />}
  </TouchableOpacity>
);

const AboutScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScreenHeader title="About" subtitle="DepositIQ v1.0.0" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 20 }]} showsVerticalScrollIndicator={false}>

        {/* App Logo Card */}
        <LinearGradient colors={['#1E3A5F', '#0E1F35']} style={styles.logoCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text style={styles.appLogo}>💎</Text>
          <Text style={styles.appName}>DepositIQ</Text>
          <Text style={styles.appSlogan}>Smart Finance Calculator</Text>
          <View style={styles.badgeRow}>
            <View style={styles.badge}><Text style={styles.badgeText}>v{VERSION}</Text></View>
            <View style={[styles.badge, { borderColor: colors.teal + '60' }]}><Text style={[styles.badgeText, { color: colors.teal }]}>Free</Text></View>
          </View>
        </LinearGradient>

        {/* Features List */}
        <Section title="✨ Features">
          {[
            { icon: 'calendar-outline', text: 'DPS Calculator (Simple & Compound)' },
            { icon: 'wallet-outline', text: 'FDR Calculator (All Compounding Frequencies)' },
            { icon: 'card-outline', text: 'EMI Calculator for Loans' },
            { icon: 'bar-chart-outline', text: 'Full Amortization Schedule' },
            { icon: 'trophy-outline', text: 'Goal Planner (Monthly SIP & Lump Sum)' },
            { icon: 'calculator-outline', text: 'All calculations work offline' },
          ].map((f, i) => (
            <View key={i} style={styles.featureItem}>
              <Ionicons name={f.icon} size={16} color={colors.blue} />
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </Section>

        {/* App Info */}
        <Section title="📋 App Info">
          <InfoRow icon="layers-outline" label="Version" value={VERSION} />
          <InfoRow icon="mail-outline" label="Contact" value={CONTACT_EMAIL}
            onPress={() => Linking.openURL(`mailto:${CONTACT_EMAIL}`)} />
          <InfoRow icon="shield-checkmark-outline" label="Privacy Policy"
            onPress={() => Linking.openURL(PRIVACY_POLICY_URL)} />
          <InfoRow icon="star-outline" label="Rate Us on Play Store"
            onPress={() => Alert.alert('Thank You!', 'Redirecting to Play Store...')} />
        </Section>

        {/* Privacy Policy Summary */}
        <Section title="🔒 Privacy Policy Summary">
          <View style={styles.privacyCard}>
            <Text style={styles.privacyText}>
              <Text style={styles.bold}>Data Collection: </Text>
              DepositIQ does not collect, store, or transmit any personal data. All calculations are performed entirely on your device.{'\n\n'}

              <Text style={styles.bold}>Permissions: </Text>
              The app only requires internet access for displaying advertisements (Google AdMob). No other permissions are used.{'\n\n'}

              <Text style={styles.bold}>Advertisements: </Text>
              This app displays ads via Google AdMob. Google may use device identifiers to show relevant ads. You can opt out via your device's ad settings.{'\n\n'}

              <Text style={styles.bold}>Third Party Services: </Text>
              Google AdMob (advertising). We do not share data with any other third parties.{'\n\n'}

              <Text style={styles.bold}>Children's Privacy: </Text>
              This app is not directed at children under 13. We do not knowingly collect information from children.{'\n\n'}

              <Text style={styles.bold}>Changes: </Text>
              We may update this policy occasionally. Continued use of the app means you accept any updates.{'\n\n'}

              <Text style={styles.bold}>Contact: </Text>
              For privacy concerns, email us at {CONTACT_EMAIL}
            </Text>
          </View>
        </Section>

        {/* Disclaimer */}
        <Section title="⚠️ Disclaimer">
          <View style={[styles.privacyCard, { borderColor: colors.gold + '40' }]}>
            <Text style={styles.privacyText}>
              DepositIQ is designed for informational and educational purposes only. All calculations are based on standard financial formulas.{'\n\n'}
              Actual bank interest rates, terms, and maturity values may differ. Always consult your bank or a certified financial advisor before making financial decisions.{'\n\n'}
              The app developer is not responsible for any financial decisions made based on results from this app.
            </Text>
          </View>
        </Section>

        <Text style={styles.footer}>
          Made with ❤️ for smart savers{'\n'}© {new Date().getFullYear()} DepositIQ. All rights reserved.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg },
  logoCard: {
    borderRadius: radius.xl, padding: spacing.xl,
    alignItems: 'center', marginBottom: spacing.lg,
    borderWidth: 1, borderColor: '#1E3A5F',
  },
  appLogo: { fontSize: 56, marginBottom: spacing.sm },
  appName: { color: colors.white, fontSize: fontSizes.xxxl, fontWeight: '800', letterSpacing: -1 },
  appSlogan: { color: colors.textSecondary, fontSize: fontSizes.sm, marginTop: 4 },
  badgeRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  badge: {
    paddingHorizontal: spacing.md, paddingVertical: 4,
    borderRadius: radius.full, borderWidth: 1,
    borderColor: colors.blue + '60',
  },
  badgeText: { color: colors.blue, fontSize: fontSizes.xs, fontWeight: '700' },
  section: { marginBottom: spacing.lg },
  sectionTitle: { color: colors.textPrimary, fontSize: fontSizes.md, fontWeight: '700', marginBottom: spacing.sm },
  featureItem: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  featureText: { color: colors.textSecondary, fontSize: fontSizes.sm },
  infoRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
    backgroundColor: colors.bgCard, paddingHorizontal: spacing.md,
    marginBottom: 1, borderRadius: radius.sm,
  },
  infoIcon: { marginRight: spacing.sm },
  infoLabel: { color: colors.textSecondary, fontSize: fontSizes.sm, flex: 1 },
  infoValue: { color: colors.textPrimary, fontSize: fontSizes.sm, fontWeight: '600', marginRight: spacing.sm },
  privacyCard: {
    backgroundColor: colors.bgCard, borderRadius: radius.lg,
    padding: spacing.md, borderWidth: 1, borderColor: colors.border,
  },
  privacyText: { color: colors.textSecondary, fontSize: fontSizes.sm, lineHeight: 22 },
  bold: { color: colors.textPrimary, fontWeight: '700' },
  footer: {
    color: colors.textMuted, fontSize: fontSizes.xs,
    textAlign: 'center', marginTop: spacing.lg,
    lineHeight: 20,
  },
});

export default AboutScreen;
