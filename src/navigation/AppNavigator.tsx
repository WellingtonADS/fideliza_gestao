import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';

import AuthNavigator from './AuthNavigator';
import AdminNavigator from './AdminNavigator';

/**
 * O AppNavigator é o router principal da aplicação.
 * Ele utiliza o AuthContext para verificar se o utilizador está autenticado.
 * - Se estiver a carregar, exibe um ecrã de loading.
 * - Se houver um token válido, renderiza o AdminNavigator (ecrãs de gestão).
 * - Caso contrário, renderiza o AuthNavigator (ecrã de login).
 */
const AppNavigator = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>A carregar...</Text>
      </View>
    );
  }

  return token ? <AdminNavigator /> : <AuthNavigator />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A2A',
  },
  loadingText: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 16,
  }
});

export default AppNavigator;
