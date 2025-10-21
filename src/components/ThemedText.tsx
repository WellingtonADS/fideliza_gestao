import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type Variant = 'h1' | 'h2' | 'body' | 'small';

interface Props extends TextProps {
  variant?: Variant;
  muted?: boolean;
}

export const ThemedText: React.FC<Props> = ({ variant = 'body', muted, style, ...rest }) => {
  const base = typography[variant];
  return (
    <Text
      {...rest}
      style={[
        styles.text,
        { color: muted ? colors.textMuted : colors.text },
        base,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    includeFontPadding: false,
  },
});

export default ThemedText;
