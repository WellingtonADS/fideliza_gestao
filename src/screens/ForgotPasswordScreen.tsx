import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { requestPasswordRecovery } from '../services/api';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!email) {
      Toast.show({ type: 'info', text1: 'Atenção', text2: 'Por favor, insira o seu e-mail.' });
      return;
    }
    setIsLoading(true);
    try {
      const response = await requestPasswordRecovery(email);
      Toast.show({
        type: 'success',
        text1: 'Verifique o seu E-mail',
        text2: response.data.message || "Se uma conta com este e-mail existir, um link de recuperação foi enviado."
      });
      navigation.navigate('Login');
    } catch (error) {
      // Mesmo em caso de erro (ex: e-mail não encontrado), mostramos uma mensagem genérica por segurança.
      Toast.show({
        type: 'info',
        text1: 'Verifique o seu E-mail',
        text2: "Se uma conta com este e-mail existir, um link de recuperação foi enviado."
      });
      navigation.navigate('Login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Recuperar Senha</Text>
        <Text style={styles.subtitle}>
          Insira o seu e-mail para receber um link de redefinição.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o seu e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={handlePasswordReset} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Enviar Link</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>Voltar para o Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f9fafb' },
    container: { flex: 1, justifyContent: 'center', padding: 24 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#1d4ed8', textAlign: 'center', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#4b5563', textAlign: 'center', marginBottom: 32 },
    input: { backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 16, fontSize: 16, borderWidth: 1, borderColor: '#e5e7eb' },
    button: { backgroundColor: '#1d4ed8', padding: 16, borderRadius: 12, alignItems: 'center' },
    buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    backLink: { color: '#1d4ed8', textAlign: 'center', marginTop: 24, fontWeight: '500', fontSize: 16 },
});

export default ForgotPasswordScreen;
