export interface CompanyRep {
  id: number;
  exhibitor_id: number;
  company_name: string;
  name: string;
  phone?: string;
  email?: string;
  photo?: string;
  qrcode?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CompanyRepResponse {
  success: boolean;
  data?: CompanyRep[];
  message?: string;
} 