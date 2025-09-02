export interface CompanyDetails {
  id: number;
  name: string;
  logo_url?: string | null;
  address?: string | null;
  category?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}
