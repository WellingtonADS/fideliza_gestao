import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { User, UserCredentials } from '../types/auth';
import { CompanyReport, PointTransaction, Reward, RewardCreate, CollaboratorCreate, CollaboratorUpdate } from '../types/gestao';
import { CompanyDetails } from '../types/company';

export interface RewardUpdate {
    name?: string;
    description?: string;
    points_required?: number;
}

// Produção: backend hospedado no Render (forçado em todos os modos)
const PROD_BASE_URL = 'https://fideliza-backend.onrender.com/api/v1';
const PROD_ROOT_URL = PROD_BASE_URL.replace(/\/?api\/v1\/?$/, '');

// Client Axios padrão apontando para produção, com timeout estendido (Render cold start)
const api = axios.create({
  baseURL: PROD_BASE_URL,
  timeout: 30_000,
});

// Interceptor de respostas para mensagens claras e sign-out em 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const axiosErr = error as AxiosError<any>;
    const status = axiosErr?.response?.status as number | undefined;
    const detail = (axiosErr?.response?.data as any)?.detail as string | undefined;

    let message: string | undefined;
    // Timeout
    if (axiosErr.code === 'ECONNABORTED') {
      message = 'Tempo esgotado ao conectar ao servidor. Tente novamente.';
    }
    // Falha de rede (sem resposta)
    if (!status && !axiosErr.response) {
      message = message || 'Falha de rede. Verifique a sua conexão com a internet.';
    }
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

    if (message) (axiosErr as any).userMessage = message;

    return Promise.reject(axiosErr);
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

// Health-check simples sem autenticação
export const ping = async () => {
  const url = `${PROD_ROOT_URL}/docs`;
  return axios.get(url, { timeout: 3_000 });
};

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

