import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserCredentials } from '../types/auth';
import { login as apiLogin, getMyProfile, setAuthToken } from '../services/api';
import axios from 'axios';

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  signIn: (credentials: UserCredentials) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTokenFromStorage = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
          setAuthToken(storedToken);
          const response = await getMyProfile();
          // Valida se o utilizador guardado é um parceiro
          if (response.data.user_type === 'ADMIN' || response.data.user_type === 'COLLABORATOR') {
            setToken(storedToken);
            setUser(response.data);
          } else {
            // Se for um cliente, força o logout da app de gestão
            await signOut();
          }
        }
      } catch (error) {
        console.error("Falha ao carregar sessão:", error);
        await signOut(); 
      } finally {
        setIsLoading(false);
      }
    };
    loadTokenFromStorage();
  }, []);

  const signIn = async (credentials: UserCredentials) => {
    try {
      const response = await apiLogin(credentials);
      const { access_token } = response.data;
      setAuthToken(access_token);
      
      const profileResponse = await getMyProfile();
      const profile = profileResponse.data;

      // LÓGICA CRÍTICA: Apenas permite o login de admins e colaboradores
      if (profile.user_type === 'ADMIN' || profile.user_type === 'COLLABORATOR') {
        setUser(profile);
        setToken(access_token);
        await AsyncStorage.setItem('userToken', access_token);
      } else {
        setAuthToken(undefined); // Limpa o token se não for do tipo correto
        throw new Error('Acesso negado. Esta aplicação é apenas para parceiros.');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          throw new Error('Email ou senha inválidos.');
        }
      }
      // Re-lança o erro para ser tratado na tela de login
      throw error;
    }
  };

  const signOut = async () => {
    setToken(null);
    setUser(null);
    setAuthToken(undefined);
    await AsyncStorage.removeItem('userToken');
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
