import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'react-native';
import { AuthStackParamList } from './src/navigation/AuthNavigator';
import Toast from 'react-native-toast-message'; 

/**
 * Ponto de entrada principal da aplicação de Gestão.
 * * Responsabilidades:
 * 1. NavigationContainer: Inicializa o contexto de navegação.
 * 2. AuthProvider: Fornece o estado de autenticação (user, token, etc.) para toda a aplicação.
 * 3. AppNavigator: Componente que decide qual fluxo de navegação mostrar (Login ou Dashboard).
 * 4. StatusBar: Configura a aparência da barra de estado do dispositivo.
 */
const linking: LinkingOptions<AuthStackParamList> = {
  prefixes: ['fidelizagestao://'],
  config: {
    screens: {
      // Mapeia o caminho do URL para o nome do ecrã no seu navegador
      ResetPassword: 'reset-password',
    },
  },
};

const App = () => {
  return (
    <NavigationContainer linking={linking}>
      <AuthProvider>
        <StatusBar barStyle="light-content" backgroundColor="#0A0A2A" />
        <AppNavigator />
        <Toast />
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;
