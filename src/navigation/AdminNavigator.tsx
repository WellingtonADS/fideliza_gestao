import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/DashboardScreen';
import ScannerScreen from '../screens/ScannerScreen';

// Define o tipo para os parâmetros do toast
type ToastParams = {
  type: 'success' | 'error';
  text1: string;
  text2: string;
};


// Define os ecrãs e os seus parâmetros para o fluxo principal da aplicação de gestão
export type AdminStackParamList = {
  Dashboard: { toast?: ToastParams } | undefined;
  Scanner: undefined;
};

const AdminStack = createNativeStackNavigator<AdminStackParamList>();

const AdminNavigator = () => {
  return (
    <AdminStack.Navigator screenOptions={{ headerShown: false }}>
      <AdminStack.Screen name="Dashboard" component={DashboardScreen} />
      <AdminStack.Screen name="Scanner" component={ScannerScreen} />
    </AdminStack.Navigator>
  );
};

export default AdminNavigator;