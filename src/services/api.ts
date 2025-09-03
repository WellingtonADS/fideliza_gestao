import axios, { AxiosRequestConfig } from 'axios';
import { User, UserCredentials } from '../types/auth';
import { CompanyReport, PointTransaction, Reward, RewardCreate, CollaboratorCreate, CollaboratorUpdate } from '../types/gestao';
import { CompanyDetails } from '../types/company';

export interface RewardUpdate {
    name?: string;
    description?: string;
    points_required?: number;
}

const api = axios.create({
  baseURL: 'https://fideliza-backend.onrender.com/api/v1',
});

export const setAuthToken = (token?: string) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
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

export default api;