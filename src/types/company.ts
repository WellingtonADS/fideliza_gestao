export interface CompanyDetails {
  id: number;
  name: string;
  logo_url?: string | null;
  address?: string | null;
  category?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  userName?: string | null; // Adicionada a propriedade para o nome do usuário
}
