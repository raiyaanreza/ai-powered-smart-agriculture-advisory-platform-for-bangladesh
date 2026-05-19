// @agri-packages/types
export type UserRole = 'user' | 'farmer' | 'expert' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Disease {
  id: string;
  name: string;
  nameBn: string;
  crop: string;
  type: 'Fungal' | 'Bacterial' | 'Viral' | 'Pest' | 'Healthy';
  severity: 'Low' | 'Medium' | 'High';
  description?: string;
  symptoms?: string[];
  management?: string[];
  images?: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'critical' | 'emergency';
  target_role: 'all' | 'farmer' | 'user';
  is_read: boolean;
  created_at: string;
}

export interface FarmerProfile {
  id: string;
  full_name: string;
  role: UserRole;
  is_verified: boolean;
  district: string;
  upazila?: string;
  language: 'en' | 'bn';
  onboarding_completed: boolean;
  application_data?: {
    phone?: string;
    farm_size_acres?: number;
    primary_crop?: string;
    experience_years?: number;
    nid_number?: string;
  };
}
