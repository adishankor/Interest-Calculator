import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing, fontSizes, shadows } from '../theme/theme';

// Single metric row inside a result section
export const ResultRow = ({ label, value, valueColor, large }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text
      style={[
        styles.rowValue,
        valueColor && { color: valueColor },
        large && styles.rowValueLarge,
      ]}>
      {value}
    </Text>
  </View>
);

// Progress bar for ratio display
export const RatioBar = ({ label1, label2, percent1, color1, color2 }) => (
  <View style={styles.ratioContainer}>
    <View style={styles.ratioBar}>
      <View
        style={[
          styles.ratioFill,
          { width: `${Math.min(percent1, 100)}%`, backgroundColor: color1 },
        ]}
      />
      <View style={[styles.ratioFill, { flex: 1, backgroundColor: color2 }]} />
    </View>
    <View style={styles.ratioLegend}>
      <View style={styles.legendItem}>
        <View style={[styles.dot, { backgroundColor: color1 }]} />
        <Text style={styles.legendLabel}>{label1}</Text>
        <Text style={styles.legendPct}>{percent1.toFixed(1)}%</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.dot, { backgroundColor: color2 }]} />
        <Text style={styles.legendLabel}>{label2}</Text>
        <Text style={styles.legendPct}>{(100 - percent1).toFixed(1)}%</Text>
      </View>
    </View>
  </View>
);

// Main result card with gradient highlight
const ResultCard = ({ title, highlightValue, highlightLabel, gradColors, children }) => (
  <View style={[styles.card, shadows.card]}>
    {/* Highlight strip */}
    <LinearGradient colors={gradColors || colors.gradPrimary} style={styles.highlight} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <Text style={styles.highlightLabel}>{highlightLabel || 'Result'}</Text>
      <Text style={styles.highlightValue}>{highlightValue}</Text>
    </LinearGradient>

    {/* Body rows */}
    <View style={styles.body}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  highlight: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  highlightLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: fontSizes.sm,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  highlightValue: {
    color: colors.white,
    fontSize: fontSizes.xxxl,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  body: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    flex: 1,
  },
  rowValue: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  rowValueLarge: {
    fontSize: fontSizes.xl,
    color: colors.teal,
  },
  ratioContainer: {
    marginTop: spacing.sm,
  },
  ratioBar: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  ratioFill: {
    height: '100%',
  },
  ratioLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
    marginLeft: 4,
  },
  legendPct: {
    color: colors.textPrimary,
    fontSize: fontSizes.xs,
    fontWeight: '700',
    marginLeft: 2,
  },
});

export default ResultCard;
