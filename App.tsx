import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'react-native';
import { AuthStackParamList } from './src/navigation/AuthNavigator';
import Toast from 'react-native-toast-message';

const linking: LinkingOptions<AuthStackParamList> = {
  prefixes: ['fidelizagestao://'], // Prefixo correto
  config: {
    screens: {
      ResetPassword: 'reset-password/:token', // Captura o token
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
