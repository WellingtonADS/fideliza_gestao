import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { requestPasswordRecovery } from '../services/api';
import Toast from 'react-native-toast-message';
import StyledTextInput from '../components/StyledTextInput';
import { colors } from '../theme/colors';

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
        <Text style={styles.subtitle}>
          Insira o seu e-mail para receber um link de redefinição.
        </Text>
        <StyledTextInput
          label="E-mail"
          placeholder="Digite o seu e-mail de registro"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={handlePasswordReset} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color={colors.text} /> : <Text style={styles.buttonText}>Enviar link</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
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
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    width: '100%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
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

export default ForgotPasswordScreen;
