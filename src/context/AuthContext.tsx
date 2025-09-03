import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { User, UserCredentials } from '../types/auth';
import { CompanyDetails } from '../types/company';

// Interface do Contexto atualizada para incluir 'company'
interface AuthContextType {
  token: string | null;
  user: User | null;
  company: CompanyDetails | null; // Adicionado para gerir dados da empresa
  loading: boolean;
  login: (credentials: UserCredentials) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<CompanyDetails | null>(null); // Estado para a empresa
  const [loading, setLoading] = useState(true);

  // Função de logout atualizada para limpar todos os dados da sessão
  const logout = useCallback(async () => {
    setToken(null);
    setUser(null);
    setCompany(null);
    delete api.defaults.headers.Authorization;
    await AsyncStorage.clear(); // Limpa todo o storage para garantir
  }, []);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');
        const storedCompany = await AsyncStorage.getItem('company');
        
        if (storedToken && storedUser && storedCompany) {
          // Define o token no cabeçalho da API para validar a sessão
          api.defaults.headers.Authorization = `Bearer ${storedToken}`;
          // Valida o token com o backend para garantir que a sessão ainda é ativa
          const response = await api.get('/users/me');
          const currentUser = response.data;
          
          if (currentUser.company_admin || !currentUser.company_admin === false) { // Verifica se é Admin ou Colaborador
            setToken(storedToken);
            setUser(currentUser);
            setCompany(JSON.parse(storedCompany)); // Confia no company do storage após validar o user
          } else {
            // Se o tipo de utilizador for inválido, força o logout
            await logout();
          }
        }
      } catch (error) {
        console.error("Falha ao carregar a sessão, a limpar...", error);
        await logout();
      } finally {
        setLoading(false);
      }
    };
    loadStorageData();
  }, [logout]);

  // Função de login otimizada para usar a resposta da API diretamente
  const login = async (credentials: UserCredentials) => {
    try {
      const response = await api.post('/auth/token', {
        username: credentials.email,
        password: credentials.password
      });

      const { access_token, user_info, company_info } = response.data;

      // Verifica se o tipo de utilizador é válido antes de iniciar a sessão
      if (user_info.company_admin || !user_info.company_admin === false) {
        api.defaults.headers.Authorization = `Bearer ${access_token}`;
        
        setUser(user_info);
        setCompany(company_info);
        setToken(access_token);
        
        // Armazena todos os dados necessários no AsyncStorage
        await AsyncStorage.setItem('token', access_token);
        await AsyncStorage.setItem('user', JSON.stringify(user_info));
        await AsyncStorage.setItem('company', JSON.stringify(company_info));
      } else {
        throw new Error('Acesso negado. Esta aplicação é apenas para parceiros.');
      }
    } catch (error) {
      console.error("Erro no login:", error);
      // Melhora a mensagem de erro para o utilizador
      throw new Error('Email ou senha inválidos. Por favor, tente novamente.');
    }
  };

  // Função para atualizar os dados do utilizador
  const refreshUser = async () => {
    try {
      const response = await api.get('/users/me');
      setUser(response.data);
      await AsyncStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error("Não foi possível atualizar o utilizador, a terminar sessão...", error);
      await logout();
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, company, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook para consumir o contexto de forma segura e limpa
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

