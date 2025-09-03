// src/types/gestao.ts
import { User } from './auth';

export interface Reward {
  id: number;
  name: string;
  description: string | null;
  points_required: number;
}

export interface PointTransaction {
  id: number;
  points: number;
  client: { name: string };
  awarded_by: { name: string };
  created_at: string;
}

export interface CompanyReport {
  total_points_awarded: number;
  total_rewards_redeemed: number;
  unique_customers: number;
}

// Para a criação de novos prémios
export interface RewardCreate {
    name: string;
    description?: string;
    points_required: number;
}

// Para a criação de novos colaboradores
export interface CollaboratorCreate {
    name: string;
    email: string;
    password: string;
}

// Para a atualização de colaboradores
export interface CollaboratorUpdate {
    name?: string;
    email?: string;
}

export interface CompanyReport {
  total_points_awarded: number;
  total_rewards_redeemed: number;
  unique_customers: number;
}

// Adiciona a interface DashboardData que estava em falta.
export interface DashboardData {
    unique_customers: number;
    total_points_awarded: number;
    total_rewards_redeemed: number;
}
