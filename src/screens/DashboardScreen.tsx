import React, {
    useState,
    useEffect
} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import {
    useAuth
} from '../context/AuthContext';
import {
    NativeStackScreenProps
} from '@react-navigation/native-stack';
import {
    AdminStackParamList
} from '../navigation/AdminNavigator';
import * as api from '../services/api';
import Toast from 'react-native-toast-message';
import StyledTextInput from '../components/StyledTextInput';
import Icon from 'react-native-vector-icons/FontAwesome';

type Props = NativeStackScreenProps < AdminStackParamList, 'Dashboard' > ;

const DashboardScreen = ({
    navigation,
    route
}: Props) => {
    const {
        user,
        signOut
    } = useAuth();
    const [clientId, setClientId] = useState('');
    const [isAddingPoints, setIsAddingPoints] = useState(false);

    useEffect(() => {
        if (route.params?.toast) {
            Toast.show({ ...route.params.toast,
                visibilityTime: 4000
            });
            navigation.setParams({
                toast: undefined
            });
        }
    }, [route.params?.toast]);

    const handleAddPoints = async () => {
        if (!clientId) {
            Toast.show({
                type: 'info',
                text1: 'Atenção',
                text2: 'Por favor, insira o ID do cliente.'
            });
            return;
        }
        setIsAddingPoints(true);
        try {
            const response = await api.addPoints(clientId);
            Toast.show({
                type: 'success',
                text1: 'Sucesso!',
                text2: `1 ponto adicionado a ${response.data.client.name}.`
            });
            setClientId('');
        } catch (error: any) {
            const detail = error.response?.data?.detail || "Não foi possível adicionar o ponto.";
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: detail
            });
        } finally {
            setIsAddingPoints(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Bem-vindo(a),</Text>
                        <Text style={styles.headerName}>{user?.name}!</Text>
                    </View>
                    <TouchableOpacity onPress={signOut} style={styles.logoutButtonContainer}>
                        <Icon name="sign-out" size={20} color="#FDD835" />
                        <Text style={styles.logoutButton}>Sair</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Pontuar Cliente</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Scanner')}
                        style={[styles.button, { marginBottom: 16, backgroundColor: '#16a34a' }]}>
                        <Icon name="qrcode" size={20} color="#fff" style={styles.icon} />
                        <Text style={styles.buttonText}>Escanear QR Code</Text>
                    </TouchableOpacity>
                    <StyledTextInput label="Ou insira o ID do Cliente"
                        value={clientId}
                        onChangeText={setClientId}
                        keyboardType="number-pad"
                        placeholder="ID do Cliente" />
                    <TouchableOpacity onPress={handleAddPoints} disabled={isAddingPoints} style={styles.button}>
                        {isAddingPoints ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Adicionar 1 Ponto</Text>}
                    </TouchableOpacity>
                </View>

                {/* Menu Principal para ADMIN */}
                {user?.user_type === 'ADMIN' && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Menu Principal</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('ManageCollaborators')} style={styles.menuButton}>
                            <Icon name="users" size={20} color="#fff" style={styles.icon} />
                            <Text style={styles.buttonText}>Gerir Colaboradores</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('ManageRewards')} style={styles.menuButton}>
                            <Icon name="gift" size={20} color="#fff" style={styles.icon} />
                            <Text style={styles.buttonText}>Gerir Prémios</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Reports')} style={styles.menuButton}>
                            <Icon name="bar-chart" size={20} color="#fff" style={styles.icon} />
                            <Text style={styles.buttonText}>Ver Relatórios</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Transactions')} style={styles.menuButton}>
                            <Icon name="exchange" size={20} color="#fff" style={styles.icon} />
                            <Text style={styles.buttonText}>Ver Transações</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('EditCompany')} style={styles.menuButton}>
                            <Icon name="building" size={20} color="#fff" style={styles.icon} />
                            <Text style={styles.buttonText}>Editar Dados da Empresa</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Menu para COLABORADOR */}
                {user?.user_type === 'COLLABORATOR' && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Menu</Text>
                         <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={styles.menuButton}>
                            <Icon name="user" size={20} color="#fff" style={styles.icon} />
                            <Text style={styles.buttonText}>Editar Perfil</Text>
                        </TouchableOpacity>
                    </View>
                )}

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    closeButton: {
        fontSize: 16,
        color: '#FDD835',
        fontWeight: 'bold',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#0A0A2A'
    },
    container: {
        padding: 20
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    headerTitle: {
        fontSize: 24,
        color: '#FFFFFF'
    },
    headerName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF'
    },
    logoutButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoutButton: {
        fontSize: 16,
        color: '#FDD835',
        fontWeight: 'bold'
    },
    card: {
        backgroundColor: '#1E1E3F',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 16
    },
    button: {
        backgroundColor: '#3D5CFF',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center'
    },
    menuButton: {
        backgroundColor: '#3D5CFF',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold'
    },
    icon: {
        marginRight: 8,
    },
});

export default DashboardScreen;