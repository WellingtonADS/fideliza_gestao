import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';

// --- Configuração da API ---
const API_BASE_URL = 'http://10.0.2.2:8000/api/v1';

// --- Definições de Tipos (TypeScript) ---
type ScreenType = 'login' | 'dashboard';

interface User {
  id: number;
  email: string;
  name: string;
  user_type: 'ADMIN' | 'COLLABORATOR' | 'CLIENT';
  company_id?: number;
}

interface AuthScreenProps {
  setAuthToken: React.Dispatch<React.SetStateAction<string | null>>;
}

interface DashboardScreenProps {
  user: User;
  authToken: string;
  setAuthToken: React.Dispatch<React.SetStateAction<string | null>>;
}

// --- Componente Principal da Aplicação ---
export default function App() {
  const [authToken, setAuthToken] = React.useState<string | null>(null);
  const [userData, setUserData] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const fetchUserData = async (token: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: User = await response.json();
      if (response.ok) {
        if (data.user_type === 'ADMIN' || data.user_type === 'COLLABORATOR') {
          setUserData(data);
        } else {
          Alert.alert("Acesso Negado", "Esta aplicação é apenas para Administradores e Colaboradores.");
          setAuthToken(null);
        }
      } else {
        setAuthToken(null);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do utilizador:', error);
      Alert.alert("Erro de Rede", "Não foi possível conectar ao servidor.");
      setAuthToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (authToken) {
      fetchUserData(authToken);
    } else {
      setUserData(null);
    }
  }, [authToken]);

  if (isLoading) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#1d4ed8" /></View>;
  }

  if (userData && authToken) {
    return <DashboardScreen user={userData} authToken={authToken} setAuthToken={setAuthToken} />;
  }
  
  return <LoginScreen setAuthToken={setAuthToken} />;
}

