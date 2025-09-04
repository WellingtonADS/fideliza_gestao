import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, Text, View } from 'react-native';

type IconComponentProps = {
  name: string;
  size?: number;
  color?: string;
  label?: string;
};

const IconComponent: React.FC<IconComponentProps> = ({ name, size = 30, color = '#000', label }) => {
  return (
    <View style={styles.container}>
      <Icon name={name} size={size} color={color} />
      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 5,
    fontSize: 14,
    color: '#333',
  },
});

export default IconComponent;
