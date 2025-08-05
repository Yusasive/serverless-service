export interface ExhibitorData {
  user_id: number;
  email: string;
  phone: string;
  first_name?: string;
  last_name?: string;
  user_type: string;
  verified: boolean;
  is_active: boolean;
  profile_pic?: string;
  gender?: string;
  stripe_id?: string;
  payment_id?: string;
  parent_exhibitor_id?: number;
  two_factor_enabled: boolean;
  
  // Exhibitor specific fields
  company?: string;
  local?: string;
  booth_preference?: string;
  booth_type?: string;
  rating?: number;
  status?: string;
  pin_code?: string;
  lat?: number;
  lng?: number;
  
  // Address information
  address?: Address[];
  
  // Related data
  parentExhibitor?: ExhibitorData;
  managedStaff?: ExhibitorData[];
  
  // Computed fields
  full_name?: string;
  registration_date?: string;
  booth_count?: number;
}

export interface Address {
  id: number;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  post_code: string;
  country: string;
  is_primary: boolean;
}

export interface ExhibitorFilter {
  status?: string;
  booth_type?: string;
  verified?: boolean;
  is_active?: boolean;
  company?: string;
}

export interface ExhibitorStats {
  total: number;
  active: number;
  inactive: number;
  verified: number;
  unverified: number;
  with_booths: number;
  without_booths: number;
} 