import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import DashboardScreen from '../screens/DashboardScreen';
import ScannerScreen from '../screens/ScannerScreen';
import ManageCollaboratorsScreen from '../screens/ManageCollaboratorsScreen';
import ManageRewardsScreen from '../screens/ManageRewardsScreen';
import ReportsScreen from '../screens/ReportsScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import EditCompanyScreen from '../screens/EditCompanyScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

type ToastParams = {
  type: 'success' | 'error';
  text1: string;
  text2: string;
};

export type AdminStackParamList = {
    Dashboard: { toast?: ToastParams } | undefined;
    Scanner: undefined;
    ManageCollaborators: undefined;
    ManageRewards: undefined;
    Reports: undefined;
    Transactions: undefined;
    EditCompany: undefined;
    EditProfile: undefined;
};

const AdminStack = createNativeStackNavigator<AdminStackParamList>();

const screenOptions = {
  headerStyle: {
    backgroundColor: colors.surface,
  },
  headerTintColor: colors.text,
  headerTitleStyle: {
    fontWeight: '700' as '700',
  },
  headerBackTitleVisible: false,
  contentStyle: {
    backgroundColor: colors.background,
  },
};

const AdminNavigator = () => {
    return (
        <AdminStack.Navigator screenOptions={screenOptions}>
            <AdminStack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
            <AdminStack.Screen name="Scanner" component={ScannerScreen} options={{ title: 'Escanear QR Code' }} />
            <AdminStack.Screen name="ManageCollaborators" component={ManageCollaboratorsScreen} options={{ title: 'Gestão de colaboradores' }}/>
            <AdminStack.Screen name="ManageRewards" component={ManageRewardsScreen} options={{ title: 'Gestão de prêmios' }} />
            <AdminStack.Screen name="Reports" component={ReportsScreen} options={{ title: 'Relatórios' }} />
            <AdminStack.Screen name="Transactions" component={TransactionsScreen} options={{ title: 'Histórico de transações' }} />
            <AdminStack.Screen name="EditCompany" component={EditCompanyScreen} options={{ title: 'Editar Empresa' }} />
            <AdminStack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar Perfil' }} />
        </AdminStack.Navigator>
    );
};

export default AdminNavigator;

