import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import CustomInput from '../components/CustomInput';
import ToggleSwitch from '../components/ToggleSwitch';
import ResultCard, { ResultRow, RatioBar } from '../components/ResultCard';
import AdBanner from '../components/AdBanner';
import { calculateFDR, formatCurrency } from '../utils/calculations';
import { colors, spacing, radius, fontSizes, shadows } from '../theme/theme';

const COMPOUND_FREQ = ['Annual', 'Semi-Annual', 'Quarterly', 'Monthly'];

const FDRScreen = ({ navigation }) => {
  const [principal, setPrincipal] = useState('');
  const [annualRate, setAnnualRate] = useState('');
  const [years, setYears] = useState('');
  const [interestType, setInterestType] = useState('Compound');
  const [compoundFreq, setCompoundFreq] = useState('Quarterly');
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const r = calculateFDR({ principal, annualRate, years, isCompound: interestType === 'Compound', compoundFreq });
    if (!r) {
      Alert.alert('Invalid Input', 'Please enter valid positive values for all fields.');
      return;
    }
    setResult(r);
  };

  const handleReset = () => {
    setPrincipal('');
    setAnnualRate('');
    setYears('');
    setResult(null);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="FDR Calculator" subtitle="Fixed Deposit Receipt" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#06402022', '#10B98122']} style={styles.infoBanner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <Ionicons name="information-circle" size={18} color={colors.teal} />
          <Text style={styles.infoText}>
            FDR is a one-time lump sum investment held for a fixed period at a guaranteed interest rate. Enter your principal, rate, and duration.
          </Text>
        </LinearGradient>

        {/* Interest Type */}
        <Text style={styles.sectionLabel}>Interest Type</Text>
        <ToggleSwitch
          options={['Simple', 'Compound']}
          selected={interestType}
          onSelect={setInterestType}
          activeColor={colors.teal}
        />

        {/* Compound Frequency (only visible for compound) */}
        {interestType === 'Compound' && (
          <>
            <Text style={styles.sectionLabel}>Compounding Frequency</Text>
            <ToggleSwitch
              options={COMPOUND_FREQ}
              selected={compoundFreq}
              onSelect={setCompoundFreq}
              activeColor={colors.teal}
            />
          </>
        )}

        <CustomInput
          label="Principal Amount (Deposit)"
          value={principal}
          onChangeText={setPrincipal}
          prefix="৳"
          placeholder="e.g. 100000"
          hint="The lump sum amount you are depositing"
        />
        <CustomInput
          label="Annual Interest Rate"
          value={annualRate}
          onChangeText={setAnnualRate}
          suffix="% p.a."
          placeholder="e.g. 8.5"
        />
        <CustomInput
          label="Duration (Years)"
          value={years}
          onChangeText={setYears}
          suffix="years"
          placeholder="e.g. 3"
          hint="Enter decimal for months: e.g. 0.5 = 6 months"
        />

        <View style={styles.btnRow}>
          <TouchableOpacity style={[styles.btnCalc, shadows.button]} onPress={handleCalculate} activeOpacity={0.85}>
            <LinearGradient colors={['#10B981', '#065F46']} style={styles.btnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Ionicons name="calculator-outline" size={20} color={colors.white} />
              <Text style={styles.btnText}>Calculate</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnReset} onPress={handleReset}>
            <Ionicons name="refresh-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {result && (
          <ResultCard
            highlightValue={formatCurrency(result.maturityAmount)}
            highlightLabel="FDR Maturity Value"
            gradColors={['#065F46', '#10B981']}>
            <ResultRow label="Principal Invested" value={formatCurrency(result.principal)} />
            <ResultRow label="Total Interest Earned" value={formatCurrency(result.totalInterest)} valueColor={colors.teal} />
            <ResultRow label="Maturity Amount" value={formatCurrency(result.maturityAmount)} valueColor={colors.teal} large />
            <ResultRow label="Effective Annual Return" value={`${result.effectiveRate.toFixed(2)}%`} valueColor={colors.gold} />
            <ResultRow label="Interest on Principal" value={`${result.interestRatio.toFixed(2)}%`} />
            <ResultRow label="Calculation Method" value={`${interestType}${interestType === 'Compound' ? ` (${compoundFreq})` : ''}`} />
            <RatioBar
              label1="Principal"
              label2="Interest"
              percent1={(result.principal / result.maturityAmount) * 100}
              color1={colors.teal}
              color2={colors.gold}
            />
          </ResultCard>
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.teal + '30',
  },
  infoText: { color: colors.textSecondary, fontSize: fontSizes.sm, flex: 1, lineHeight: 20 },
  sectionLabel: { color: colors.textSecondary, fontSize: fontSizes.sm, fontWeight: '600', marginBottom: spacing.sm },
  btnRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  btnCalc: { flex: 1, borderRadius: radius.md, overflow: 'hidden' },
  btnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, paddingVertical: 16,
  },
  btnText: { color: colors.white, fontSize: fontSizes.md, fontWeight: '700' },
  btnReset: {
    width: 52, height: 52, borderRadius: radius.md,
    backgroundColor: colors.bgSurface, borderWidth: 1, borderColor: colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
});

export default FDRScreen;