// --- Tela de Login (Sem alterações) ---
const LoginScreen: React.FC<AuthScreenProps> = ({ setAuthToken }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    setLoading(true);
    setError('');

    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    try {
      const response = await fetch(`${API_BASE_URL}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });
      const data = await response.json();
      if (response.ok) {
        setAuthToken(data.access_token);
      } else {
        setError(data.detail || 'Falha no login. Verifique as suas credenciais.');
      }
    } catch (e) {
      setError('Erro de conexão. Verifique a sua internet e o endereço da API.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.authContainer}>
        <Text style={styles.title}>Fideliza+ Gestão</Text>
        <Text style={styles.subtitle}>Acesso para Administradores e Colaboradores</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity onPress={handleLogin} disabled={loading} style={styles.button}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- Tela Principal (Dashboard) ---
const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, authToken, setAuthToken }) => {
  const [clientId, setClientId] = React.useState('');
  const [isAddingPoints, setIsAddingPoints] = React.useState(false);

  // NOVO: Estados para a gestão de colaboradores
  const [collaborators, setCollaborators] = React.useState<User[]>([]);
  const [newCollabName, setNewCollabName] = React.useState('');
  const [newCollabEmail, setNewCollabEmail] = React.useState('');
  const [newCollabPassword, setNewCollabPassword] = React.useState('');
  const [isAddingCollab, setIsAddingCollab] = React.useState(false);

  // Função para buscar a lista de colaboradores
  const fetchCollaborators = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/collaborators/`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      const data = await response.json();
      if (response.ok) {
        setCollaborators(data);
      }
    } catch (error) {
      console.error("Erro ao buscar colaboradores:", error);
    }
  };

  // Efeito para buscar os colaboradores quando um admin faz login
  React.useEffect(() => {
    if (user.user_type === 'ADMIN') {
      fetchCollaborators();
    }
  }, [user]);

  const handleAddPoints = async () => {
    if (!clientId) {
      Alert.alert("Atenção", "Por favor, insira o ID do cliente.");
      return;
    }
    setIsAddingPoints(true);
    try {
      const response = await fetch(`${API_BASE_URL}/points/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ client_identifier: clientId }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Sucesso!", `1 ponto foi adicionado com sucesso ao cliente ID ${clientId}.`);
        setClientId('');
      } else {
        Alert.alert("Erro", data.detail || "Não foi possível adicionar o ponto.");
      }
    } catch (error) {
      console.error("Erro ao adicionar pontos:", error);
      Alert.alert("Erro de Rede", "Não foi possível conectar ao servidor.");
    } finally {
      setIsAddingPoints(false);
    }
  };

  // NOVO: Função para adicionar um novo colaborador
  const handleAddCollaborator = async () => {
    if (!newCollabName || !newCollabEmail || !newCollabPassword) {
      Alert.alert("Atenção", "Preencha todos os campos para adicionar um colaborador.");
      return;
    }
    setIsAddingCollab(true);
    try {
      const response = await fetch(`${API_BASE_URL}/collaborators/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: newCollabName,
          email: newCollabEmail,
          password: newCollabPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Sucesso!", `Colaborador "${newCollabName}" adicionado.`);
        setNewCollabName('');
        setNewCollabEmail('');
        setNewCollabPassword('');
        fetchCollaborators(); // Atualiza a lista
      } else {
        Alert.alert("Erro", data.detail || "Não foi possível adicionar o colaborador.");
      }
    } catch (error) {
      console.error("Erro ao adicionar colaborador:", error);
      Alert.alert("Erro de Rede", "Não foi possível conectar ao servidor.");
    } finally {
      setIsAddingCollab(false);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.dashboardContainer}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Bem-vindo(a),</Text>
              <Text style={styles.headerName}>{user.name}!</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutButtonText}>Sair</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoCardLabel}>Email</Text>
            <Text style={styles.infoCardValue}>{user.email}</Text>
            <View style={styles.divider} />
            <Text style={styles.infoCardLabel}>Função</Text>
            <Text style={styles.infoCardValue}>{user.user_type}</Text>
          </View>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Pontuar Cliente</Text>
            <Text style={styles.featureSubtitle}>Insira o ID do cliente para adicionar um ponto.</Text>
            <TextInput style={styles.input} placeholder="ID do Cliente" value={clientId} onChangeText={setClientId} keyboardType="number-pad" />
            <TouchableOpacity onPress={handleAddPoints} disabled={isAddingPoints} style={styles.button}>
              {isAddingPoints ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Adicionar 1 Ponto</Text>}
            </TouchableOpacity>
          </View>

          {/* NOVO: Secção de Gestão de Colaboradores (apenas para Admins) */}
          {user.user_type === 'ADMIN' && (
            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>Gestão de Colaboradores</Text>
              
              {/* Lista de Colaboradores */}
              {collaborators.length > 0 ? (
                collaborators.map(collab => (
                  <View key={collab.id} style={styles.collabItem}>
                    <View>
                      <Text style={styles.collabName}>{collab.name}</Text>
                      <Text style={styles.collabEmail}>{collab.email}</Text>
                    </View>
                    {/* Botões de Ação (futuro) */}
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>Nenhum colaborador encontrado.</Text>
              )}

              <View style={styles.divider} />

              {/* Formulário para Adicionar Novo Colaborador */}
              <Text style={styles.featureSubtitle}>Adicionar Novo Colaborador</Text>
              <TextInput style={styles.input} placeholder="Nome do Colaborador" value={newCollabName} onChangeText={setNewCollabName} />
              <TextInput style={styles.input} placeholder="Email do Colaborador" value={newCollabEmail} onChangeText={setNewCollabEmail} keyboardType="email-address" autoCapitalize="none" />
              <TextInput style={styles.input} placeholder="Senha Provisória" value={newCollabPassword} onChangeText={setNewCollabPassword} secureTextEntry />
              <TouchableOpacity onPress={handleAddCollaborator} disabled={isAddingCollab} style={styles.button}>
                {isAddingCollab ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Adicionar Colaborador</Text>}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Folha de Estilos ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9fafb' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' },
  authContainer: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1d4ed8', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#4b5563', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 16, fontSize: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  button: { backgroundColor: '#1d4ed8', padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  errorText: { color: '#ef4444', textAlign: 'center', marginBottom: 16 },
  dashboardContainer: { padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  headerTitle: { fontSize: 24, color: '#374151' },
  headerName: { fontSize: 24, fontWeight: 'bold', color: '#1f2937' },
  logoutButton: { backgroundColor: '#fee2e2', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 99 },
  logoutButtonText: { color: '#dc2626', fontWeight: 'bold' },
  infoCard: { backgroundColor: 'white', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  infoCardLabel: { color: '#6b7280', fontSize: 14, marginBottom: 2 },
  infoCardValue: { color: '#1f2937', fontSize: 16, fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 16 },
  featureCard: { marginTop: 32, backgroundColor: 'white', borderRadius: 20, padding: 24 },
  featureTitle: { fontSize: 20, fontWeight: 'bold', color: '#1f2937', marginBottom: 4 },
  featureSubtitle: { fontSize: 14, color: '#6b7280', marginBottom: 20 },
  collabItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  collabName: { fontSize: 16, fontWeight: '500', color: '#1f2937' },
  collabEmail: { fontSize: 14, color: '#6b7280' },
  emptyText: { textAlign: 'center', color: '#6b7280', paddingVertical: 10 },
});
