import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { resetPassword } from '../services/api';
import Toast from 'react-native-toast-message';
import StyledTextInput from '../components/StyledTextInput';
import { colors } from '../theme/colors';

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
      Toast.show({ type: 'info', text1: 'Atenção', text2: 'Por favor, preencha todos os campos.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Erro', text2: 'As senhas não coincidem.' });
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(token, newPassword);
      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'A sua senha foi redefinida. Por favor, faça o login.'
      });
      navigation.navigate('Login');
    } catch (error: any) {
      const detail = error.response?.data?.detail || 'Não foi possível redefinir a senha.';
      Toast.show({ type: 'error', text1: 'Erro', text2: detail });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <StyledTextInput
          label="Token de recuperação"
          placeholder="Cole o token do seu e-mail"
          value={token}
          onChangeText={setToken}
        />
        <StyledTextInput
          label="Nova senha"
          placeholder="Digite a sua nova senha"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          showPasswordToggle
        />
        <StyledTextInput
          label="Confirmar nova senha"
          placeholder="Digite a nova senha novamente"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          showPasswordToggle
        />
        <TouchableOpacity style={styles.button} onPress={handleReset} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color={colors.text} /> : <Text style={styles.buttonText}>Salvar nova senha</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerText}>Voltar para o login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  button: {
    backgroundColor: colors.primary,
    width: '100%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 30,
    color: colors.accent,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ResetPasswordScreen;
