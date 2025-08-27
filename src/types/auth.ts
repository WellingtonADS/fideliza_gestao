// src/types/auth.ts

// Para a função de login
export interface UserCredentials {
  email: string;
  password: string;
}

// Para o objeto de utilizador retornado pela API para parceiros
export interface User {
  id: number;
  name: string;
  email: string;
  user_type: 'ADMIN' | 'COLLABORATOR'; // Apenas estes tipos são permitidos
  company_id: number;
}
