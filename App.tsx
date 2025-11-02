import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, LinkingOptions, DefaultTheme, Theme } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'react-native';
import { AuthStackParamList } from './src/navigation/AuthNavigator';
import Toast from 'react-native-toast-message';
import SplashScreen from 'react-native-splash-screen';
import { setBaseURL } from './src/services/api';
import { colors } from './src/theme/colors';

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
    // Override TEMPORÁRIO para validar acesso ao backend em produção (Render) no emulador
    // Remover após validação: o padrão em DEV é usar 10.0.2.2/localhost.
    setBaseURL('https://fideliza-backend.onrender.com/api/v1');
  }, []);

  const navTheme: Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.background,
      card: colors.background,
      text: colors.text,
      primary: colors.primary,
      border: colors.border,
      notification: colors.accent,
    },
  };

  return (
    <NavigationContainer linking={linking} theme={navTheme}>
      <AuthProvider>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <AppNavigator />
        {/* O Toast precisa de ser renderizado aqui para funcionar em toda a app */}
        <Toast /> 
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;

