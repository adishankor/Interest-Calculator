import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import CustomInput from '../components/CustomInput';
import AdBanner from '../components/AdBanner';
import { calculateAmortization, formatCurrency } from '../utils/calculations';
import { colors, spacing, radius, fontSizes, shadows } from '../theme/theme';

const AmortizationScreen = ({ navigation, route }) => {
  const params = route?.params || {};
  const [principal, setPrincipal] = useState(params.principal || '');
  const [annualRate, setAnnualRate] = useState(params.annualRate || '');
  const [months, setMonths] = useState(params.months || '');
  const [result, setResult] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const handleCalculate = () => {
    const r = calculateAmortization({ principal, annualRate, months });
    if (!r) { Alert.alert('Invalid Input', 'Please enter valid positive values.'); return; }
    setResult(r);
    setShowAll(false);
  };

  const displayedRows = result ? (showAll ? result.schedule : result.schedule.slice(0, 12)) : [];

  return (
    <View style={styles.container}>
      <ScreenHeader title="Amortization" subtitle="Month-by-Month Loan Breakdown" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#92400E22', '#F59E0B22']} style={styles.infoBanner}>
          <Ionicons name="information-circle" size={18} color={colors.gold} />
          <Text style={styles.infoText}>See exactly how much of each EMI goes to principal vs interest every month.</Text>
        </LinearGradient>
        <CustomInput label="Loan Amount" value={principal} onChangeText={setPrincipal} prefix="৳" placeholder="e.g. 1000000" />
        <CustomInput label="Annual Interest Rate" value={annualRate} onChangeText={setAnnualRate} suffix="% p.a." placeholder="e.g. 9.5" />
        <CustomInput label="Loan Tenure (Months)" value={months} onChangeText={setMonths} suffix="months" placeholder="e.g. 120" />
        <View style={styles.btnRow}>
          <TouchableOpacity style={[styles.btnCalc, shadows.button]} onPress={handleCalculate} activeOpacity={0.85}>
            <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.btnGrad}>
              <Ionicons name="list-outline" size={20} color={colors.white} />
              <Text style={styles.btnText}>Generate Schedule</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnReset} onPress={() => { setPrincipal(''); setAnnualRate(''); setMonths(''); setResult(null); }}>
            <Ionicons name="refresh-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        {result && (
          <>
            <View style={styles.summaryGrid}>
              <View style={[styles.summaryCard, { borderColor: colors.purple + '50' }]}>
                <Text style={styles.summaryLabel}>Monthly EMI</Text>
                <Text style={[styles.summaryValue, { color: colors.purple }]}>{formatCurrency(result.emi)}</Text>
              </View>
              <View style={[styles.summaryCard, { borderColor: colors.coral + '50' }]}>
                <Text style={styles.summaryLabel}>Total Interest</Text>
                <Text style={[styles.summaryValue, { color: colors.coral }]}>{formatCurrency(result.totalInterest)}</Text>
              </View>
              <View style={[styles.summaryCard, { borderColor: colors.teal + '50' }]}>
                <Text style={styles.summaryLabel}>Total Payment</Text>
                <Text style={[styles.summaryValue, { color: colors.teal }]}>{formatCurrency(result.totalPayment)}</Text>
              </View>
              <View style={[styles.summaryCard, { borderColor: colors.blue + '50' }]}>
                <Text style={styles.summaryLabel}>Principal</Text>
                <Text style={[styles.summaryValue, { color: colors.blue }]}>{formatCurrency(result.principal)}</Text>
              </View>
            </View>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, { flex: 0.5 }]}>Mo.</Text>
              <Text style={[styles.th, { flex: 1.3 }]}>Principal</Text>
              <Text style={[styles.th, { flex: 1.3 }]}>Interest</Text>
              <Text style={[styles.th, { flex: 1.4 }]}>Balance</Text>
            </View>
            {displayedRows.map((row, i) => (
              <View key={row.month} style={[styles.tableRow, i % 2 === 0 && styles.tableRowAlt]}>
                <Text style={[styles.td, { flex: 0.5, color: colors.textSecondary }]}>{row.month}</Text>
                <Text style={[styles.td, { flex: 1.3, color: colors.teal }]}>{formatCurrency(row.principal).replace('৳', '')}</Text>
                <Text style={[styles.td, { flex: 1.3, color: colors.coral }]}>{formatCurrency(row.interest).replace('৳', '')}</Text>
                <Text style={[styles.td, { flex: 1.4, color: colors.textPrimary }]}>{formatCurrency(row.balance).replace('৳', '')}</Text>
              </View>
            ))}
            {result.schedule.length > 12 && (
              <TouchableOpacity style={styles.showMoreBtn} onPress={() => setShowAll(!showAll)} activeOpacity={0.8}>
                <Text style={styles.showMoreText}>{showAll ? '▲ Show Less' : `▼ Show All ${result.schedule.length} Months`}</Text>
              </TouchableOpacity>
            )}
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
  infoBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.gold + '30' },
  infoText: { color: colors.textSecondary, fontSize: fontSizes.sm, flex: 1, lineHeight: 20 },
  btnRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm, marginBottom: spacing.lg },
  btnCalc: { flex: 1, borderRadius: radius.md, overflow: 'hidden' },
  btnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: 16 },
  btnText: { color: colors.white, fontSize: fontSizes.md, fontWeight: '700' },
  btnReset: { width: 52, height: 52, borderRadius: radius.md, backgroundColor: colors.bgSurface, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  summaryCard: { flex: 1, minWidth: '45%', backgroundColor: colors.bgCard, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1 },
  summaryLabel: { color: colors.textSecondary, fontSize: fontSizes.xs, marginBottom: 4, fontWeight: '600' },
  summaryValue: { fontSize: fontSizes.lg, fontWeight: '800' },
  tableHeader: { flexDirection: 'row', paddingVertical: spacing.sm, paddingHorizontal: spacing.sm, backgroundColor: colors.bgSurface, borderRadius: radius.sm, marginBottom: 2 },
  th: { color: colors.textSecondary, fontSize: fontSizes.xs, fontWeight: '700', textAlign: 'right' },
  tableRow: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: spacing.sm, borderRadius: 4 },
  tableRowAlt: { backgroundColor: colors.bgSurface + '80' },
  td: { fontSize: fontSizes.xs, textAlign: 'right', fontWeight: '500' },
  showMoreBtn: { alignItems: 'center', padding: spacing.md, backgroundColor: colors.bgCard, borderRadius: radius.md, marginTop: spacing.sm, borderWidth: 1, borderColor: colors.border },
  showMoreText: { color: colors.gold, fontSize: fontSizes.sm, fontWeight: '700' },
});

export default AmortizationScreen;
