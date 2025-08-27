import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'react-native';

/**
 * Ponto de entrada principal da aplicação de Gestão.
 * * Responsabilidades:
 * 1. NavigationContainer: Inicializa o contexto de navegação.
 * 2. AuthProvider: Fornece o estado de autenticação (user, token, etc.) para toda a aplicação.
 * 3. AppNavigator: Componente que decide qual fluxo de navegação mostrar (Login ou Dashboard).
 * 4. StatusBar: Configura a aparência da barra de estado do dispositivo.
 */
const App = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar barStyle="light-content" backgroundColor="#0A0A2A" />
        <AppNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;
