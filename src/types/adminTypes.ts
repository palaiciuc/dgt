export interface Solution {
  id: string;
  tag: string;
  title: string;
  description: string;
  icon?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Platform {
  id: string;
  title: string;
  description: string;
  icon?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AIFeature {
  id: string;
  title: string;
  description: string;
  icon?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AboutValue {
  id: string;
  title: string;
  description: string;
  icon?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  organization?: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  section: string;
  title?: string;
  subtitle?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  linkedin_url?: string;
  updated_at: string;
}

export const ICON_OPTIONS = [
  'Layers', 'Smartphone', 'BarChart3', 'FileSearch', 'AlertTriangle', 
  'LineChart', 'Target', 'Users', 'Lightbulb', 'Globe', 'Shield',
  'Database', 'Cloud', 'Lock', 'Key', 'CreditCard', 'Building',
  'FileText', 'Settings', 'Zap', 'CheckCircle', 'Award'
];
