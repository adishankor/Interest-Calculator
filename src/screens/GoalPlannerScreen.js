import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import CustomInput from '../components/CustomInput';
import ResultCard, { ResultRow } from '../components/ResultCard';
import AdBanner from '../components/AdBanner';
import { calculateGoalPlanner, formatCurrency } from '../utils/calculations';
import { colors, spacing, radius, fontSizes, shadows } from '../theme/theme';

const GoalPlannerScreen = ({ navigation }) => {
  const [targetAmount, setTargetAmount] = useState('');
  const [currentSavings, setCurrentSavings] = useState('');
  const [years, setYears] = useState('');
  const [annualRate, setAnnualRate] = useState('');
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const r = calculateGoalPlanner({ targetAmount, currentSavings, years, annualRate });
    if (!r) { Alert.alert('Invalid Input', 'Please fill in all required fields.'); return; }
    setResult(r);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Goal Planner" subtitle="Target-Based Savings Calculator" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#9D174D22', '#EC489922']} style={styles.infoBanner}>
          <Ionicons name="trophy" size={18} color={colors.coral} />
          <Text style={styles.infoText}>Enter your goal amount and timeline to find out how much to save monthly or invest today!</Text>
        </LinearGradient>
        <View style={styles.exampleRow}>
          {['🏠 House', '🚗 Car', '✈️ Trip', '📚 Education'].map((g) => (
            <View key={g} style={styles.exampleChip}><Text style={styles.exampleText}>{g}</Text></View>
          ))}
        </View>
        <CustomInput label="🎯 Target Amount" value={targetAmount} onChangeText={setTargetAmount} prefix="৳" placeholder="e.g. 1000000" hint="How much do you want to accumulate?" />
        <CustomInput label="💰 Current Savings (Optional)" value={currentSavings} onChangeText={setCurrentSavings} prefix="৳" placeholder="0" hint="How much have you already saved?" />
        <CustomInput label="⏳ Time to Reach Goal" value={years} onChangeText={setYears} suffix="years" placeholder="e.g. 5" />
        <CustomInput label="📈 Expected Annual Return" value={annualRate} onChangeText={setAnnualRate} suffix="% p.a." placeholder="e.g. 8" hint="Expected return from savings/investment" />
        <View style={styles.btnRow}>
          <TouchableOpacity style={[styles.btnCalc, shadows.button]} onPress={handleCalculate} activeOpacity={0.85}>
            <LinearGradient colors={['#EC4899', '#9D174D']} style={styles.btnGrad}>
              <Ionicons name="trophy-outline" size={20} color={colors.white} />
              <Text style={styles.btnText}>Plan My Goal</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnReset} onPress={() => { setTargetAmount(''); setCurrentSavings(''); setYears(''); setAnnualRate(''); setResult(null); }}>
            <Ionicons name="refresh-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        {result && (
          <>
            <ResultCard highlightValue={formatCurrency(result.monthlySIP)} highlightLabel="Monthly Savings Needed" gradColors={['#9D174D', '#EC4899']}>
              <ResultRow label="Your Goal" value={formatCurrency(result.targetAmount)} valueColor={colors.coral} large />
              <ResultRow label="Current Savings" value={formatCurrency(result.currentSavings)} />
              <ResultRow label="Future Value of Savings" value={formatCurrency(result.fvCurrentSavings)} valueColor={colors.teal} />
              <ResultRow label="Remaining to Build" value={formatCurrency(result.remainingGoal)} />
              <ResultRow label="Monthly Savings Required" value={formatCurrency(result.monthlySIP)} valueColor={colors.coral} large />
              <ResultRow label="Total Monthly Investment" value={formatCurrency(result.totalSIPInvestment)} />
              <ResultRow label="Interest You Will Earn" value={formatCurrency(result.sipInterestEarned)} valueColor={colors.teal} />
              <ResultRow label="Duration" value={`${result.years} years (${result.months} months)`} />
            </ResultCard>
            <View style={styles.orDivider}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.orLine} />
            </View>
            <ResultCard highlightValue={formatCurrency(result.lumpSum)} highlightLabel="One-Time Investment Today" gradColors={['#1D4ED8', '#3B82F6']}>
              <ResultRow label="Invest Today (Lump Sum)" value={formatCurrency(result.lumpSum)} valueColor={colors.blue} large />
              <ResultRow label="Your Goal Amount" value={formatCurrency(result.targetAmount)} />
              <ResultRow label="Growth on Lump Sum" value={formatCurrency(result.remainingGoal - result.lumpSum)} valueColor={colors.teal} />
              <ResultRow label="Annual Return Rate" value={`${result.annualRate}%`} />
              <ResultRow label="Period" value={`${result.years} years`} />
            </ResultCard>
          </>
        )}
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
      <AdBanner />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg },
  infoBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.coral + '30' },
  infoText: { color: colors.textSecondary, fontSize: fontSizes.sm, flex: 1, lineHeight: 20 },
  exampleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  exampleChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, backgroundColor: colors.bgCard, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border },
  exampleText: { color: colors.textSecondary, fontSize: fontSizes.xs, fontWeight: '600' },
  btnRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  btnCalc: { flex: 1, borderRadius: radius.md, overflow: 'hidden' },
  btnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: 16 },
  btnText: { color: colors.white, fontSize: fontSizes.md, fontWeight: '700' },
  btnReset: { width: 52, height: 52, borderRadius: radius.md, backgroundColor: colors.bgSurface, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  orDivider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.lg, gap: spacing.sm },
  orLine: { flex: 1, height: 1, backgroundColor: colors.border },
  orText: { color: colors.textSecondary, fontSize: fontSizes.sm, fontWeight: '700' },
});

export default GoalPlannerScreen;
