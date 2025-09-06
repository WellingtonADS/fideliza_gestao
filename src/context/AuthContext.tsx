import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // CORRIGIDO: Removido o hífen extra
import { User, UserCredentials } from '../types/auth';
import * as api from '../services/api';
import axios from 'axios';

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  signIn: (credentials: UserCredentials) => Promise<void>;
  signOut: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signOut = useCallback(async () => {
    setToken(null);
    setUser(null);
    api.setAuthToken(undefined);
    await AsyncStorage.removeItem('userToken');
  }, []);

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
        console.error("Falha ao carregar sessão, limpando...", error);
        await signOut(); 
      } finally {
        setIsLoading(false);
      }
    };
    loadTokenFromStorage();
  }, [signOut]);

  const signIn = async (credentials: UserCredentials) => {
    try {
      const response = await api.login(credentials);
      const { access_token } = response.data;
      
      // Lógica robusta para evitar "race conditions"
      const profileResponse = await api.getMyProfile({
        headers: { 'Authorization': `Bearer ${access_token}` }
      });
      const profile = profileResponse.data;

      if (profile.user_type === 'ADMIN' || profile.user_type === 'COLLABORATOR') {
        api.setAuthToken(access_token);
        setUser(profile);
        setToken(access_token);
        await AsyncStorage.setItem('userToken', access_token);
      } else {
        throw new Error('Acesso negado. Esta aplicação é apenas para parceiros.');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new Error('Email ou senha inválidos.');
      }
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const profileResponse = await api.getMyProfile();
      setUser(profileResponse.data);
    } catch (error) {
      await signOut();
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedUser }));
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, signIn, signOut, refreshUser, updateUser }}>
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

