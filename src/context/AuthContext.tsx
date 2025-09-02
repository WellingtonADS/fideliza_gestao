import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserCredentials } from '../types/auth';
import * as api from '../services/api';
import axios from 'axios';

// Define o tipo para o contexto de autenticação
interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  signIn: (credentials: UserCredentials) => Promise<void>;
  signOut: () => void;
  refreshUser: () => Promise<void>; // 1. Adicione a função aqui
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
          api.setAuthToken(storedToken);
          const response = await api.getMyProfile();
           if (response.data.user_type === 'ADMIN' || response.data.user_type === 'COLLABORATOR') {
            setToken(storedToken);
            setUser(response.data);
          } else {
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
      const response = await api.login(credentials);
      const { access_token } = response.data;
      api.setAuthToken(access_token);
      
      const profileResponse = await api.getMyProfile();
      const profile = profileResponse.data;

      if (profile.user_type === 'ADMIN' || profile.user_type === 'COLLABORATOR') {
        setUser(profile);
        setToken(access_token);
        await AsyncStorage.setItem('userToken', access_token);
      } else {
        api.setAuthToken(undefined);
        throw new Error('Acesso negado. Esta aplicação é apenas para parceiros.');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) throw new Error('Email ou senha inválidos.');
      }
      throw error;
    }
  };

  const signOut = async () => {
    setToken(null);
    setUser(null);
    api.setAuthToken(undefined);
    await AsyncStorage.removeItem('userToken');
  };

  // 2. Implemente a função refreshUser
  const refreshUser = async () => {
    if (!token) return;
    try {
      const profileResponse = await api.getMyProfile();
      setUser(profileResponse.data);
    } catch (error) {
      await signOut();
    }
  };

  return (
    // 3. Adicione a função ao valor do provedor
    <AuthContext.Provider value={{ token, user, isLoading, signIn, signOut, refreshUser }}>
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

