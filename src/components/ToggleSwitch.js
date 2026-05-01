import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing, fontSizes } from '../theme/theme';

const ToggleSwitch = ({ options, selected, onSelect, activeColor }) => {
  return (
    <View style={styles.container}>
      {options.map((opt) => {
        const isActive = selected === opt;
        return (
          <TouchableOpacity key={opt} onPress={() => onSelect(opt)} style={[styles.option, isActive && [styles.optionActive, { backgroundColor: activeColor || colors.blue }]]} activeOpacity={0.8}>
            <Text style={[styles.label, isActive && styles.labelActive]}>{opt}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', backgroundColor: colors.bgSurface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 3, marginBottom: spacing.md },
  option: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: radius.sm },
  optionActive: { elevation: 6 },
  label: { color: colors.textSecondary, fontSize: fontSizes.sm, fontWeight: '600' },
  labelActive: { color: colors.white, fontWeight: '700' },
});

export default ToggleSwitch;
