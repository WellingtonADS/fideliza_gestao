// src/components/StyledTextInput.tsx
import React from 'react';
import { TextInput, StyleSheet, View, TextInputProps, Text } from 'react-native';

interface StyledTextInputProps extends TextInputProps {
  label: string;
}

const StyledTextInput = ({ label, ...props }: StyledTextInputProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#8A8A8A"
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    color: '#FFFFFF',
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    width: '100%',
  },
});

export default StyledTextInput;