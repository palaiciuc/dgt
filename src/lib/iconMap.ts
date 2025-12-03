import { 
  Layers, Smartphone, BarChart3, FileSearch, AlertTriangle, 
  LineChart, Target, Users, Lightbulb, Globe, Shield,
  Database, Cloud, Lock, Key, CreditCard, Building,
  FileText, Settings, Zap, CheckCircle, Award, LucideIcon
} from 'lucide-react';

export const iconMap: Record<string, LucideIcon> = {
  Layers,
  Smartphone,
  BarChart3,
  FileSearch,
  AlertTriangle,
  LineChart,
  Target,
  Users,
  Lightbulb,
  Globe,
  Shield,
  Database,
  Cloud,
  Lock,
  Key,
  CreditCard,
  Building,
  FileText,
  Settings,
  Zap,
  CheckCircle,
  Award
};

export const getIcon = (iconName: string | undefined, fallback: LucideIcon = Layers): LucideIcon => {
  if (!iconName) return fallback;
  return iconMap[iconName] || fallback;
};
