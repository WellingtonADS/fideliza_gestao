import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { AppIcons, AppIconKey } from './iconNames';

export type IconComponentProps = {
  name?: string;          // Nome direto FontAwesome
  icon?: AppIconKey;      // Chave semântica mapeada
  size?: number;
  color?: string;
  label?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
};

const IconComponent: React.FC<IconComponentProps> = ({
  name,
  icon,
  size = 30,
  color = '#000',
  label,
  containerStyle,
  labelStyle,
}) => {
  const resolvedName = name || (icon ? AppIcons[icon] : 'question');
  return (
    <View style={[styles.container, containerStyle]}>
      <FontAwesome name={resolvedName} size={size} color={color} />
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  label: { marginTop: 5, fontSize: 14, color: '#333' },
});

export default IconComponent;
