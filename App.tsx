import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'react-native';
import { AuthStackParamList } from './src/navigation/AuthNavigator';
import Toast from 'react-native-toast-message';
import SplashScreen from 'react-native-splash-screen';

// Configuração de deep linking para a app de GESTÃO
// Backend envia o token como query param (?token=...), então mapeamos apenas o path
// para que o React Navigation injete automaticamente os query params em route.params.
const linking: LinkingOptions<AuthStackParamList> = {
  prefixes: ['fidelizagestao://'], // Prefixo correto para esta app
  config: {
    screens: {
      ResetPassword: 'reset-password',
    },
  },
};

const App = () => {
  React.useEffect(() => {
    SplashScreen.hide(); // Esconde o splash screen após o carregamento da aplicação
  }, []);

  return (
    <NavigationContainer linking={linking}>
      <AuthProvider>
        <StatusBar barStyle="light-content" backgroundColor="#0A0A2A" />
        <AppNavigator />
        {/* O Toast precisa de ser renderizado aqui para funcionar em toda a app */}
        <Toast /> 
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;

