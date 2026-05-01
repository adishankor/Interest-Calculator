import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import CustomInput from '../components/CustomInput';
import ToggleSwitch from '../components/ToggleSwitch';
import ResultCard, { ResultRow, RatioBar } from '../components/ResultCard';
import AdBanner from '../components/AdBanner';
import { calculateDPS, formatCurrency } from '../utils/calculations';
import { colors, spacing, radius, fontSizes, shadows } from '../theme/theme';

const DPSScreen = ({ navigation }) => {
  const [monthlyDeposit, setMonthlyDeposit] = useState('');
  const [annualRate, setAnnualRate] = useState('');
  const [months, setMonths] = useState('');
  const [interestType, setInterestType] = useState('Compound');
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const r = calculateDPS({ monthlyDeposit, annualRate, months, isCompound: interestType === 'Compound' });
    if (!r) { Alert.alert('Invalid Input', 'Please enter valid positive values for all fields.'); return; }
    setResult(r);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="DPS Calculator" subtitle="Monthly Deposit Scheme" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#1E40AF22', '#3B82F622']} style={styles.infoBanner}>
          <Ionicons name="information-circle" size={18} color={colors.blue} />
          <Text style={styles.infoText}>DPS is a monthly installment savings scheme. Enter your monthly deposit, interest rate, and tenure to calculate maturity.</Text>
        </LinearGradient>
        <Text style={styles.sectionLabel}>Interest Type</Text>
        <ToggleSwitch options={['Simple', 'Compound']} selected={interestType} onSelect={setInterestType} activeColor={colors.blue} />
        <CustomInput label="Monthly Deposit Amount" value={monthlyDeposit} onChangeText={setMonthlyDeposit} prefix="৳" placeholder="e.g. 5000" hint="Amount you deposit each month" />
        <CustomInput label="Annual Interest Rate" value={annualRate} onChangeText={setAnnualRate} suffix="% p.a." placeholder="e.g. 7.5" />
        <CustomInput label="Tenure (Months)" value={months} onChangeText={setMonths} suffix="months" placeholder="e.g. 36" hint="12 = 1 year, 24 = 2 years, 60 = 5 years" />
        <View style={styles.btnRow}>
          <TouchableOpacity style={[styles.btnCalc, shadows.button]} onPress={handleCalculate} activeOpacity={0.85}>
            <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.btnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Ionicons name="calculator-outline" size={20} color={colors.white} />
              <Text style={styles.btnText}>Calculate</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnReset} onPress={() => { setMonthlyDeposit(''); setAnnualRate(''); setMonths(''); setResult(null); }}>
            <Ionicons name="refresh-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        {result && (
          <ResultCard highlightValue={formatCurrency(result.maturityAmount)} highlightLabel="Maturity Amount" gradColors={['#1E40AF', '#3B82F6']}>
            <ResultRow label="Monthly Deposit" value={formatCurrency(result.monthlyDeposit)} />
            <ResultRow label="Total Deposits Made" value={formatCurrency(result.totalDeposit)} />
            <ResultRow label="Total Interest Earned" value={formatCurrency(result.totalInterest)} valueColor={colors.teal} />
            <ResultRow label="Maturity Amount" value={formatCurrency(result.maturityAmount)} valueColor={colors.blue} large />
            <ResultRow label="Interest Gain Ratio" value={`${result.interestRatio.toFixed(2)}%`} valueColor={colors.gold} />
            <ResultRow label="Calculation Type" value={interestType + ' Interest'} />
            <RatioBar label1="Principal" label2="Interest" percent1={(result.totalDeposit / result.maturityAmount) * 100} color1={colors.blue} color2={colors.teal} />
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
  infoBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.blue + '30' },
  infoText: { color: colors.textSecondary, fontSize: fontSizes.sm, flex: 1, lineHeight: 20 },
  sectionLabel: { color: colors.textSecondary, fontSize: fontSizes.sm, fontWeight: '600', marginBottom: spacing.sm },
  btnRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  btnCalc: { flex: 1, borderRadius: radius.md, overflow: 'hidden' },
  btnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: 16 },
  btnText: { color: colors.white, fontSize: fontSizes.md, fontWeight: '700' },
  btnReset: { width: 52, height: 52, borderRadius: radius.md, backgroundColor: colors.bgSurface, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
});

export default DPSScreen;
