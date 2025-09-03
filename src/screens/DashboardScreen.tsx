import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import { get } from '../services/api';
import { DashboardData } from '../types/gestao';

type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Scanner: undefined;
  Transactions: undefined;
  ManageCollaborators: undefined;
  ManageRewards: undefined;
  Reports: undefined;
  EditProfile: undefined;
  EditCompany: undefined;
};

type DashboardScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Dashboard'
>;

type Props = {
  navigation: DashboardScreenNavigationProp;
};

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }
  const { user, company, logout } = authContext;
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const response = await get('/reports/summary');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do dashboard.');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchDashboardData();
    });

    return unsubscribe;
  }, [navigation]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboardData().finally(() => setRefreshing(false));
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem a certeza de que deseja terminar a sessão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          onPress: () => logout(),
          style: 'destructive',
        },
      ],
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFFFFF" />
      }>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bem-vindo, {user?.name || 'Utilizador'}</Text>
        <Text style={styles.companyName}>{company?.name || 'Sua Empresa'}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {dashboardData?.unique_customers ?? 0}
          </Text>
          <Text style={styles.statLabel}>Clientes Únicos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {dashboardData?.total_points_awarded ?? 0}
          </Text>
          <Text style={styles.statLabel}>Pontos Atribuídos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {dashboardData?.total_rewards_redeemed ?? 0}
          </Text>
          <Text style={styles.statLabel}>Prémios Resgatados</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate('Scanner')}>
          <Icon name="qrcode-scan" size={30} color="#FFFFFF" />
          <Text style={styles.menuButtonText}>Escanear QR Code</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate('Transactions')}>
          <Icon name="history" size={30} color="#FFFFFF" />
          <Text style={styles.menuButtonText}>Histórico de Transações</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate('EditProfile')}>
          <Icon name="account-edit" size={30} color="#FFFFFF" />
          <Text style={styles.menuButtonText}>Editar Perfil</Text>
        </TouchableOpacity>

        {user?.user_type === 'ADMIN' && (
          <>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigation.navigate('ManageCollaborators')}>
              <Icon name="account-group" size={30} color="#FFFFFF" />
              <Text style={styles.menuButtonText}>Gerir Colaboradores</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigation.navigate('ManageRewards')}>
              <Icon name="gift" size={30} color="#FFFFFF" />
              <Text style={styles.menuButtonText}>Gerir Prémios</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigation.navigate('Reports')}>
              <Icon name="chart-bar" size={30} color="#FFFFFF" />
              <Text style={styles.menuButtonText}>Relatórios</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigation.navigate('EditCompany')}>
              <Icon name="store-edit" size={30} color="#FFFFFF" />
              <Text style={styles.menuButtonText}>Editar Empresa</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity
          style={[styles.menuButton, styles.logoutButton]}
          onPress={handleLogout}>
          <Icon name="logout" size={30} color="#FFFFFF" />
          <Text style={styles.menuButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A2A',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  companyName: {
    color: '#FDD835',
    fontSize: 18,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#1E1E3F',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '32%',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#A9A9A9',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuButton: {
    backgroundColor: '#1E1E3F',
    width: '48%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  menuButtonText: {
    color: '#FFFFFF',
    marginTop: 10,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#C62828', // Vermelho para indicar ação de saída
  },
});

export default DashboardScreen;

