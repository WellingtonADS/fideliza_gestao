import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { useAuth } from '../context/AuthContext';
import Toast from 'react-native-toast-message';
import StyledTextInput from '../components/StyledTextInput';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({ type: 'info', text1: 'Atenção', text2: 'Por favor, preencha o e-mail e a senha.' });
      return;
    }
    setIsLoading(true);
    try {
      await signIn({ email, password });
    } catch (error: any) {
      const message = error.message || 'Não foi possível fazer o login.';
      Toast.show({ type: 'error', text1: 'Erro de Autenticação', text2: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Icon name="login" size={30} color="#000" />
        <Text style={styles.title}>Login</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/images/logo_fideliza.png')} style={styles.logo} />
        </View>
        <Text style={styles.subtitle}>Fideliza+ Empresas</Text>

        <StyledTextInput
          label="Email"
          placeholder="Digite o seu e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <StyledTextInput
          label="Senha"
          placeholder="Digite a sua senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          showPasswordToggle
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Entrar</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.footerText}>Esqueceu a senha? <Text style={styles.link}>Clique aqui.</Text></Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 400, 
    height: 140, 
    resizeMode: 'contain',
  },
  subtitle: {
    fontSize: 24, // Aumentado o tamanho da fonte
    fontWeight: 'bold', // Alterado para negrito
    color: '#ffffffff',
    marginBottom: 40,
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
    color: '#B0B0B0',
    fontSize: 14,
  },
  link: {
    color: '#FDD835',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
