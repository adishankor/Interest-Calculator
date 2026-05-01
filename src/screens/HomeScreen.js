import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radius, fontSizes, shadows } from '../theme/theme';
import AdBanner from '../components/AdBanner';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.lg * 2 - spacing.md) / 2;

const CALCULATORS = [
  { id: 'DPS', title: 'DPS', subtitle: 'Monthly Deposit Scheme', icon: 'calendar-outline', gradColors: ['#1E40AF', '#3B82F6'], screen: 'DPSCalculator' },
  { id: 'FDR', title: 'FDR', subtitle: 'Fixed Deposit Receipt', icon: 'wallet-outline', gradColors: ['#065F46', '#10B981'], screen: 'FDRCalculator' },
  { id: 'EMI', title: 'EMI', subtitle: 'Loan Installment', icon: 'card-outline', gradColors: ['#6D28D9', '#8B5CF6'], screen: 'EMICalculator' },
  { id: 'AMORT', title: 'Amortization', subtitle: 'Loan Schedule', icon: 'bar-chart-outline', gradColors: ['#92400E', '#F59E0B'], screen: 'AmortizationCalculator' },
  { id: 'GOAL', title: 'Goal Planner', subtitle: 'Target Savings', icon: 'trophy-outline', gradColors: ['#9D174D', '#EC4899'], screen: 'GoalPlanner' },
  { id: 'ABOUT', title: 'About', subtitle: 'App Info & Privacy', icon: 'information-circle-outline', gradColors: ['#1F2937', '#374151'], screen: 'About' },
];

const CalculatorCard = ({ item, onPress }) => (
  <TouchableOpacity style={[styles.card, { width: CARD_WIDTH }]} onPress={() => onPress(item.screen)} activeOpacity={0.85}>
    <LinearGradient colors={item.gradColors} style={styles.cardGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <View style={styles.iconWrap}>
        <Ionicons name={item.icon} size={30} color="rgba(255,255,255,0.95)" />
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
      <View style={styles.arrowWrap}>
        <Ionicons name="arrow-forward-circle" size={20} color="rgba(255,255,255,0.5)" />
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        <LinearGradient colors={['#0D1829', '#080C14']} style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.appName}>💎 Interest Calculator</Text>
              <Text style={styles.tagline}>Smart Finance Calculator</Text>
            </View>
            <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate('About')}>
              <Ionicons name="settings-outline" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <LinearGradient colors={['#1E3A5F', '#0E1F35']} style={styles.heroBanner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.heroTitle}>Plan Smarter.{'\n'}Grow Faster. 🚀</Text>
            <Text style={styles.heroSub}>Calculate DPS, FDR, EMI, loan schedules and savings goals — all in one place.</Text>
          </LinearGradient>
        </LinearGradient>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Calculators</Text>
          <Text style={styles.sectionCount}>5 tools</Text>
        </View>
        <View style={styles.grid}>
          {CALCULATORS.map((item) => (
            <CalculatorCard key={item.id} item={item} onPress={(screen) => navigation.navigate(screen)} />
          ))}
        </View>
        <View style={styles.tipCard}>
          <Ionicons name="bulb-outline" size={18} color={colors.gold} />
          <Text style={styles.tipText}>💡 <Text style={{ color: colors.gold, fontWeight: '700' }}>Pro Tip:</Text> Use the Goal Planner to calculate how much to save monthly for a dream purchase!</Text>
        </View>
      </ScrollView>
      <AdBanner />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  appName: { color: colors.textPrimary, fontSize: fontSizes.xxl, fontWeight: '800', letterSpacing: -0.5 },
  tagline: { color: colors.textSecondary, fontSize: fontSizes.xs, marginTop: 2 },
  settingsBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.bgSurface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  heroBanner: { borderRadius: radius.xl, padding: spacing.lg, borderWidth: 1, borderColor: '#1E3A5F' },
  heroTitle: { color: colors.white, fontSize: fontSizes.xxl, fontWeight: '800', lineHeight: 34, marginBottom: spacing.sm },
  heroSub: { color: colors.textSecondary, fontSize: fontSizes.sm, lineHeight: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md },
  sectionTitle: { color: colors.textPrimary, fontSize: fontSizes.lg, fontWeight: '700' },
  sectionCount: { color: colors.textSecondary, fontSize: fontSizes.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.lg, gap: spacing.md },
  card: { borderRadius: radius.xl, overflow: 'hidden', ...shadows.card },
  cardGradient: { padding: spacing.md, minHeight: 140, justifyContent: 'space-between', overflow: 'hidden' },
  iconWrap: { width: 50, height: 50, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  cardTitle: { color: colors.white, fontSize: fontSizes.lg, fontWeight: '800', letterSpacing: -0.3 },
  cardSubtitle: { color: 'rgba(255,255,255,0.65)', fontSize: fontSizes.xs, marginTop: 2 },
  arrowWrap: { alignSelf: 'flex-end', marginTop: spacing.sm },
  tipCard: { margin: spacing.lg, backgroundColor: colors.bgCard, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.gold + '40', flexDirection: 'row', gap: spacing.sm },
  tipText: { color: colors.textSecondary, fontSize: fontSizes.sm, lineHeight: 20, flex: 1 },
});

export default HomeScreen;
