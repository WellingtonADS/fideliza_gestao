import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';

// Define os ecrãs e os seus parâmetros para o fluxo de autenticação
export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token?: string }; // O token é opcional, pois pode vir do deep link
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const screenOptions = {
  headerShown: false, // Oculta o cabeçalho para todos os ecrãs de autenticação
};

const AuthNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator screenOptions={screenOptions}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
