import axios, { AxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import { User, UserCredentials } from '../types/auth';
import { CompanyReport, PointTransaction, Reward, RewardCreate, CollaboratorCreate, CollaboratorUpdate } from '../types/gestao';
import { CompanyDetails } from '../types/company';

export interface RewardUpdate {
    name?: string;
    description?: string;
    points_required?: number;
}

// Base URLs para ambiente local (emulador/simulador)
const LOCAL_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8000/api/v1',
  ios: 'http://localhost:8000/api/v1',
  default: 'http://localhost:8000/api/v1',
});
// Produção: backend hospedado no Render
const PROD_BASE_URL = 'https://fideliza-backend.onrender.com/api/v1';

// BaseURL por ambiente (dev: local; prod: Render) — simples e previsível
const api = axios.create({
  baseURL: __DEV__ ? LOCAL_BASE_URL : PROD_BASE_URL,
});

// Interceptor de respostas para mensagens claras e sign-out em 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status as number | undefined;
    const detail = error?.response?.data?.detail as string | undefined;

    let message: string | undefined;
    if (status === 401) {
      message = detail || 'Sessão expirada. Entre novamente.';
      // limpa token para forçar reautenticação
      try {
        // evitar import dinâmico de AsyncStorage aqui; delegar ao consumidor
        delete api.defaults.headers.common.Authorization;
      } catch {}
    } else if (status === 403) {
      message = detail || 'Acesso negado. Esta área é restrita a administradores.';
    } else if (status === 429) {
      message = detail || 'Muitas requisições. Tente novamente em alguns instantes.';
    } else if (status && status >= 500) {
      message = detail || 'Erro no servidor. Tente novamente mais tarde.';
    }

    if (message) {
      error.userMessage = message;
    }

    return Promise.reject(error);
  }
);

export const setAuthToken = (token?: string) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

// Permite alterar dinamicamente a base URL, se precisar apontar para outra porta
export const setBaseURL = (url: string) => {
  api.defaults.baseURL = url;
};

export const getBaseURL = (): string => api.defaults.baseURL as string;

// --- AUTH ---
export const login = (credentials: UserCredentials) => {
  const formData = new URLSearchParams();
  formData.append('username', credentials.email);
  formData.append('password', credentials.password);
  return api.post('/token', formData.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};

export const getMyProfile = (config?: AxiosRequestConfig) => {
  return api.get<User>('/users/me', config);
};


// --- PASSWORD RECOVERY (NOVAS FUNÇÕES) ---
export const requestPasswordRecovery = (email: string) => {
  // app_type 'gestao' garante que o e-mail contenha fidelizagestao://
  return api.post('/request-password-recovery', { email, app_type: 'gestao' });
};

export const resetPassword = (token: string, new_password: string) => {
  return api.post('/reset-password', { token, new_password });
};

// --- POINTS ---
export const addPoints = (clientId: string) => {
    return api.post<PointTransaction>('/points/add', { client_identifier: clientId });
};

// --- ADMIN DATA ---
export const getCollaborators = () => api.get<User[]>('/collaborators/');
export const addCollaborator = (data: CollaboratorCreate) => api.post<User>('/collaborators/', data);
export const updateCollaborator = (id: number, data: CollaboratorUpdate) => api.patch<User>(`/collaborators/${id}`, data);
export const deleteCollaborator = (id: number) => api.delete(`/collaborators/${id}`);

export const getRewards = () => api.get<Reward[]>('/rewards/');
export const addReward = (data: RewardCreate) => api.post<Reward>('/rewards/', data);

export const updateReward = (id: number, data: RewardUpdate) => api.patch<Reward>(`/rewards/${id}`, data);
export const deleteReward = (id: number) => api.delete(`/rewards/${id}`);

export const getTransactions = () => api.get<PointTransaction[]>('/points/transactions/');
export const getReport = () => api.get<CompanyReport>('/reports/summary');

// FUNÇÕES NOVAS PARA GERIR A EMPRESA
export const getMyCompanyDetails = () => {
  return api.get('/companies/me');
};

export const updateMyCompany = (companyData: Partial<CompanyDetails>) => {
  return api.patch('/companies/me', companyData);
};

// FUNÇÃO NOVA PARA O PERFIL DO UTILIZADOR
export const updateMyProfile = (userData: { name?: string; password?: string }) => {
  return api.patch('/users/me', userData);
};

