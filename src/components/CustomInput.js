import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, radius, spacing, fontSizes } from '../theme/theme';

const CustomInput = ({ label, value, onChangeText, placeholder, prefix, suffix, keyboardType = 'numeric', hint }) => {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, focused && styles.inputRowFocused]}>
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder || '0'}
          placeholderTextColor={colors.textMuted}
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          selectionColor={colors.blue}
        />
        {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
      </View>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.md },
  label: { color: colors.textSecondary, fontSize: fontSizes.sm, marginBottom: spacing.xs, fontWeight: '600', letterSpacing: 0.3 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgSurface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, minHeight: 52 },
  inputRowFocused: { borderColor: colors.blue, borderWidth: 1.5 },
  prefix: { color: colors.textSecondary, fontSize: fontSizes.lg, marginRight: spacing.sm, fontWeight: '700' },
  input: { flex: 1, color: colors.textPrimary, fontSize: fontSizes.lg, fontWeight: '500', paddingVertical: spacing.sm },
  suffix: { color: colors.textSecondary, fontSize: fontSizes.sm, marginLeft: spacing.xs, fontWeight: '600' },
  hint: { color: colors.textMuted, fontSize: fontSizes.xs, marginTop: 4, marginLeft: 2 },
});

export default CustomInput;
