import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import CustomInput from '../components/CustomInput';
import ResultCard, { ResultRow, RatioBar } from '../components/ResultCard';
import AdBanner from '../components/AdBanner';
import { calculateEMI, formatCurrency } from '../utils/calculations';
import { colors, spacing, radius, fontSizes, shadows } from '../theme/theme';

const EMIScreen = ({ navigation }) => {
  const [principal, setPrincipal] = useState('');
  const [annualRate, setAnnualRate] = useState('');
  const [months, setMonths] = useState('');
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const r = calculateEMI({ principal, annualRate, months });
    if (!r) {
      Alert.alert('Invalid Input', 'Please enter valid values for all fields.');
      return;
    }
    setResult(r);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="EMI Calculator" subtitle="Equated Monthly Installment" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#6D28D922', '#8B5CF622']} style={styles.infoBanner}>
          <Ionicons name="information-circle" size={18} color={colors.purple} />
          <Text style={styles.infoText}>
            Calculate your monthly loan repayment amount (EMI) based on loan amount, interest rate, and tenure.
          </Text>
        </LinearGradient>

        <CustomInput
          label="Loan Amount"
          value={principal}
          onChangeText={setPrincipal}
          prefix="৳"
          placeholder="e.g. 500000"
          hint="Total loan amount you want to borrow"
        />
        <CustomInput
          label="Annual Interest Rate"
          value={annualRate}
          onChangeText={setAnnualRate}
          suffix="% p.a."
          placeholder="e.g. 10.5"
        />
        <CustomInput
          label="Loan Tenure"
          value={months}
          onChangeText={setMonths}
          suffix="months"
          placeholder="e.g. 60"
          hint="e.g. 12 = 1 yr, 60 = 5 yrs, 240 = 20 yrs"
        />

        <View style={styles.btnRow}>
          <TouchableOpacity style={[styles.btnCalc, shadows.button]} onPress={handleCalculate} activeOpacity={0.85}>
            <LinearGradient colors={['#8B5CF6', '#6D28D9']} style={styles.btnGrad}>
              <Ionicons name="calculator-outline" size={20} color={colors.white} />
              <Text style={styles.btnText}>Calculate EMI</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnReset}
            onPress={() => { setPrincipal(''); setAnnualRate(''); setMonths(''); setResult(null); }}>
            <Ionicons name="refresh-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {result && (
          <>
            <ResultCard
              highlightValue={formatCurrency(result.emi)}
              highlightLabel="Monthly EMI"
              gradColors={['#6D28D9', '#8B5CF6']}>
              <ResultRow label="Loan Principal" value={formatCurrency(result.principal)} />
              <ResultRow label="Monthly EMI" value={formatCurrency(result.emi)} valueColor={colors.purple} large />
              <ResultRow label="Total Payment (Principal + Interest)" value={formatCurrency(result.totalPayment)} />
              <ResultRow label="Total Interest Payable" value={formatCurrency(result.totalInterest)} valueColor={colors.coral} />
              <ResultRow label="Interest Burden %" value={`${result.interestPercent.toFixed(1)}%`} valueColor={colors.coral} />
              <RatioBar
                label1="Principal"
                label2="Interest"
                percent1={result.principalPercent}
                color1={colors.purple}
                color2={colors.coral}
              />
            </ResultCard>

            {/* Quick action to view amortization */}
            <TouchableOpacity
              style={styles.amortBtn}
              onPress={() =>
                navigation.navigate('AmortizationCalculator', {
                  principal,
                  annualRate,
                  months,
                })
              }
              activeOpacity={0.8}>
              <Ionicons name="bar-chart-outline" size={18} color={colors.gold} />
              <Text style={styles.amortBtnText}>View Full Amortization Schedule →</Text>
            </TouchableOpacity>
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
  infoBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.lg,
    borderWidth: 1, borderColor: colors.purple + '30',
  },
  infoText: { color: colors.textSecondary, fontSize: fontSizes.sm, flex: 1, lineHeight: 20 },
  btnRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  btnCalc: { flex: 1, borderRadius: radius.md, overflow: 'hidden' },
  btnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: 16 },
  btnText: { color: colors.white, fontSize: fontSizes.md, fontWeight: '700' },
  btnReset: {
    width: 52, height: 52, borderRadius: radius.md,
    backgroundColor: colors.bgSurface, borderWidth: 1, borderColor: colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
  amortBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    marginTop: spacing.md, padding: spacing.md,
    backgroundColor: colors.bgCard, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.gold + '40',
    justifyContent: 'center',
  },
  amortBtnText: { color: colors.gold, fontSize: fontSizes.sm, fontWeight: '700' },
});

export default EMIScreen;
