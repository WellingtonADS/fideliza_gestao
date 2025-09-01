import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/DashboardScreen';
import ScannerScreen from '../screens/ScannerScreen';
import ManageCollaboratorsScreen from '../screens/ManageCollaboratorsScreen'; // 1. Importar
import ManageRewardsScreen from '../screens/ManageRewardsScreen';       // 2. Importar
import ReportsScreen from '../screens/ReportsScreen'; // 1. Importar
import TransactionsScreen from '../screens/TransactionsScreen'; // 2. Importar

type ToastParams = {
  type: 'success' | 'error';
  text1: string;
  text2: string;
};

export type AdminStackParamList = {
  Dashboard: { toast?: ToastParams } | undefined;
  Scanner: undefined;
  ManageCollaborators: undefined; // 3. Adicionar rota
  ManageRewards: undefined;       // 4. Adicionar rota
  Reports: undefined;             // 5. Adicionar rota
  Transactions: undefined;        // 6. Adicionar rota
};

const AdminStack = createNativeStackNavigator<AdminStackParamList>();

// Define títulos para os cabeçalhos dos ecrãs
const screenOptions = {
  headerStyle: {
    backgroundColor: '#0A0A2A',
  },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: {
    fontWeight: 'bold' as 'bold',
  },
  headerBackTitleVisible: false,
};

const AdminNavigator = () => {
  return (
    <AdminStack.Navigator screenOptions={screenOptions}>
      <AdminStack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }}/>
      <AdminStack.Screen name="Scanner" component={ScannerScreen} options={{ title: 'Escanear QR Code' }}/>
      <AdminStack.Screen name="ManageCollaborators" component={ManageCollaboratorsScreen} options={{ title: 'Gestão de Colaboradores' }}/>
      <AdminStack.Screen name="ManageRewards" component={ManageRewardsScreen} options={{ title: 'Gestão de Prémios' }}/>
      <AdminStack.Screen name="Reports" component={ReportsScreen} options={{ title: 'Relatórios' }}/>
      <AdminStack.Screen name="Transactions" component={TransactionsScreen} options={{ title: 'Transações' }}/>
    </AdminStack.Navigator>
  );
};

export default AdminNavigator;