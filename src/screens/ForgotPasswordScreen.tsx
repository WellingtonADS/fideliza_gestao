import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { requestPasswordRecovery } from '../services/api';
import Toast from 'react-native-toast-message';
import StyledTextInput from '../components/StyledTextInput';

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
        text2: response.data.message
      });
      navigation.navigate('Login');
    } catch (error) {
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
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Recuperar Senha</Text>
        <Text style={styles.subtitle}>
          Insira o seu e-mail para receber um link de redefinição.
        </Text>
        <StyledTextInput
          label="Email"
          placeholder="Digite o seu e-mail de registo"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={handlePasswordReset} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Enviar Link</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.footerText}>Voltar para o Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A2A',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3D5CFF',
    width: '100%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 30,
    color: '#FDD835',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ForgotPasswordScreen;
