import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { resetPassword } from '../services/api';

type ResetPasswordRouteProp = RouteProp<AuthStackParamList, 'ResetPassword'>;
type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

const ResetPasswordScreen = ({ navigation }: Props) => {
  const route = useRoute<ResetPasswordRouteProp>();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (route.params?.token) {
      setToken(route.params.token);
    }
  }, [route.params?.token]);

  const handleReset = async () => {
    if (!token || !newPassword || !confirmPassword) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(token, newPassword);
      Alert.alert(
        'Sucesso',
        'A sua senha foi redefinida. Por favor, faça o login.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      const detail = error.response?.data?.detail || 'Não foi possível redefinir a senha.';
      Alert.alert('Erro', detail);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Redefinir Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Token de Recuperação"
          value={token}
          onChangeText={setToken}
        />
        <TextInput
          style={styles.input}
          placeholder="Nova Senha"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Nova Senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleReset} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Salvar Nova Senha</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f9fafb' },
    container: { flex: 1, justifyContent: 'center', padding: 24 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#1d4ed8', textAlign: 'center', marginBottom: 32 },
    input: { backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 16, fontSize: 16, borderWidth: 1, borderColor: '#e5e7eb' },
    button: { backgroundColor: '#1d4ed8', padding: 16, borderRadius: 12, alignItems: 'center' },
    buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default ResetPasswordScreen;
