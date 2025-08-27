import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';

// Define os ecrãs e os seus parâmetros para o fluxo de autenticação
export type AuthStackParamList = {
  Login: undefined;
  // Futuramente, poderíamos adicionar aqui 'ForgotPassword', etc.
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
